'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  AchievementPost,
  AchievementComment,
  getStoredAchievements,
  saveStoredAchievement,
  togglePostLike,
  addPostComment,
  deleteStoredAchievement,
} from '@/lib/data/profile-achievements';
import {
  Heart,
  MessageCircle,
  Share2,
  Image as ImageIcon,
  Send,
  Trash2,
  X,
  Upload,
  Sparkles,
  Trophy,
  Check,
  Eye,
  Camera,
} from 'lucide-react';
import { useRole } from '@/lib/auth/role-context';

interface AchievementsPostsSectionProps {
  profileId: string;
  profileName: string;
  profileHeadline?: string;
  profileAvatar?: string;
  isOwner?: boolean;
}

export default function AchievementsPostsSection({
  profileId,
  profileName,
  profileHeadline = 'Student Scholar & Builder',
  profileAvatar = '',
  isOwner: isOwnerProp,
}: AchievementsPostsSectionProps) {
  const { currentUser } = useRole();
  const isOwner = isOwnerProp || (currentUser && currentUser.id === profileId);

  const [posts, setPosts] = useState<AchievementPost[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  // New Post Form State
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Comment input map per post: { [postId]: commentText }
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  // Expanded comments section state: { [postId]: boolean }
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setPosts(getStoredAchievements(profileId));
  }, [profileId]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    const finalPhoto = imagePreview || customImageUrl.trim();
    if (!finalPhoto) {
      alert('Please upload an achievement photo.');
      return;
    }

    const newPost: AchievementPost = {
      id: `post-${Date.now()}`,
      user_id: profileId,
      author_name: profileName,
      author_headline: profileHeadline,
      author_avatar: profileAvatar,
      photo_url: finalPhoto,
      caption: caption.trim() || 'Excited to share this milestone! 🚀',
      likes: currentUser ? [currentUser.id] : [],
      comments: [],
      created_at: new Date().toISOString(),
    };

    const updated = saveStoredAchievement(profileId, newPost);
    setPosts(updated);

    // Reset Form
    setCaption('');
    setImagePreview('');
    setCustomImageUrl('');
    setModalOpen(false);
  };

  const handleToggleLike = (postId: string) => {
    const likerId = currentUser?.id || 'guest-viewer';
    const updated = togglePostLike(profileId, postId, likerId);
    setPosts(updated);
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    const newComment: AchievementComment = {
      id: `comm-${Date.now()}`,
      user_id: currentUser?.id || 'guest-user',
      user_name: currentUser?.name || 'Campus Visitor',
      user_avatar: currentUser?.avatar || '',
      user_role: currentUser?.role || 'student',
      comment: text,
      created_at: new Date().toISOString(),
    };

    const updated = addPostComment(profileId, postId, newComment);
    setPosts(updated);

    // Clear input & ensure comments are visible
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    setExpandedComments((prev) => ({ ...prev, [postId]: true }));
  };

  const handleDeletePost = (postId: string) => {
    if (confirm('Delete this achievement post?')) {
      const updated = deleteStoredAchievement(profileId, postId);
      setPosts(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#1b59f8] font-bold mb-1">
            <Trophy className="w-4 h-4" />
            <span>Profile Achievements &amp; Photo Milestones</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Achievements &amp; Activities
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Photo posts, hackathon wins, research presentations, and milestones shared by {profileName}.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1b59f8] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Camera className="w-4 h-4" />
            <span>Post Achievement Photo</span>
          </button>
        )}
      </div>

      {/* Owner Quick Share Card (LinkedIn Style Prompt) */}
      {isOwner && (
        <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-sm shrink-0">
            {profileName.slice(0, 2)}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex-1 text-left px-4 py-2.5 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-400 font-medium transition-colors flex items-center justify-between"
          >
            <span>Share a new achievement photo, hackathon trophy, or milestone...</span>
            <ImageIcon className="w-4 h-4 text-[#1b59f8]" />
          </button>
        </div>
      )}

      {/* Posts Feed */}
      {posts.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <Trophy className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-900">No achievement posts yet</h4>
          <p className="text-xs text-slate-500 mt-1">
            {isOwner
              ? 'Share photos from hackathons, symposiums, project launches, or lab breakthroughs on your profile.'
              : `${profileName} hasn't posted any achievement photos yet.`}
          </p>
          {isOwner && (
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-full bg-[#0f172a] text-white text-xs font-bold hover:bg-black transition-colors"
            >
              + Post Your First Photo Achievement
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            const currentUserId = currentUser?.id || 'guest-viewer';
            const isLiked = post.likes.includes(currentUserId);
            const showComments = expandedComments[post.id] ?? false;

            return (
              <div
                key={post.id}
                className="rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                {/* Post Author Bar */}
                <div className="p-5 sm:p-6 pb-3 flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-[#0f172a] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {post.author_avatar ? (
                        <img
                          src={post.author_avatar}
                          alt={post.author_name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        post.author_name.slice(0, 2)
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 leading-snug">
                        {post.author_name}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-none mt-0.5 line-clamp-1">
                        {post.author_headline || 'Student Builder'}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {new Date(post.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {isOwner && (
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-slate-300 hover:text-red-500 p-1.5 transition-colors"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Post Caption */}
                {post.caption && (
                  <div className="px-5 sm:px-6 pb-3.5 text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                    {post.caption}
                  </div>
                )}

                {/* Achievement Photo (Only photos per spec) */}
                <div
                  onClick={() => setLightboxPhoto(post.photo_url)}
                  className="relative w-full max-h-[500px] bg-slate-950 overflow-hidden cursor-pointer group"
                >
                  <img
                    src={post.photo_url}
                    alt="Achievement"
                    className="w-full h-auto max-h-[500px] object-contain mx-auto group-hover:scale-[1.01] transition-transform duration-300"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2.5 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 backdrop-blur-xs">
                    <Eye className="w-3 h-3" />
                    <span>View full size</span>
                  </div>
                </div>

                {/* Likes & Comments Summary */}
                <div className="px-5 sm:px-6 py-2.5 flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 font-mono">
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px]">
                      ❤️
                    </span>
                    <strong>{post.likes.length}</strong> {post.likes.length === 1 ? 'like' : 'likes'}
                  </span>

                  <button
                    onClick={() =>
                      setExpandedComments((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                    className="hover:text-slate-800"
                  >
                    {post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}
                  </button>
                </div>

                {/* Post Action Buttons (Like & Comment) */}
                <div className="px-4 py-1.5 flex items-center justify-around border-b border-slate-100 text-xs font-semibold">
                  <button
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-all ${
                      isLiked
                        ? 'text-red-600 bg-red-50/80 font-bold'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-600 text-red-600' : ''}`} />
                    <span>{isLiked ? 'Liked' : 'Like'}</span>
                  </button>

                  <button
                    onClick={() =>
                      setExpandedComments((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                    className="flex-1 py-2 rounded-xl flex items-center justify-center gap-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Comment</span>
                  </button>
                </div>

                {/* Expandable Comments Section */}
                {showComments && (
                  <div className="p-5 sm:p-6 bg-slate-50/60 space-y-4">
                    {/* Add Comment Input */}
                    <form
                      onSubmit={(e) => handleAddComment(post.id, e)}
                      className="flex items-center gap-2"
                    >
                      <input
                        type="text"
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        placeholder="Add a congratulatory comment or technical query..."
                        className="flex-1 px-4 py-2 rounded-full bg-white border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1b59f8]"
                      />
                      <button
                        type="submit"
                        disabled={!commentInputs[post.id]?.trim()}
                        className="p-2.5 rounded-full bg-[#1b59f8] hover:bg-blue-600 disabled:opacity-40 text-white transition-all shadow-xs"
                        title="Post comment"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>

                    {/* Comments List */}
                    {post.comments.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-2">
                        No comments yet. Be the first to congratulate {post.author_name}!
                      </p>
                    ) : (
                      <div className="space-y-3 pt-1">
                        {post.comments.map((comm) => (
                          <div key={comm.id} className="flex items-start gap-2.5 text-xs">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                              {comm.user_avatar ? (
                                <img
                                  src={comm.user_avatar}
                                  alt={comm.user_name}
                                  className="w-full h-full rounded-full object-cover"
                                />
                              ) : (
                                comm.user_name.slice(0, 2)
                              )}
                            </div>
                            <div className="flex-1 bg-white border border-slate-200/80 rounded-2xl p-3 shadow-2xs">
                              <div className="flex items-center justify-between mb-0.5">
                                <span className="font-bold text-slate-900">
                                  {comm.user_name}
                                </span>
                                <span className="text-[10px] text-slate-400">
                                  {new Date(comm.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-slate-700 leading-relaxed text-xs">
                                {comm.comment}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Photo Preview */}
      {lightboxPhoto && (
        <div
          onClick={() => setLightboxPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center">
            <img
              src={lightboxPhoto}
              alt="Full view"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
            />
            <button
              onClick={() => setLightboxPhoto(null)}
              className="absolute top-3 right-3 text-white bg-black/60 rounded-full p-2 hover:bg-black"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Post Creation Modal */}
      {modalOpen && (
        <div
          onClick={() => setModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Share an Achievement Photo
                </h3>
                <p className="text-xs text-slate-500">
                  Upload photos from your hackathons, project demos, award ceremonies, or lab milestones.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              {/* Photo Upload (Required) */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Achievement Photo *
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Photo File</span>
                  </button>
                  <span className="text-slate-400">or enter image URL</span>
                </div>

                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => {
                    setCustomImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full mt-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#1b59f8]"
                />

                {imagePreview && (
                  <div className="mt-3 relative w-full h-56 rounded-2xl overflow-hidden border border-slate-200 bg-slate-900">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setCustomImageUrl('');
                      }}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Caption / Story
                </label>
                <textarea
                  rows={4}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="What did you achieve? Mention your teammates, event details, or technical takeaways..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#1b59f8] leading-relaxed resize-none"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-full text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!imagePreview && !customImageUrl}
                  className="px-5 py-2.5 rounded-full bg-[#1b59f8] hover:bg-blue-600 disabled:opacity-40 text-white font-bold transition-all shadow-xs"
                >
                  Post Achievement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export interface CertificateBadge {
  id: string;
  user_id: string;
  title: string;
  issuer: string;
  issue_date: string;
  expiry_date?: string;
  credential_id?: string;
  credential_url?: string;
  image_url: string;
  type: 'certificate' | 'badge';
  created_at: string;
}

export interface AchievementComment {
  id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  user_role?: string;
  comment: string;
  created_at: string;
}

export interface AchievementPost {
  id: string;
  user_id: string;
  author_name: string;
  author_avatar?: string;
  author_headline?: string;
  photo_url: string;
  caption: string;
  likes: string[]; // array of user IDs
  comments: AchievementComment[];
  created_at: string;
}

// Default sample data for demo profiles so profiles look rich immediately
export const SAMPLE_CERTIFICATES: Record<string, CertificateBadge[]> = {
  // Arjun Sharma (student@iitb.ac.in)
  '8ba443b3-af5c-422d-b3b0-fc2baeccc822': [
    {
      id: 'cert-1',
      user_id: '8ba443b3-af5c-422d-b3b0-fc2baeccc822',
      title: 'AWS Certified Cloud Practitioner (CLF-C02)',
      issuer: 'Amazon Web Services (AWS)',
      issue_date: 'Oct 2025',
      expiry_date: 'Oct 2028',
      credential_id: 'AWS-CCP-983141',
      credential_url: 'https://aws.amazon.com/verification',
      image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
      type: 'certificate',
      created_at: '2025-10-15T10:00:00Z',
    },
    {
      id: 'cert-2',
      user_id: '8ba443b3-af5c-422d-b3b0-fc2baeccc822',
      title: 'Deep Learning Specialization with PyTorch',
      issuer: 'DeepLearning.AI & Stanford Online',
      issue_date: 'Aug 2025',
      credential_id: 'DLAI-DL-54219',
      credential_url: 'https://coursera.org/verify/specialization',
      image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      type: 'certificate',
      created_at: '2025-08-20T12:00:00Z',
    },
    {
      id: 'cert-3',
      user_id: '8ba443b3-af5c-422d-b3b0-fc2baeccc822',
      title: 'Smart India Hackathon 2025 National Finalist Badge',
      issuer: 'Ministry of Education Innovation Cell (Govt of India)',
      issue_date: 'Nov 2025',
      credential_id: 'SIH2025-IITB-108',
      image_url: 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=800&auto=format&fit=crop&q=80',
      type: 'badge',
      created_at: '2025-11-05T09:00:00Z',
    },
  ],
  // Ragav S (ragav@iisc.ac.in)
  '4adab108-bcfd-43f4-9686-645a23f2fda7': [
    {
      id: 'cert-ragav-1',
      user_id: '4adab108-bcfd-43f4-9686-645a23f2fda7',
      title: 'Autonomous Mobile Robotics (ROS 2 & SLAM)',
      issuer: 'NPTEL & IIT Madras',
      issue_date: 'Sep 2025',
      credential_id: 'NPTEL25CS88S3',
      credential_url: 'https://nptel.ac.in/noc',
      image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
      type: 'certificate',
      created_at: '2025-09-10T11:00:00Z',
    },
    {
      id: 'cert-ragav-2',
      user_id: '4adab108-bcfd-43f4-9686-645a23f2fda7',
      title: 'Edge AI Systems Engineer - NVIDIA Deep Learning Institute',
      issuer: 'NVIDIA DLI',
      issue_date: 'Jul 2025',
      credential_id: 'NV-DLI-99238',
      image_url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80',
      type: 'badge',
      created_at: '2025-07-18T14:00:00Z',
    },
  ],
  // Demo Student Persona fallback (user-student)
  'user-student': [
    {
      id: 'cert-ragav-1',
      user_id: 'user-student',
      title: 'Autonomous Mobile Robotics (ROS 2 & SLAM)',
      issuer: 'NPTEL & IIT Madras',
      issue_date: 'Sep 2025',
      credential_id: 'NPTEL25CS88S3',
      credential_url: 'https://nptel.ac.in/noc',
      image_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80',
      type: 'certificate',
      created_at: '2025-09-10T11:00:00Z',
    },
    {
      id: 'cert-ragav-2',
      user_id: 'user-student',
      title: 'Edge AI Systems Engineer - NVIDIA Deep Learning Institute',
      issuer: 'NVIDIA DLI',
      issue_date: 'Jul 2025',
      credential_id: 'NV-DLI-99238',
      image_url: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=800&auto=format&fit=crop&q=80',
      type: 'badge',
      created_at: '2025-07-18T14:00:00Z',
    },
  ],
};

export const SAMPLE_ACHIEVEMENTS: Record<string, AchievementPost[]> = {
  // Arjun Sharma (student@iitb.ac.in)
  '8ba443b3-af5c-422d-b3b0-fc2baeccc822': [
    {
      id: 'post-1',
      user_id: '8ba443b3-af5c-422d-b3b0-fc2baeccc822',
      author_name: 'Arjun Sharma',
      author_headline: 'Full Stack Developer & AI Systems Engineer @ IIT Bombay',
      author_avatar: '',
      photo_url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1000&auto=format&fit=crop&q=80',
      caption:
        '🏆 Incredibly honored to share that our team won 1st Place at the Inter-College Hackathon 2026! We developed an offline-first mesh communications device for disaster relief with real-time audio sync. Huge shoutout to my fellow builders and our mentor Dr. Ramesh Kumar for the guidance! 🚀 #Hackathon #Builders #Engineering',
      likes: ['user-like-1', 'user-like-2', 'user-like-3', '4adab108-bcfd-43f4-9686-645a23f2fda7'],
      comments: [
        {
          id: 'comm-1',
          user_id: '028f8cbb-239e-45a3-b5ec-29c173777d1a',
          user_name: 'Dr. Ramesh Kumar',
          user_role: 'faculty',
          comment: 'Fantastic execution and thorough systems benchmarking! Well deserved recognition, Arjun.',
          created_at: '2026-03-12T16:20:00Z',
        },
        {
          id: 'comm-2',
          user_id: '3839c28a-891f-4dd6-a7c0-39539a211ea0',
          user_name: 'Sarah Jenkins',
          user_role: 'recruiter',
          comment: 'Super impressive architecture. The offline-first mesh protocol is especially innovative. Would love to connect!',
          created_at: '2026-03-12T17:45:00Z',
        },
      ],
      created_at: '2026-03-12T14:30:00Z',
    },
    {
      id: 'post-2',
      user_id: '8ba443b3-af5c-422d-b3b0-fc2baeccc822',
      author_name: 'Arjun Sharma',
      author_headline: 'Full Stack Developer & AI Systems Engineer @ IIT Bombay',
      author_avatar: '',
      photo_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1000&auto=format&fit=crop&q=80',
      caption:
        'Grateful for the opportunity to present our research paper on "High-Throughput Redis Cache-Aside Layers for Edge Next.js" at the National Systems Engineering Symposium! Engaging discussions with engineers on database failover protocols. 📊⚡ #Research #DistributedSystems #Redis',
      likes: ['user-like-1', 'user-like-4', 'user-like-5'],
      comments: [
        {
          id: 'comm-3',
          user_id: '4adab108-bcfd-43f4-9686-645a23f2fda7',
          user_name: 'Ragav S',
          user_role: 'student',
          comment: 'The benchmark graphs were super crisp! Congrats Arjun!',
          created_at: '2026-02-20T11:00:00Z',
        },
      ],
      created_at: '2026-02-20T09:15:00Z',
    },
  ],
  // Ragav S (ragav@iisc.ac.in)
  '4adab108-bcfd-43f4-9686-645a23f2fda7': [
    {
      id: 'post-ragav-1',
      user_id: '4adab108-bcfd-43f4-9686-645a23f2fda7',
      author_name: 'Ragav S',
      author_headline: 'Autonomous Robotics & Deep Learning Researcher @ IISc',
      author_avatar: '',
      photo_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000&auto=format&fit=crop&q=80',
      caption:
        'Completed live outdoor field trials of our autonomous LiDAR obstacle-avoidance rover today at IISc campus grounds! Zero navigational failures across 4 kilometers of unstructured terrain. 🤖🌲 #Robotics #ROS2 #IISc',
      likes: ['8ba443b3-af5c-422d-b3b0-fc2baeccc822', 'user-like-9'],
      comments: [
        {
          id: 'comm-r1',
          user_id: '8ba443b3-af5c-422d-b3b0-fc2baeccc822',
          user_name: 'Arjun Sharma',
          user_role: 'student',
          comment: 'The sensor fusion on this build is next level! Great job Ragav.',
          created_at: '2026-03-01T15:00:00Z',
        },
      ],
      created_at: '2026-03-01T12:00:00Z',
    },
  ],
  // Demo Student Persona fallback (user-student)
  'user-student': [
    {
      id: 'post-ragav-1',
      user_id: 'user-student',
      author_name: 'Ragav S',
      author_headline: 'Autonomous Robotics & Deep Learning Researcher @ IISc',
      author_avatar: '',
      photo_url: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1000&auto=format&fit=crop&q=80',
      caption:
        'Completed live outdoor field trials of our autonomous LiDAR obstacle-avoidance rover today at IISc campus grounds! Zero navigational failures across 4 kilometers of unstructured terrain. 🤖🌲 #Robotics #ROS2 #IISc',
      likes: ['8ba443b3-af5c-422d-b3b0-fc2baeccc822', 'user-like-9'],
      comments: [
        {
          id: 'comm-r1',
          user_id: '8ba443b3-af5c-422d-b3b0-fc2baeccc822',
          user_name: 'Arjun Sharma',
          user_role: 'student',
          comment: 'The sensor fusion on this build is next level! Great job Ragav.',
          created_at: '2026-03-01T15:00:00Z',
        },
      ],
      created_at: '2026-03-01T12:00:00Z',
    },
  ],
};

// Storage helper functions (Safely isolated in browser LocalStorage)
export function getStoredCertificates(userId: string): CertificateBadge[] {
  if (typeof window === 'undefined') {
    return SAMPLE_CERTIFICATES[userId] || SAMPLE_CERTIFICATES['4adab108-bcfd-43f4-9686-645a23f2fda7'] || [];
  }
  try {
    const raw = localStorage.getItem(`csc_certificates_${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading stored certificates:', e);
  }
  return SAMPLE_CERTIFICATES[userId] || SAMPLE_CERTIFICATES['4adab108-bcfd-43f4-9686-645a23f2fda7'] || [];
}

export function saveStoredCertificate(userId: string, cert: CertificateBadge): CertificateBadge[] {
  const existing = getStoredCertificates(userId);
  const updated = [cert, ...existing];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`csc_certificates_${userId}`, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('csc-credentials-updated', { detail: { userId, type: 'certificate' } }));
    } catch (e) {
      console.error('Error saving certificate:', e);
    }
  }
  return updated;
}

export function deleteStoredCertificate(userId: string, certId: string): CertificateBadge[] {
  const existing = getStoredCertificates(userId);
  const updated = existing.filter((c) => c.id !== certId);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`csc_certificates_${userId}`, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('csc-credentials-updated', { detail: { userId, type: 'certificate' } }));
    } catch (e) {
      console.error('Error deleting certificate:', e);
    }
  }
  return updated;
}

export function getStoredAchievements(userId: string): AchievementPost[] {
  if (typeof window === 'undefined') {
    return SAMPLE_ACHIEVEMENTS[userId] || SAMPLE_ACHIEVEMENTS['4adab108-bcfd-43f4-9686-645a23f2fda7'] || [];
  }
  try {
    const raw = localStorage.getItem(`csc_achievements_${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading stored achievements:', e);
  }
  return SAMPLE_ACHIEVEMENTS[userId] || SAMPLE_ACHIEVEMENTS['4adab108-bcfd-43f4-9686-645a23f2fda7'] || [];
}

export function saveStoredAchievement(userId: string, post: AchievementPost): AchievementPost[] {
  const existing = getStoredAchievements(userId);
  const updated = [post, ...existing];
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`csc_achievements_${userId}`, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('csc-credentials-updated', { detail: { userId, type: 'achievement' } }));
    } catch (e) {
      console.error('Error saving achievement post:', e);
    }
  }
  return updated;
}

export function togglePostLike(userId: string, postId: string, likerId: string): AchievementPost[] {
  const existing = getStoredAchievements(userId);
  const updated = existing.map((post) => {
    if (post.id === postId) {
      const alreadyLiked = post.likes.includes(likerId);
      const newLikes = alreadyLiked
        ? post.likes.filter((id) => id !== likerId)
        : [...post.likes, likerId];
      return { ...post, likes: newLikes };
    }
    return post;
  });

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`csc_achievements_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Error toggling like:', e);
    }
  }
  return updated;
}

export function addPostComment(
  userId: string,
  postId: string,
  comment: AchievementComment
): AchievementPost[] {
  const existing = getStoredAchievements(userId);
  const updated = existing.map((post) => {
    if (post.id === postId) {
      return { ...post, comments: [...post.comments, comment] };
    }
    return post;
  });

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`csc_achievements_${userId}`, JSON.stringify(updated));
    } catch (e) {
      console.error('Error adding comment:', e);
    }
  }
  return updated;
}

export function deleteStoredAchievement(userId: string, postId: string): AchievementPost[] {
  const existing = getStoredAchievements(userId);
  const updated = existing.filter((p) => p.id !== postId);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`csc_achievements_${userId}`, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('csc-credentials-updated', { detail: { userId, type: 'achievement' } }));
    } catch (e) {
      console.error('Error deleting achievement post:', e);
    }
  }
  return updated;
}

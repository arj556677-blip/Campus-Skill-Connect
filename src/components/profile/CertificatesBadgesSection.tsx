'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  CertificateBadge,
  getStoredCertificates,
  saveStoredCertificate,
  deleteStoredCertificate,
} from '@/lib/data/profile-achievements';
import {
  Award,
  Plus,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Trash2,
  X,
  Upload,
  CheckCircle2,
  FileText,
  Eye,
} from 'lucide-react';
import { useRole } from '@/lib/auth/role-context';

interface CertificatesBadgesSectionProps {
  profileId: string;
  profileName: string;
  isOwner?: boolean;
}

export default function CertificatesBadgesSection({
  profileId,
  profileName,
  isOwner: isOwnerProp,
}: CertificatesBadgesSectionProps) {
  const { currentUser } = useRole();
  const isOwner = isOwnerProp || (currentUser && currentUser.id === profileId);

  const [certificates, setCertificates] = useState<CertificateBadge[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<CertificateBadge | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialId, setCredentialId] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [certType, setCertType] = useState<'certificate' | 'badge'>('certificate');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [customImageUrl, setCustomImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCertificates(getStoredCertificates(profileId));
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

  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !issuer.trim()) return;

    const finalImage =
      imagePreview ||
      customImageUrl.trim() ||
      (certType === 'badge'
        ? 'https://images.unsplash.com/photo-1569683795645-b62e50fbf103?w=800&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80');

    const newCert: CertificateBadge = {
      id: `cert-${Date.now()}`,
      user_id: profileId,
      title: title.trim(),
      issuer: issuer.trim(),
      issue_date: issueDate.trim() || '2026',
      credential_id: credentialId.trim() || undefined,
      credential_url: credentialUrl.trim() || undefined,
      image_url: finalImage,
      type: certType,
      created_at: new Date().toISOString(),
    };

    const updated = saveStoredCertificate(profileId, newCert);
    setCertificates(updated);

    // Reset Form
    setTitle('');
    setIssuer('');
    setIssueDate('');
    setCredentialId('');
    setCredentialUrl('');
    setImagePreview('');
    setCustomImageUrl('');
    setModalOpen(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this credential?')) {
      const updated = deleteStoredCertificate(profileId, id);
      setCertificates(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#1b59f8] font-bold mb-1">
            <Award className="w-4 h-4" />
            <span>Verified Credentials &amp; Badges</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Licenses &amp; Certifications
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Accredited course certifications, cloud badges, and hackathon honors earned by {profileName}.
          </p>
        </div>

        {isOwner && (
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1b59f8] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-xs shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Certificate / Badge</span>
          </button>
        )}
      </div>

      {/* Certificates List */}
      {certificates.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-12 text-center max-w-md mx-auto shadow-xs">
          <Award className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-900">No certificates or badges added yet</h4>
          <p className="text-xs text-slate-500 mt-1">
            {isOwner
              ? 'Upload your course completions, cloud credentials, or hackathon badges to showcase on your profile.'
              : `${profileName} hasn't listed any certificates yet.`}
          </p>
          {isOwner && (
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 px-4 py-2 rounded-full bg-[#0f172a] text-white text-xs font-bold hover:bg-black transition-colors"
            >
              + Add Your First Certificate
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="group relative rounded-2xl bg-white border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-blue-400 transition-all duration-200 flex flex-col justify-between"
            >
              <div className="flex items-start gap-4">
                {/* Certificate Icon / Thumbnail */}
                <div
                  onClick={() => setSelectedPreview(cert)}
                  className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 cursor-pointer group-hover:ring-2 group-hover:ring-blue-400 transition-all"
                  title="Click to view credential"
                >
                  {cert.image_url ? (
                    <img
                      src={cert.image_url}
                      alt={cert.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-600 font-bold text-xs">
                      CERT
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Eye className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                        cert.type === 'badge'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}
                    >
                      {cert.type}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {cert.issue_date}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {cert.title}
                  </h4>
                  <p className="text-xs font-medium text-slate-600 mt-0.5 truncate">
                    {cert.issuer}
                  </p>

                  {cert.credential_id && (
                    <p className="text-[11px] font-mono text-slate-400 mt-1 truncate">
                      ID: {cert.credential_id}
                    </p>
                  )}
                </div>

                {/* Owner Delete Button */}
                {isOwner && (
                  <button
                    onClick={(e) => handleDelete(cert.id, e)}
                    className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                    title="Remove credential"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Action Link Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setSelectedPreview(cert)}
                  className="inline-flex items-center gap-1 font-semibold text-[#1b59f8] hover:underline text-xs"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Show Credential</span>
                </button>

                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 font-medium text-xs"
                  >
                    <span>Verify with Issuer</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Credential Preview Modal */}
      {selectedPreview && (
        <div
          onClick={() => setSelectedPreview(null)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl border border-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase text-[#1b59f8]">
                  Verified Credential Preview
                </span>
                <h3 className="font-extrabold text-lg text-slate-900">
                  {selectedPreview.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Issued by {selectedPreview.issuer} • {selectedPreview.issue_date}
                </p>
              </div>
              <button
                onClick={() => setSelectedPreview(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-100 max-h-[60vh] flex items-center justify-center border border-slate-200">
              <img
                src={selectedPreview.image_url}
                alt={selectedPreview.title}
                className="w-full h-auto max-h-[55vh] object-contain"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              {selectedPreview.credential_id && (
                <span className="text-xs font-mono text-slate-500">
                  Credential ID: {selectedPreview.credential_id}
                </span>
              )}
              {selectedPreview.credential_url && (
                <a
                  href={selectedPreview.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1b59f8] text-white text-xs font-bold hover:bg-blue-600 ml-auto"
                >
                  <span>Verify at Official Source</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Certificate / Badge Modal */}
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
                  Add License or Certification
                </h3>
                <p className="text-xs text-slate-500">
                  Showcase verifiable proof of courses, skill badges, and competitions.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCertificate} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-full border border-slate-200">
                <button
                  type="button"
                  onClick={() => setCertType('certificate')}
                  className={`flex-1 py-1.5 rounded-full font-bold transition-all ${
                    certType === 'certificate'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Certificate / Course
                </button>
                <button
                  type="button"
                  onClick={() => setCertType('badge')}
                  className={`flex-1 py-1.5 rounded-full font-bold transition-all ${
                    certType === 'badge'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Honor / Competition Badge
                </button>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Credential Name *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect, Meta React Developer"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#1b59f8]"
                />
              </div>

              {/* Issuer */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services, Coursera, IIT Bombay, Google"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#1b59f8]"
                />
              </div>

              {/* Issue Date & Credential ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="text"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    placeholder="e.g. Oct 2025"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#1b59f8]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Credential ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="e.g. AWS-83910"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#1b59f8]"
                  />
                </div>
              </div>

              {/* Credential URL */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Verification URL (Optional)
                </label>
                <input
                  type="url"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#1b59f8]"
                />
              </div>

              {/* Certificate Image / Photo Upload */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Certificate Document or Badge Photo
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
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image File</span>
                  </button>
                  <span className="text-slate-400">or enter image URL below</span>
                </div>

                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => {
                    setCustomImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  placeholder="https://example.com/certificate.png"
                  className="w-full mt-2 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-[#1b59f8]"
                />

                {imagePreview && (
                  <div className="mt-2 relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview('');
                        setCustomImageUrl('');
                      }}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
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
                  className="px-5 py-2 rounded-full bg-[#1b59f8] hover:bg-blue-600 text-white font-bold transition-all shadow-xs"
                >
                  Save Credential
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

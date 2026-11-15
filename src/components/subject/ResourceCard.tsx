import React from 'react';
import { useApp } from '../../context/AppContext';
import { Resource, ResourceType } from '../../types';
import { 
  FileText, 
  HelpCircle, 
  FlaskConical, 
  FolderGit2, 
  Eye, 
  Download, 
  Bookmark, 
  CheckCircle2, 
  Calendar, 
  ArrowDownToLine, 
  Layers,
  Sparkles,
  Star
} from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  onPreview?: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, onPreview }) => {
  const { 
    downloadResource, 
    downloadingId, 
    isBookmarked, 
    toggleBookmark, 
    setPreviewResource,
    subjects
  } = useApp();

  const isDownloading = downloadingId === resource.id;
  const bookmarked = isBookmarked(resource.id);
  const subject = subjects.find(s => s.id === resource.subjectId);

  const getFormatBadge = () => {
    return 'bg-[var(--tint)] text-[var(--link)] border-[var(--border)]';
  };

  const getTypeIcon = (type: ResourceType) => {
    switch (type) {
      case 'notes':
        return <FileText className="w-5 h-5 text-[var(--link)]" />;
      case 'importantQuestions':
        return <HelpCircle className="w-5 h-5 text-[var(--accent)]" />;
      case 'labManuals':
        return <FlaskConical className="w-5 h-5 text-[var(--link)]" />;
      case 'projects':
        return <FolderGit2 className="w-5 h-5 text-[var(--accent)]" />;
      default:
        return <FileText className="w-5 h-5 text-[var(--link)]" />;
    }
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    } else {
      setPreviewResource(resource);
    }
  };

  return (
    <div className="group relative bg-[var(--surface)] text-[var(--text)] rounded-xl border border-[var(--border)] p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full hover:border-[var(--focus)]">
      <div>
        {/* Top Meta Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getFormatBadge()}`}>
              {resource.fileFormat} • {resource.fileSize}
            </span>

            {resource.isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-[var(--tint)] text-[var(--link)] border border-[var(--border)]">
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </span>
            )}
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(resource.id)}
            className={`p-2 rounded-lg text-xs transition-colors shrink-0 cursor-pointer ${
              bookmarked
                ? 'bg-[var(--tint)] text-[var(--accent)] border border-[var(--border)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--tint)]'
            }`}
            title={bookmarked ? 'Remove bookmark' : 'Bookmark this resource'}
            aria-label="Bookmark"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[var(--accent)] text-[var(--accent)]' : ''}`} />
          </button>
        </div>

        {/* Unit / Topic Pill */}
        <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--link)] line-clamp-1 mb-1">
          {resource.unitOrTopic}
        </p>

        {/* Title */}
        <h3 
          onClick={handlePreview}
          className="text-sm sm:text-base font-bold text-[var(--text)] group-hover:text-[var(--link)] transition-colors cursor-pointer line-clamp-2 leading-snug"
          title={resource.title}
        >
          {resource.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-2 leading-relaxed">
          {resource.description}
        </p>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {resource.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium px-2 py-0.5 rounded bg-[var(--bg)] text-[var(--text-muted)] border border-[var(--border)]"
              >
                #{tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="text-[10px] text-[var(--text-muted)]">
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata and Action Buttons */}
      <div className="mt-5 pt-4 border-t border-[var(--border)]">
        <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)] mb-3">
          <div className="flex items-center gap-1.5 truncate">
            <span className="truncate">{resource.uploaderName}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 font-medium">
            <span className="inline-flex items-center gap-1 text-[var(--text-muted)]">
              <ArrowDownToLine className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              {resource.downloadCount.toLocaleString()} downloads
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-0.5 text-[var(--accent)] font-semibold">
              <Star className="w-3 h-3 fill-[var(--accent)] text-[var(--accent)]" />
              {resource.rating}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handlePreview}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold btn-secondary transition-colors min-h-[38px] cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview PDF</span>
          </button>

          <button
            onClick={() => downloadResource(resource.id)}
            disabled={isDownloading}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold btn-primary shadow-xs transition-colors min-h-[38px] disabled:opacity-75 cursor-pointer"
          >
            {isDownloading ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span>{isDownloading ? 'Saving...' : 'Download'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

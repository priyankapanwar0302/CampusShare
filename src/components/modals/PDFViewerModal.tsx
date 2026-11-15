import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDisplayDate } from '../../types';
import { 
  X, 
  Download, 
  Bookmark, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Share2, 
  Copy, 
  FileText, 
  List,
  Printer
} from 'lucide-react';

export const PDFViewerModal: React.FC = () => {
  const { 
    previewResource, 
    setPreviewResource, 
    downloadResource, 
    downloadingId, 
    isBookmarked, 
    toggleBookmark,
    addToast,
    subjects
  } = useApp();

  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (previewResource) {
      setCurrentPage(1);
      setZoomLevel(100);
      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.showModal();
      }
    } else {
      if (dialogRef.current && dialogRef.current.open) {
        dialogRef.current.close();
      }
    }
  }, [previewResource]);

  if (!previewResource) return null;

  const subject = subjects.find(s => s.id === previewResource.subjectId);
  const pages = previewResource.previewPages || [];
  const totalPages = Math.max(pages.length, previewResource.pageCount || 1);
  const activePageData = pages[currentPage - 1] || pages[0];

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!dialogRef.current) return;
    const rect = dialogRef.current.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isOutside) {
      setPreviewResource(null);
    }
  };

  const handleCopyCitation = () => {
    const citation = `${previewResource.title} — ${subject?.name || ''} (${subject?.code || ''}), CampusShare Academic Repository (Uploaded ${previewResource.uploadDate})`;
    navigator.clipboard.writeText(citation);
    addToast({
      title: 'Citation Copied',
      message: 'Academic citation reference copied to clipboard.',
      type: 'info',
    });
  };

  const bookmarked = isBookmarked(previewResource.id);
  const isDownloading = downloadingId === previewResource.id;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={() => setPreviewResource(null)}
      aria-labelledby="pdf-viewer-title"
      className="p-0 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl w-[95vw] max-w-5xl h-[90vh] text-[var(--text)] overflow-hidden backdrop:bg-black/60 backdrop:backdrop-blur-xs m-auto flex flex-col"
    >
      {/* Top PDF Reader Toolbar */}
      <div className="bg-[var(--surface)] border-b border-[var(--border)] px-4 py-2.5 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setSidebarOpen(prev => !prev)}
            aria-label="Toggle table of contents"
            className={`p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--tint)] transition-colors cursor-pointer ${
              sidebarOpen ? 'bg-[var(--tint)] text-[var(--text)]' : ''
            }`}
            title="Toggle Outline / Table of Contents"
          >
            <List className="w-4 h-4" />
          </button>

          <div className="min-w-0">
            <h2 id="pdf-viewer-title" title={previewResource.title} className="text-xs sm:text-sm font-semibold truncate text-[var(--text)]">
              {previewResource.title}
            </h2>
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <span>{previewResource.fileSize}</span>
              <span>•</span>
              <span className="text-[var(--link)] font-medium">Admin uploaded</span>
              <span>•</span>
              <span>{previewResource.uploaderName}</span>
            </div>
          </div>
        </div>

        {/* Reader Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs">
            <button
              onClick={() => setZoomLevel(prev => Math.max(75, prev - 15))}
              className="text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              title="Zoom Out"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="w-10 text-center font-mono text-[11px] text-[var(--text)]">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
              className="text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              title="Zoom In"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Page Selector */}
          <div className="flex items-center gap-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg px-2 py-1 text-xs">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30 disabled:hover:text-[var(--text-muted)] cursor-pointer"
              title="Previous Page"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-1 text-[var(--text)]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-0.5 text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-30 disabled:hover:text-[var(--text-muted)] cursor-pointer"
              title="Next Page"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Bookmark Button */}
          <button
            onClick={() => toggleBookmark(previewResource.id)}
            aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
            className={`p-2 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              bookmarked
                ? 'bg-[var(--tint)] text-[var(--accent)] border border-[var(--border)]'
                : 'text-[var(--text-muted)] hover:bg-[var(--tint)] hover:text-[var(--text)]'
            }`}
            title={bookmarked ? 'Saved to Bookmarks' : 'Bookmark this resource'}
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-[var(--accent)] text-[var(--accent)]' : ''}`} />
          </button>

          {/* Copy citation */}
          <button
            onClick={handleCopyCitation}
            aria-label="Copy citation"
            className="hidden md:inline-flex p-2 text-[var(--text-muted)] hover:bg-[var(--tint)] hover:text-[var(--text)] rounded-lg text-xs cursor-pointer"
            title="Copy Citation"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Download button */}
          <button
            onClick={() => downloadResource(previewResource.id)}
            disabled={isDownloading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold btn-primary shadow-xs transition-colors cursor-pointer"
          >
            {isDownloading ? (
              <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <Download className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Download</span>
          </button>

          {/* Close button */}
          <button
            onClick={() => setPreviewResource(null)}
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--tint)] rounded-lg ml-1 cursor-pointer"
            aria-label="Close PDF Viewer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden bg-[var(--bg)]">
        {/* Collapsible Outline / Table of Contents */}
        {sidebarOpen && (
          <div className="w-64 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col shrink-0 text-xs">
            <div className="p-3 border-b border-[var(--border)] flex items-center justify-between text-[var(--text-muted)] font-semibold uppercase tracking-wider text-[11px]">
              <span>Table of Contents</span>
              <span className="text-[10px] bg-[var(--bg)] px-1.5 py-0.5 rounded border border-[var(--border)] text-[var(--text-muted)]">
                {pages.length} Section{pages.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {pages.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(p.pageNumber)}
                  className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start gap-2 cursor-pointer ${
                    currentPage === p.pageNumber
                      ? 'bg-[var(--tint)] text-[var(--link)] border border-[var(--border)] font-semibold'
                      : 'text-[var(--text)] hover:bg-[var(--tint)]'
                  }`}
                >
                  <span className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">
                    #{p.pageNumber}
                  </span>
                  <span className="truncate flex-1">{p.title}</span>
                </button>
              ))}

              <div className="mt-4 pt-3 border-t border-[var(--border)] p-2 text-[11px] text-[var(--text-muted)] space-y-2">
                <p><strong>Course:</strong> {subject?.name || 'Academic Course'}</p>
                <p><strong>Module:</strong> {previewResource.unitOrTopic}</p>
                <p><strong>Total Downloads:</strong> {previewResource.downloadCount.toLocaleString()}</p>
                <button
                  onClick={handleCopyCitation}
                  className="inline-flex items-center gap-1 text-[var(--link)] hover:underline pt-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  Copy Citation
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rendered PDF Page View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start">
          <div 
            style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
            className="w-full max-w-3xl bg-[var(--surface)] text-[var(--text)] rounded-xl shadow-2xl p-8 sm:p-12 min-h-[750px] flex flex-col justify-between transition-transform duration-150 border border-[var(--border)]"
          >
            {/* Page Header */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-[var(--border)] pb-3 mb-6">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--link)]">
                    CampusShare Academic Repository
                  </p>
                  <h3 className="text-lg font-bold text-[var(--text)]">
                    {subject?.name || 'Department of Engineering'} ({subject?.code})
                  </h3>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded bg-[var(--tint)] text-[10px] font-bold text-[var(--text)] uppercase border border-[var(--border)]">
                    {previewResource.type}
                  </span>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5 font-mono">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>
              </div>

              {/* Title & Topic */}
              <div className="mb-6">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[var(--tint)] text-[var(--link)] border border-[var(--border)]">
                  {previewResource.unitOrTopic}
                </span>
                <h4 className="text-xl font-bold text-[var(--text)] mt-2">
                  {activePageData?.title || previewResource.title}
                </h4>
              </div>

              {/* Page Content Body */}
              <div className="space-y-4 text-sm text-[var(--text)] leading-relaxed">
                {activePageData?.content.map((paragraph, i) => (
                  <p key={i} className="text-justify">
                    {paragraph}
                  </p>
                ))}

                {/* Mathematical Formula Snippet (if available) */}
                {activePageData?.formulaSnippet && (
                  <div className="my-5 p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)] font-mono text-center text-sm text-[var(--text)]">
                    <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-1">
                      Mathematical Formulation
                    </p>
                    <div className="text-base font-semibold py-1">
                      {activePageData.formulaSnippet}
                    </div>
                  </div>
                )}

                {/* Code Snippet (if available) */}
                {activePageData?.codeSnippet && (
                  <div className="my-5 rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--bg)] text-[var(--text)]">
                    <div className="px-3.5 py-1.5 bg-[var(--tint)] text-[11px] font-mono text-[var(--text)] flex items-center justify-between border-b border-[var(--border)]">
                      <span>Implementation Reference</span>
                      <span>Verified Snippet</span>
                    </div>
                    <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-[var(--text)]">
                      <code>{activePageData.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {/* Simulated Document Footer Notes */}
                <div className="mt-8 p-4 rounded-xl bg-[var(--tint)] border border-[var(--border)] text-xs text-[var(--text)] space-y-1">
                  <p className="font-semibold text-[var(--text)]">Key Takeaway for Examinations:</p>
                  <ul className="list-disc list-inside space-y-1 text-[var(--text)]">
                    <li>Always define time and space complexities explicitly in your answer script.</li>
                    <li>State all assumptions and draw intermediate rotation/state tables clearly.</li>
                    <li>Refer to the department question bank for related 16-mark numericals.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Page Footer Watermark */}
            <div className="mt-12 pt-4 border-t border-[var(--border)] flex items-center justify-between text-[11px] text-[var(--text-muted)]">
              <span className="font-mono">Document Ref: {previewResource.id}</span>
              <span className="font-medium text-[var(--text-muted)]">
                Uploaded by {previewResource.uploaderName} • CampusShare Academic Peer Network
              </span>
              <span className="font-mono">{formatDisplayDate(previewResource.uploadDate)}</span>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  );
};

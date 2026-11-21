import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Upload, 
  X, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  FileUp, 
  Loader2 
} from 'lucide-react';
import { ResourceType } from '../../types';
import { 
  STUDENT_FILE_ACCEPT, 
  validateStudentDocumentFile 
} from '../../security/sanitization';

export const StudentUploadModal: React.FC = () => {
  const { 
    studentUploadModal, 
    setStudentUploadModal, 
    courses, 
    subjects, 
    uploadStudentResource, 
    currentUser,
    setAuthModalOpen
  } = useApp();

  const [courseId, setCourseId] = useState('cse');
  const [subjectId, setSubjectId] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('notes');
  const [title, setTitle] = useState('');
  const [unitOrTopic, setUnitOrTopic] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronize modal state on opening
  useEffect(() => {
    if (studentUploadModal.isOpen) {
      setFileError(null);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      if (studentUploadModal.defaultCourseId) {
        setCourseId(studentUploadModal.defaultCourseId);
      }
      if (studentUploadModal.defaultSubjectId) {
        setSubjectId(studentUploadModal.defaultSubjectId);
        const sub = subjects.find(s => s.id === studentUploadModal.defaultSubjectId);
        if (sub) {
          setCourseId(sub.courseId);
        }
      } else {
        const availableSubs = subjects.filter(s => s.courseId === (studentUploadModal.defaultCourseId || 'cse'));
        if (availableSubs.length > 0) {
          setSubjectId(availableSubs[0].id);
        }
      }

      if (studentUploadModal.defaultType) {
        setResourceType(studentUploadModal.defaultType);
      }

      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.showModal();
      }
    } else {
      if (dialogRef.current && dialogRef.current.open) {
        dialogRef.current.close();
      }
    }
  }, [studentUploadModal, subjects]);

  // Keep subjects in sync with selected course
  const currentCourseSubjects = subjects.filter(s => s.courseId === courseId);

  useEffect(() => {
    if (currentCourseSubjects.length > 0) {
      const match = currentCourseSubjects.find(s => s.id === subjectId);
      if (!match) {
        setSubjectId(currentCourseSubjects[0].id);
      }
    } else {
      setSubjectId('');
    }
  }, [courseId, subjects]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!dialogRef.current) return;
    const rect = dialogRef.current.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isOutside) {
      setStudentUploadModal({ isOpen: false });
    }
  };

  const processSelectedFile = (file: File) => {
    const validation = validateStudentDocumentFile(file);
    if (!validation.isValid) {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedFile(null);
      setFileError(validation.error || 'Invalid file');
      return;
    }

    setFileError(null);
    setSelectedFile(file);
    if (!title.trim()) {
      // Auto-fill clean title from file name
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .trim();
      if (cleanName) {
        setTitle(cleanName);
      }
    }
    if (!unitOrTopic.trim()) {
      setUnitOrTopic('Unit 1');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleClearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFileError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title.trim() || !unitOrTopic.trim()) return;

    if (!currentUser) {
      setStudentUploadModal({ isOpen: false });
      setAuthModalOpen(true);
      return;
    }

    const selSub = subjects.find(s => s.id === subjectId);
    const semester = selSub ? selSub.semester : 1;

    setIsUploading(true);
    const res = await uploadStudentResource({
      courseId,
      subjectId: subjectId || 'cs201',
      semester,
      type: resourceType,
      title: title.trim(),
      unitOrTopic: unitOrTopic.trim(),
      description: description.trim() || undefined,
      file: selectedFile,
    });
    setIsUploading(false);

    if (res.success) {
      setTitle('');
      setUnitOrTopic('');
      setDescription('');
      setSelectedFile(null);
      setFileError(null);
      setStudentUploadModal({ isOpen: false });
    } else if (res.error) {
      setFileError(res.error);
    }
  };

  if (!studentUploadModal.isOpen) return null;

  const categoryOptions: { key: ResourceType; label: string }[] = [
    { key: 'notes', label: 'Notes' },
    { key: 'importantQuestions', label: 'Important questions' },
    { key: 'labManuals', label: 'Lab manuals' },
    { key: 'projects', label: 'Projects' },
  ];

  return (
    <dialog
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-upload-modal-title"
      onClick={handleBackdropClick}
      className="p-0 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl w-full max-w-lg text-[var(--color-text)] overflow-hidden m-auto backdrop:bg-[var(--color-bg)]/80 backdrop:backdrop-blur-md"
    >
      <div className="p-6 sm:p-7 max-h-[90vh] overflow-y-auto space-y-5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[var(--cherry-pink-subtle)] border border-[var(--cherry-pink-border)] flex items-center justify-center text-[var(--cherry-pink)]">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 id="student-upload-modal-title" className="text-base font-extrabold tracking-tight text-[var(--color-text)]">
                Upload Academic Material
              </h2>
              <p className="text-[11px] text-[var(--color-text-muted)]">
                Contribute verified curriculum notes and study resources
              </p>
            </div>
          </div>

          <button
            onClick={() => setStudentUploadModal({ isOpen: false })}
            aria-label="Close upload modal"
            className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Upload Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Dependent Selectors: Course & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text)] mb-1">
                Course / Program <span className="text-[var(--cherry-pink)]">*</span>
              </label>
              <select
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)] transition-colors"
                required
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text)] mb-1">
                Target Subject <span className="text-[var(--cherry-pink)]">*</span>
              </label>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)] transition-colors"
                required
              >
                {currentCourseSubjects.length === 0 ? (
                  <option value="">No subjects in this course</option>
                ) : (
                  currentCourseSubjects.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name} (Sem {s.semester})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* 4-Category Segmented Selector */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-text)] mb-1.5">
              Resource Category <span className="text-[var(--cherry-pink)]">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {categoryOptions.map(cat => (
                <button
                  type="button"
                  key={cat.key}
                  onClick={() => setResourceType(cat.key)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center truncate ${
                    resourceType === cat.key
                      ? 'border-[var(--cherry-pink)] bg-[var(--cherry-pink-subtle)] text-[var(--cherry-pink)] font-bold shadow-xs'
                      : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title and Module / Unit */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[var(--color-text)] mb-1">
                Document Title <span className="text-[var(--cherry-pink)]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Unit 3 Dynamic Programming Summary"
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--focus)] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[var(--color-text)] mb-1">
                Unit / Module <span className="text-[var(--cherry-pink)]">*</span>
              </label>
              <input
                type="text"
                value={unitOrTopic}
                onChange={e => setUnitOrTopic(e.target.value)}
                placeholder="e.g. Unit 3"
                className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--focus)] transition-colors"
                required
              />
            </div>
          </div>

          {/* Optional Notes / Description */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-text)] mb-1">
              Description / Study Notes <span className="text-[var(--color-text-muted)] font-normal text-[11px]">(Optional)</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide a brief summary of key topics, proofs, or exam tips covered..."
              className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-xs text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--focus)] transition-colors resize-none"
            />
          </div>

          {/* File Attachment Dropzone with Strict Validation */}
          <div>
            <label className="block text-xs font-bold text-[var(--color-text)] mb-1">
              File Attachment <span className="text-[var(--cherry-pink)]">*</span>
            </label>
            
            {/* Hidden Input strictly matching required accept string */}
            <input
              type="file"
              ref={fileInputRef}
              accept={STUDENT_FILE_ACCEPT}
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`p-4 sm:p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                isDragging
                  ? 'border-[var(--primary)] bg-[var(--color-tint)]'
                  : selectedFile
                  ? 'border-[var(--sage)] bg-[var(--color-bg)]'
                  : 'border-[var(--color-border)] hover:border-[var(--primary)] bg-[var(--color-bg)]'
              }`}
            >
              {selectedFile ? (
                <div className="flex items-center justify-between w-full px-2">
                  <div className="flex items-center gap-3 truncate text-left">
                    <div className="w-9 h-9 rounded-xl bg-[var(--sage)]/15 border border-[var(--sage)]/30 text-[var(--sage)] flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-[var(--color-text)] truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Ready to upload
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClearFile}
                    className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-rose-500 hover:bg-[var(--color-surface)] transition-colors cursor-pointer ml-2 shrink-0"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-center text-[var(--cherry-pink)] mb-2 shadow-xs">
                    <FileUp className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-bold text-[var(--color-text)]">
                    Click to choose file or drag & drop here
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted)] mt-1">
                    Strictly PDF or Word Documents (.pdf, .doc, .docx) • Maximum 5 MB
                  </p>
                </>
              )}
            </div>

            {/* Inline Error Message in Muted Red Text */}
            {fileError && (
              <div className="text-xs text-[var(--cherry-pink)] flex items-center gap-1.5 font-medium mt-2 bg-[var(--cherry-pink-subtle)] p-2.5 rounded-xl border border-[var(--cherry-pink-border)] animate-in fade-in duration-100">
                <AlertCircle className="w-4 h-4 shrink-0 text-[var(--cherry-pink)]" />
                <span>{fileError}</span>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--color-border)]">
            <button
              type="button"
              onClick={() => setStudentUploadModal({ isOpen: false })}
              disabled={isUploading}
              className="px-4 py-2 rounded-xl text-xs font-semibold btn-secondary transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!selectedFile || !title.trim() || !unitOrTopic.trim() || isUploading || !!fileError}
              className="px-5 py-2 rounded-xl text-xs font-bold btn-primary transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Uploading to repository...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Material</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </dialog>
  );
};

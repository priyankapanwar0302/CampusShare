import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Send, 
  X, 
  HelpCircle, 
  FileText, 
  FlaskConical, 
  FolderGit2, 
  BookOpen,
  Clock, 
  AlertTriangle 
} from 'lucide-react';
import { ResourceType } from '../../types';

export const RequestResourceModal: React.FC = () => {
  const { 
    requestModal, 
    setRequestModal, 
    courses, 
    subjects, 
    submitRequest, 
    currentUser,
    setAuthModalOpen
  } = useApp();

  const [courseId, setCourseId] = useState('cse');
  const [subjectId, setSubjectId] = useState('cs201');
  const [resourceType, setResourceType] = useState<ResourceType>('notes');
  const [topic, setTopic] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'medium' | 'high'>('medium');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (requestModal.isOpen) {
      if (requestModal.defaultSubjectId) {
        setSubjectId(requestModal.defaultSubjectId);
        const sub = subjects.find(s => s.id === requestModal.defaultSubjectId);
        if (sub) setCourseId(sub.courseId);
      }
      if (requestModal.defaultType) {
        setResourceType(requestModal.defaultType);
      }
      if (dialogRef.current && !dialogRef.current.open) {
        dialogRef.current.showModal();
      }
    } else {
      if (dialogRef.current && dialogRef.current.open) {
        dialogRef.current.close();
      }
    }
  }, [requestModal, subjects]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (!dialogRef.current) return;
    const rect = dialogRef.current.getBoundingClientRect();
    const isOutside =
      e.clientX < rect.left ||
      e.clientX > rect.right ||
      e.clientY < rect.top ||
      e.clientY > rect.bottom;
    if (isOutside) {
      setRequestModal({ isOpen: false });
    }
  };

  const currentCourseSubjects = subjects.filter(s => s.courseId === courseId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    if (!currentUser) {
      setAuthModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    const selCourse = courses.find(c => c.id === courseId);
    const selSubject = subjects.find(s => s.id === subjectId);

    setTimeout(() => {
      submitRequest({
        courseId,
        courseName: selCourse?.name || 'Engineering',
        subjectId,
        subjectName: selSubject?.name || 'Subject',
        resourceType,
        topic: topic.trim(),
        urgency,
        note: note.trim() || undefined,
      });

      setTopic('');
      setNote('');
      setIsSubmitting(false);
    }, 400);
  };

  if (!requestModal.isOpen) return null;

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onCancel={() => setRequestModal({ isOpen: false })}
      aria-labelledby="request-modal-title"
      className="p-0 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-2xl w-full max-w-lg text-[var(--text)] overflow-hidden backdrop:bg-black/60 backdrop:backdrop-blur-xs m-auto"
    >
      <div className="p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
          <div>
            <h2 id="request-modal-title" className="text-base sm:text-lg font-bold">
              Request Academic Material
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Notify department faculty coordinators and peer contributors for missing notes or important questions
            </p>
          </div>
          <button
            onClick={() => setRequestModal({ isOpen: false })}
            aria-label="Close request modal"
            className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text)] rounded-lg hover:bg-[var(--tint)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                Department / Course
              </label>
              <select
                value={courseId}
                onChange={e => {
                  setCourseId(e.target.value);
                  const firstSub = subjects.find(s => s.courseId === e.target.value);
                  if (firstSub) setSubjectId(firstSub.id);
                }}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] text-xs bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:border-[var(--focus)]"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text)] mb-1">
                Subject
              </label>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--border)] text-xs bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:border-[var(--focus)]"
              >
                {currentCourseSubjects.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.shortName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">
              Resource Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <button
                type="button"
                onClick={() => setResourceType('notes')}
                className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  resourceType === 'notes'
                    ? 'border-[var(--primary)] bg-[var(--tint)] text-[var(--link)] font-bold'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--tint)]'
                }`}
              >
                <FileText className="w-4 h-4" />
                Notes
              </button>

              <button
                type="button"
                onClick={() => setResourceType('importantQuestions')}
                className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  resourceType === 'importantQuestions'
                    ? 'border-[var(--primary)] bg-[var(--tint)] text-[var(--link)] font-bold'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--tint)]'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                Questions
              </button>

              <button
                type="button"
                onClick={() => setResourceType('labManuals')}
                className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  resourceType === 'labManuals'
                    ? 'border-[var(--primary)] bg-[var(--tint)] text-[var(--link)] font-bold'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--tint)]'
                }`}
              >
                <FlaskConical className="w-4 h-4" />
                Lab manuals
              </button>

              <button
                type="button"
                onClick={() => setResourceType('projects')}
                className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  resourceType === 'projects'
                    ? 'border-[var(--primary)] bg-[var(--tint)] text-[var(--link)] font-bold'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--tint)]'
                }`}
              >
                <FolderGit2 className="w-4 h-4" />
                Projects
              </button>

              <button
                type="button"
                onClick={() => setResourceType('syllabus')}
                className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  resourceType === 'syllabus'
                    ? 'border-[var(--primary)] bg-[var(--tint)] text-[var(--link)] font-bold'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--tint)]'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Syllabus
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">
              Topic or Missing Unit Description <span className="text-[var(--link)]">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. Unit 3 Bellman-Ford shortest path numericals with solutions"
              className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] text-xs sm:text-sm bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">
              Urgency Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUrgency('low')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  urgency === 'low'
                    ? 'border-[var(--primary)] bg-[var(--tint)] text-[var(--text)] font-bold'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--tint)]'
                }`}
              >
                General Reference
              </button>
              <button
                type="button"
                onClick={() => setUrgency('medium')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  urgency === 'medium'
                    ? 'border-[var(--accent)] bg-[var(--tint)] text-[var(--text)] font-bold'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--tint)]'
                }`}
              >
                Upcoming Quiz / Lab
              </button>
              <button
                type="button"
                onClick={() => setUrgency('high')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                  urgency === 'high'
                    ? 'border-[var(--primary)] bg-[var(--tint)] text-[var(--link)] font-bold'
                    : 'border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--tint)]'
                }`}
              >
                Exam within 48 Hours
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text)] mb-1">
              Additional Details / Context (Optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Professor mentioned this specific proof is likely for the 16-mark section..."
              className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] text-xs bg-[var(--bg)] text-[var(--text)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--focus)]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setRequestModal({ isOpen: false })}
              className="px-4 py-2 rounded-xl text-xs font-semibold btn-secondary cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !topic.trim()}
              className="px-5 py-2 rounded-xl text-xs font-bold btn-primary disabled:opacity-50 transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Request</span>
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

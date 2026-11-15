import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ResourceType } from '../../types';
import { AdminRouteGuard } from '../common/AdminRouteGuard';
import { validatePDFFile } from '../../security/sanitization';
import { 
  NAVIGATION_CONFIG, 
  RESOURCE_TYPES, 
  getFieldConfig, 
  getSpecializationConfig, 
  getSubjectConfig 
} from '../../data/navigationConfig';
import { 
  Upload, 
  Trash2, 
  FileText, 
  Search, 
  Eye, 
  AlertTriangle,
  X,
  FileCheck2,
  Layers,
  Sparkles,
  Inbox
} from 'lucide-react';

export const AdminManagementHub: React.FC = () => {
  const { 
    resources, 
    requests, 
    addResource, 
    deleteResource, 
    replaceResourceFile, 
    updateRequestStatus, 
    setPreviewResource, 
    goToHome 
  } = useApp();

  // Top Section: 4 Dependent Dropdown Selectors (Field -> Specialization -> Type -> Subject)
  const [fieldId, setFieldId] = useState<string>('engineering');
  const [specializationId, setSpecializationId] = useState<string>('cse');
  const [resourceType, setResourceType] = useState<ResourceType>('notes');
  const [subjectId, setSubjectId] = useState<string>('cs201');
  const [title, setTitle] = useState('');
  const [unitOrTopic, setUnitOrTopic] = useState('');
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: string } | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Bottom Section: Table Filter & Actions
  const [tableSearch, setTableSearch] = useState('');
  const [tableFilterType, setTableFilterType] = useState<ResourceType | 'all'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [replaceTargetId, setReplaceTargetId] = useState<string | null>(null);
  const [showRequestsDrawer, setShowRequestsDrawer] = useState(false);

  // Dependent options resolution from master config
  const currentField = getFieldConfig(fieldId) || NAVIGATION_CONFIG[0];
  const availableSpecializations = currentField?.specializations || [];
  const currentSpecialization = availableSpecializations.find(s => s.id === specializationId) || availableSpecializations[0];
  const availableSubjects = currentSpecialization?.subjects || [];

  // Handlers for chained updates with automatic resets on ancestor change
  const handleFieldChange = (newFieldId: string) => {
    setFieldId(newFieldId);
    const field = getFieldConfig(newFieldId);
    const firstSpec = field?.specializations[0];
    if (firstSpec) {
      setSpecializationId(firstSpec.id);
      setSubjectId(firstSpec.subjects[0]?.id || '');
    } else {
      setSpecializationId('');
      setSubjectId('');
    }
  };

  const handleSpecializationChange = (newSpecId: string) => {
    setSpecializationId(newSpecId);
    const spec = availableSpecializations.find(s => s.id === newSpecId);
    if (spec && spec.subjects.length > 0) {
      setSubjectId(spec.subjects[0].id);
    } else {
      setSubjectId('');
    }
  };

  // Hardened PDF Validation
  const handleFileDrop = async (file: File) => {
    setUploadError(null);
    const validation = await validatePDFFile(file);
    if (!validation.isValid) {
      setUploadError(validation.error || 'Invalid file format');
      return;
    }
    setSelectedFile({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    });
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldId || !specializationId || !resourceType || !subjectId) {
      setUploadError('All 4 navigation levels (Field, Specialization, Type, Subject) are required.');
      return;
    }
    if (!title.trim() || !unitOrTopic.trim()) {
      setUploadError('Please provide Document Title and Module topic.');
      return;
    }
    if (!selectedFile) {
      setUploadError('Please attach a verified PDF document.');
      return;
    }

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const success = addResource({
        courseId: specializationId,
        subjectId,
        semester: 1,
        type: resourceType,
        title: title.trim(),
        unitOrTopic: unitOrTopic.trim(),
        description: 'Verified academic resource uploaded by faculty administrator.',
        fileFormat: 'PDF',
        fileSize: selectedFile.size,
        pageCount: 16,
        rating: 5.0,
        uploaderName: 'Priyanka Panwar (Faculty Admin)',
        isVerified: true,
        tags: ['Verified', 'Curriculum File'],
        previewPages: [
          {
            pageNumber: 1,
            title: `${unitOrTopic}: Official Material`,
            content: [
              'This document has been reviewed and approved by the department faculty coordinator.',
              'Contains complete lecture notes, diagrams, and model exam problems.'
            ]
          }
        ]
      });

      if (success) {
        setTitle('');
        setUnitOrTopic('');
        setSelectedFile(null);
        setUploadError(null);
      }
    }, 600);
  };

  // Unmapped resources ("Needs sorting" section)
  const unmappedResources = resources.filter(res => !getSubjectConfig(res.subjectId));

  // Filtered Assets for Table
  const filteredAssets = resources.filter(res => {
    if (tableFilterType !== 'all' && res.type !== tableFilterType) return false;
    if (!tableSearch.trim()) return true;
    const q = tableSearch.toLowerCase();
    const subInfo = getSubjectConfig(res.subjectId);
    return (
      res.title.toLowerCase().includes(q) ||
      res.unitOrTopic.toLowerCase().includes(q) ||
      (subInfo?.subject.code && subInfo.subject.code.toLowerCase().includes(q))
    );
  });

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <AdminRouteGuard>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[var(--color-border)] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-bg)] text-[var(--link)] border border-[var(--color-border)]">
                Privileged Access
              </span>
              <span className="text-xs text-[var(--color-text-muted)]">Faculty Administrator Console</span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--color-text)]">
              Curriculum & Resource Management
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowRequestsDrawer(true)}
              className="px-3.5 py-1.5 rounded-xl btn-secondary text-xs font-semibold relative cursor-pointer"
            >
              <span>Student Requests</span>
              {pendingRequests.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[var(--color-accent)] text-[var(--color-accent-text)]">
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={goToHome}
              className="px-3.5 py-1.5 rounded-xl btn-secondary text-xs font-semibold cursor-pointer"
            >
              Back to Campus
            </button>
          </div>
        </div>

        {/* TOP SECTION: 4 Dependent Dropdown Selectors & Drag-and-Drop Uploader */}
        <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-2">
              <Upload className="w-4 h-4 text-[var(--link)]" />
              Upload New Academic Resource
            </h2>
            <span className="text-[11px] text-[var(--color-text-muted)]">4 Dependent Curriculum Dropdowns</span>
          </div>

          <form onSubmit={handleUploadSubmit} className="space-y-4.5">
            {/* 4 Dependent Dropdown Selectors: Field -> Specialization -> Type -> Subject */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* 1. Field */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text)] mb-1">
                  1. Field
                </label>
                <select
                  value={fieldId}
                  onChange={e => handleFieldChange(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)] font-medium"
                >
                  {NAVIGATION_CONFIG.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* 2. Specialization */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text)] mb-1">
                  2. Specialization
                </label>
                <select
                  value={specializationId}
                  onChange={e => handleSpecializationChange(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)] font-medium"
                >
                  {availableSpecializations.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              {/* 3. Resource Type */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text)] mb-1">
                  3. Resource Type
                </label>
                <select
                  value={resourceType}
                  onChange={e => setResourceType(e.target.value as ResourceType)}
                  className="w-full px-2.5 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] font-bold focus:outline-none focus:border-[var(--focus)]"
                >
                  {RESOURCE_TYPES.map(t => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
              </div>

              {/* 4. Subject */}
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text)] mb-1">
                  4. Subject
                </label>
                <select
                  value={subjectId}
                  onChange={e => setSubjectId(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)] font-medium"
                >
                  {availableSubjects.length > 0 ? (
                    availableSubjects.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.code} - {sub.name}</option>
                    ))
                  ) : (
                    <option value="">No subjects found</option>
                  )}
                </select>
              </div>
            </div>

            {/* Document Title & Unit Tag */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text)] mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Unit 3 Bellman-Ford Shortest Path Notes"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)]"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[var(--color-text)] mb-1">
                  Unit / Module Name
                </label>
                <input
                  type="text"
                  value={unitOrTopic}
                  onChange={e => setUnitOrTopic(e.target.value)}
                  placeholder="e.g. Unit 3: Graph Algorithms"
                  className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] text-xs bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)]"
                  required
                />
              </div>
            </div>

            {/* Clean Drag-and-Drop File Upload Zone */}
            <div
              onDragOver={e => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={async e => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  await handleFileDrop(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => {
                setSelectedFile({
                  name: 'Faculty_Approved_Curriculum_Resource.pdf',
                  size: '3.2 MB',
                });
                setUploadError(null);
              }}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-[var(--primary)] bg-[var(--tint)]'
                  : selectedFile
                  ? 'border-[var(--link)] bg-[var(--tint)]'
                  : 'border-[var(--color-border)] hover:border-[var(--focus)] bg-[var(--color-bg)]'
              }`}
            >
              {selectedFile ? (
                <div className="flex items-center justify-center gap-2.5">
                  <FileCheck2 className="w-5 h-5 text-[var(--link)]" />
                  <span className="text-xs font-bold text-[var(--color-text)]">
                    {selectedFile.name}
                  </span>
                  <span className="text-[11px] text-[var(--color-text-muted)]">({selectedFile.size})</span>
                  <span className="text-[11px] text-[var(--link)] font-bold underline ml-2">Click to replace</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Upload className="w-6 h-6 text-[var(--color-text-muted)] opacity-60 mx-auto" />
                  <p className="text-xs font-bold text-[var(--color-text)]">
                    Click to select PDF or drag and drop file here
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted)]">
                    Verified format (application/pdf • max 25MB)
                  </p>
                </div>
              )}
            </div>

            {uploadError && (
              <p className="text-xs text-[var(--link)] bg-[var(--tint)] p-2.5 rounded-xl border border-[var(--border)]">
                {uploadError}
              </p>
            )}

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                disabled={isUploading}
                className="px-5 py-2.5 rounded-xl text-xs font-bold btn-primary transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isUploading ? 'Publishing to Repository...' : 'Publish Resource'}
              </button>
            </div>
          </form>
        </section>

        {/* NEEDS SORTING SECTION: Unmapped Resources (Visible only to Admin) */}
        <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider flex items-center gap-2">
              <Inbox className="w-4 h-4 text-[var(--color-accent)]" />
              Needs Sorting ({unmappedResources.length})
            </h2>
            <span className="text-[11px] text-[var(--color-text-muted)]">Visible only to faculty admin</span>
          </div>

          {unmappedResources.length === 0 ? (
            <p className="text-xs text-[var(--color-text-muted)] bg-[var(--color-bg)] p-3 rounded-xl border border-[var(--color-border)]">
              All active files are properly mapped to the official Field &rarr; Specialization &rarr; Subject navigation hierarchy.
            </p>
          ) : (
            <div className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-xl overflow-hidden">
              {unmappedResources.map(res => (
                <div key={res.id} className="p-3 flex items-center justify-between text-xs bg-[var(--color-bg)]">
                  <div>
                    <span className="font-bold text-[var(--color-text)]">{res.title}</span>
                    <span className="text-[11px] text-[var(--color-text-muted)] ml-2">Legacy ID: {res.subjectId}</span>
                  </div>
                  <button
                    onClick={() => setPreviewResource(res)}
                    className="px-2.5 py-1 text-[11px] font-semibold btn-secondary rounded-lg cursor-pointer"
                  >
                    Review & Sort
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* BOTTOM SECTION: Asset Table */}
        <section className="bg-[var(--color-surface)] rounded-2xl border border-[var(--color-border)] p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider">
                Existing Documents ({filteredAssets.length})
              </h2>
              <p className="text-xs text-[var(--color-text-muted)]">
                Manage curriculum files across subjects
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[var(--color-text-muted)] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={tableSearch}
                  onChange={e => setTableSearch(e.target.value)}
                  placeholder="Filter by title..."
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:border-[var(--focus)]"
                />
              </div>

              <select
                value={tableFilterType}
                onChange={e => setTableFilterType(e.target.value as any)}
                className="px-2.5 py-1.5 text-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none font-medium"
              >
                <option value="all">All Sections</option>
                <option value="notes">Notes</option>
                <option value="importantQuestions">Important questions</option>
                <option value="labManuals">Lab manuals</option>
                <option value="projects">Projects</option>
                <option value="syllabus">Syllabus</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--color-bg)] text-[var(--color-text-muted)] font-bold border-b border-[var(--color-border)]">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Subject</th>
                  <th className="p-3.5">Section</th>
                  <th className="p-3.5">Size</th>
                  <th className="p-3.5">Downloads</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {filteredAssets.map(res => {
                  const subInfo = getSubjectConfig(res.subjectId);
                  return (
                    <tr key={res.id} className="hover:bg-[var(--color-bg)] transition-colors">
                      <td className="p-3.5 font-bold text-[var(--color-text)] max-w-xs truncate" title={res.title}>
                        {res.title}
                        <span className="block text-[10px] text-[var(--color-text-muted)] font-normal truncate mt-0.5" title={res.unitOrTopic}>
                          {res.unitOrTopic}
                        </span>
                      </td>

                      <td className="p-3.5 text-[var(--color-text-muted)] font-mono whitespace-nowrap">
                        {subInfo?.subject.code || res.subjectId}
                      </td>

                      <td className="p-3.5 capitalize text-[var(--color-text-muted)] whitespace-nowrap">
                        {res.type}
                      </td>

                      <td className="p-3.5 text-[var(--color-text-muted)] whitespace-nowrap">
                        {res.fileSize}
                      </td>

                      <td className="p-3.5 text-[var(--color-text)] whitespace-nowrap font-semibold">
                        {res.downloadCount.toLocaleString()}
                      </td>

                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewResource(res)}
                            className="p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text)] rounded-lg hover:bg-[var(--color-bg)] cursor-pointer"
                            title="Preview PDF"
                            aria-label={`Preview ${res.title}`}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => setReplaceTargetId(res.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold btn-secondary cursor-pointer"
                          >
                            Replace
                          </button>

                          <button
                            onClick={() => setDeleteConfirmId(res.id)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-[var(--link)] hover:bg-[var(--tint)] border border-[var(--border)] cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 max-w-sm w-full border border-[var(--color-border)] shadow-2xl space-y-4">
              <h3 className="text-sm font-bold text-[var(--color-text)]">
                Confirm Resource Deletion
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Are you sure you want to delete this resource? It will be removed immediately from all student repositories.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-semibold btn-secondary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteResource(deleteConfirmId);
                    setDeleteConfirmId(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold btn-primary cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Replace File Modal */}
        {replaceTargetId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-[var(--color-surface)] rounded-2xl p-6 max-w-sm w-full border border-[var(--color-border)] shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--color-text)]">
                  Replace Document File
                </h3>
                <button onClick={() => setReplaceTargetId(null)} aria-label="Close replace dialog" className="cursor-pointer text-[var(--color-text-muted)]">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-[var(--color-text-muted)]">
                Upload a revised PDF file to update the existing asset in-place.
              </p>
              <div
                onClick={() => {
                  replaceResourceFile(replaceTargetId, 'Revised_Version_Curriculum.pdf', '3.8 MB');
                  setReplaceTargetId(null);
                }}
                className="p-5 border-2 border-dashed border-[var(--color-border)] rounded-xl text-center cursor-pointer hover:bg-[var(--color-bg)] text-xs font-bold text-[var(--color-text)]"
              >
                Click to attach Revised_Version_Curriculum.pdf (3.8 MB)
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminRouteGuard>
  );
};

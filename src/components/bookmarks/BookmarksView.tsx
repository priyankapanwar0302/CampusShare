import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDisplayDate, Resource, BackpackFolder, UserBackpackUpload } from '../../types';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { 
  ChevronRight, 
  FileText, 
  Bookmark, 
  Download, 
  Eye, 
  FolderPlus, 
  Upload, 
  Folder, 
  Trash2, 
  Plus, 
  X, 
  Search, 
  FileUp, 
  FolderOpen
} from 'lucide-react';

interface BackpackItemDisplay {
  id: string;
  title: string;
  category: string;
  fileFormat: 'PDF' | 'DOCX' | 'ZIP';
  fileSize: string;
  pageCount: number;
  uploadDate: string;
  isOfficial: boolean;
  folderId?: string;
  originalResource?: Resource;
  uploadData?: UserBackpackUpload;
}

export const BookmarksView: React.FC = () => {
  const { 
    currentUser, 
    resources, 
    viewState,
    goToHome, 
    setPreviewResource, 
    downloadResource, 
    toggleBookmark, 
    setAuthModalOpen, 
    downloadingId,
    addToast 
  } = useApp();

  // Storage keys based on user ID
  const userId = currentUser?.id || 'guest';
  const FOLDERS_KEY = `campusshare_backpack_folders_${userId}`;
  const FOLDER_MAP_KEY = `campusshare_item_folder_map_${userId}`;
  const UPLOADS_KEY = `campusshare_backpack_uploads_${userId}`;

  // State: Folders
  const [folders, setFolders] = useState<BackpackFolder[]>(() => {
    try {
      const saved = localStorage.getItem(FOLDERS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      { id: 'folder-exam-rev', name: 'Exam revision notes', createdAt: '2026-11-01', isDefault: true },
      { id: 'folder-reading-list', name: 'Week 06 reading list', createdAt: '2026-11-01', isDefault: true }
    ];
  });

  // State: Item-to-Folder Mapping (itemId -> folderId)
  const [itemFolderMap, setItemFolderMap] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem(FOLDER_MAP_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      'res-cs201-n1': 'folder-exam-rev',
      'res-cs202-iq1': 'folder-exam-rev',
      'res-cs201-lm1': 'folder-reading-list',
    };
  });

  // State: User Uploaded Study Materials
  const [userUploads, setUserUploads] = useState<UserBackpackUpload[]>(() => {
    try {
      const saved = localStorage.getItem(UPLOADS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'upload-exam-notes-1',
        title: 'Exam Revision Notes — Unit 1 & 2 Algorithms & Traversal',
        folderId: 'folder-exam-rev',
        category: 'Personal Revision',
        fileFormat: 'PDF',
        fileSize: '1.4 MB',
        pageCount: 6,
        uploadDate: '2026-11-12',
        notes: 'Personal quick-reference notes covering tree traversals (BFS, DFS), dynamic programming memoization, and graph cycle detection.',
        previewPages: [
          {
            pageNumber: 1,
            title: 'Algorithm Quick Reference',
            content: [
              'Essential Traversal Patterns:',
              '1. Breadth-First Search (Queue): Shortest unweighted paths. Time: O(V + E). Space: O(V).',
              '2. Depth-First Search (Recursion / Stack): Topological sorting and connected components. Time: O(V + E).',
              '3. Binary Search: Array must be sorted. Recurrence: T(n) = T(n/2) + O(1) -> O(log n).'
            ]
          },
          {
            pageNumber: 2,
            title: 'Dynamic Programming Cheatsheet',
            content: [
              'Memoization vs Tabulation:',
              '• Memoization: Top-down recursion caching intermediate subproblems.',
              '• Tabulation: Bottom-up iterative table construction eliminating recursion overhead.',
              '• Knapsack 0/1: dp[i][w] = max(dp[i-1][w], val[i-1] + dp[i-1][w-wt[i-1]])'
            ]
          }
        ]
      }
    ];
  });

  // UI state
  const [selectedFolderId, setSelectedFolderId] = useState<string>(() => {
    return viewState.type === 'bookmarks' && viewState.initialFolderId ? viewState.initialFolderId : 'all';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'official' | 'uploads'>('all');

  // Modals state
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(() => {
    return viewState.type === 'bookmarks' && viewState.initialAction === 'new-folder';
  });
  const [newFolderName, setNewFolderName] = useState('');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(() => {
    return viewState.type === 'bookmarks' && viewState.initialAction === 'upload';
  });

  // Upload Form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('Revision Notes');
  const [uploadFolderId, setUploadFolderId] = useState('folder-exam-rev');
  const [uploadFormat, setUploadFormat] = useState<'PDF' | 'DOCX'>('PDF');
  const [uploadNotes, setUploadNotes] = useState('');
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persist folders to localStorage
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders));
      } catch {}
    }
  }, [folders, FOLDERS_KEY, currentUser]);

  // Persist item-folder map to localStorage
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(FOLDER_MAP_KEY, JSON.stringify(itemFolderMap));
      } catch {}
    }
  }, [itemFolderMap, FOLDER_MAP_KEY, currentUser]);

  // Persist uploads to localStorage
  useEffect(() => {
    if (currentUser) {
      try {
        localStorage.setItem(UPLOADS_KEY, JSON.stringify(userUploads));
      } catch {}
    }
  }, [userUploads, UPLOADS_KEY, currentUser]);

  // Convert user uploaded material into a compatible Resource object for PDFViewerModal
  const userUploadToResource = (upload: UserBackpackUpload): Resource => ({
    id: upload.id,
    courseId: 'personal-shelf',
    subjectId: 'backpack-notes',
    semester: currentUser?.semester || 1,
    type: 'notes',
    title: upload.title,
    description: upload.notes || 'Student study material stored in Backpack private shelf.',
    unitOrTopic: upload.category,
    fileFormat: upload.fileFormat,
    fileSize: upload.fileSize,
    pageCount: upload.pageCount,
    downloadCount: 1,
    rating: 5,
    uploadDate: upload.uploadDate,
    uploaderName: currentUser?.name || 'You',
    isVerified: false,
    tags: ['Personal Note', upload.category],
    previewPages: upload.previewPages && upload.previewPages.length > 0 
      ? upload.previewPages 
      : [
          {
            pageNumber: 1,
            title: upload.title,
            content: [
              upload.notes || 'Personal study notes and exam preparation guide.',
              'Uploaded to your private student backpack shelf.',
              'Kept safe alongside your curriculum resources for examination revision.'
            ]
          }
        ]
  });

  // Official resources bookmarked by user
  const bookmarkedOfficial = useMemo(() => {
    return resources.filter(r => currentUser?.bookmarkedResourceIds?.includes(r.id));
  }, [resources, currentUser]);

  // Combine items: official resources and user uploads
  const allBackpackItems: BackpackItemDisplay[] = useMemo(() => {
    const officialItems: BackpackItemDisplay[] = bookmarkedOfficial.map(r => ({
      id: r.id,
      title: r.title,
      category: r.unitOrTopic,
      fileFormat: r.fileFormat,
      fileSize: r.fileSize,
      pageCount: r.pageCount,
      uploadDate: r.uploadDate,
      isOfficial: true,
      folderId: itemFolderMap[r.id] || undefined,
      originalResource: r,
    }));

    const uploadedItems: BackpackItemDisplay[] = userUploads.map(u => ({
      id: u.id,
      title: u.title,
      category: u.category,
      fileFormat: u.fileFormat,
      fileSize: u.fileSize,
      pageCount: u.pageCount,
      uploadDate: u.uploadDate,
      isOfficial: false,
      folderId: u.folderId,
      uploadData: u,
    }));

    return [...officialItems, ...uploadedItems];
  }, [bookmarkedOfficial, userUploads, itemFolderMap]);

  // Filter items by folder, search, and type
  const filteredItems = useMemo(() => {
    return allBackpackItems.filter(item => {
      // Folder filter
      if (selectedFolderId !== 'all') {
        if (item.folderId !== selectedFolderId) return false;
      }

      // Type filter
      if (filterType === 'official' && !item.isOfficial) return false;
      if (filterType === 'uploads' && item.isOfficial) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [allBackpackItems, selectedFolderId, filterType, searchQuery]);

  // Folder item count helper
  const getFolderItemCount = (folderId: string) => {
    return allBackpackItems.filter(item => item.folderId === folderId).length;
  };

  // Handler: Create New Folder
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newFolderName.trim();
    if (!trimmed) return;

    const newFolder: BackpackFolder = {
      id: `folder-${Date.now()}`,
      name: trimmed,
      createdAt: new Date().toISOString().split('T')[0],
      isDefault: false
    };

    setFolders(prev => [...prev, newFolder]);
    setSelectedFolderId(newFolder.id);
    setNewFolderName('');
    setIsNewFolderModalOpen(false);

    // Sync to Supabase if configured
    if (isSupabaseConfigured) {
      supabase.from('backpack_folders').insert({
        id: newFolder.id,
        user_id: currentUser?.id || 'guest',
        name: trimmed,
        created_at: new Date().toISOString()
      }).then(({ error }) => {
        if (error) console.log('Supabase folder sync note:', error.message);
      });
    }

    addToast({
      title: 'Folder Created',
      message: `"${trimmed}" added to your Backpack shelf.`,
      type: 'success',
    });
  };

  // Handler: Delete Folder
  const handleDeleteFolder = (folderId: string, folderName: string) => {
    if (window.confirm(`Are you sure you want to delete the folder "${folderName}"? Files inside will remain in your Backpack.`)) {
      setFolders(prev => prev.filter(f => f.id !== folderId));
      
      // Clear folder mapping for items in this folder
      setItemFolderMap(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => {
          if (next[k] === folderId) delete next[k];
        });
        return next;
      });

      // Clear folderId for user uploads in this folder
      setUserUploads(prev => prev.map(u => u.folderId === folderId ? { ...u, folderId: undefined } : u));

      if (selectedFolderId === folderId) {
        setSelectedFolderId('all');
      }

      addToast({
        title: 'Folder Deleted',
        message: `"${folderName}" was deleted. Files were kept in All Items.`,
        type: 'info',
      });
    }
  };

  // Handler: Move Item to Folder
  const handleMoveItemToFolder = (itemId: string, isOfficial: boolean, targetFolderId: string) => {
    if (isOfficial) {
      setItemFolderMap(prev => {
        const next = { ...prev };
        if (targetFolderId === 'none') {
          delete next[itemId];
        } else {
          next[itemId] = targetFolderId;
        }
        return next;
      });
    } else {
      setUserUploads(prev => prev.map(u => u.id === itemId ? { ...u, folderId: targetFolderId === 'none' ? undefined : targetFolderId } : u));
    }

    const folderName = folders.find(f => f.id === targetFolderId)?.name || 'All Items';
    addToast({
      title: 'Item Moved',
      message: `File moved to "${folderName}".`,
      type: 'info',
    });
  };

  // Handler: Upload Material
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = uploadTitle.trim();
    if (!trimmedTitle) return;

    const newUpload: UserBackpackUpload = {
      id: `upload-${Date.now()}`,
      title: trimmedTitle,
      folderId: uploadFolderId === 'none' ? undefined : uploadFolderId,
      category: uploadCategory,
      fileFormat: uploadFormat,
      fileSize: fileName ? '1.8 MB' : '850 KB',
      pageCount: uploadFormat === 'PDF' ? 4 : 2,
      uploadDate: new Date().toISOString().split('T')[0],
      notes: uploadNotes.trim() || undefined,
      previewPages: [
        {
          pageNumber: 1,
          title: trimmedTitle,
          content: [
            uploadNotes.trim() || 'Personal study material uploaded to Backpack.',
            `Category: ${uploadCategory}`,
            `Added on: ${formatDisplayDate(new Date().toISOString().split('T')[0])}`,
            'Use this document for rapid exam review and course alignment.'
          ]
        }
      ]
    };

    setUserUploads(prev => [newUpload, ...prev]);
    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadNotes('');
    setFileName('');

    // Sync to Supabase if configured
    if (isSupabaseConfigured) {
      supabase.from('backpack_items').insert({
        id: newUpload.id,
        user_id: currentUser?.id || 'guest',
        folder_id: uploadFolderId === 'none' ? null : uploadFolderId,
        title: trimmedTitle,
        category: uploadCategory,
        file_format: uploadFormat,
        file_size: newUpload.fileSize,
        notes: uploadNotes.trim() || null,
        preview_pages: newUpload.previewPages,
        is_custom_upload: true
      }).then(({ error }) => {
        if (error) console.log('Supabase upload sync note:', error.message);
      });
    }

    addToast({
      title: 'Material Uploaded',
      message: `"${trimmedTitle}" added to your Backpack shelf.`,
      type: 'success',
    });
  };

  // Handler: Remove Item
  const handleRemoveItem = (itemId: string, isOfficial: boolean, title: string) => {
    if (isOfficial) {
      toggleBookmark(itemId);
    } else {
      setUserUploads(prev => prev.filter(u => u.id !== itemId));
      addToast({
        title: 'Upload Removed',
        message: `"${title.slice(0, 30)}..." deleted from your Backpack.`,
        type: 'info',
      });
    }
  };

  // Non-authenticated guard
  if (!currentUser) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[var(--cherry-pink)] block">
          YOUR PRIVATE SHELF
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text)]">
          Sign in to access your Backpack
        </h2>
        <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md mx-auto leading-relaxed">
          Log in with your Student ID to create custom folders, save curriculum resources, and upload personal study guides.
        </p>
        <button
          onClick={() => setAuthModalOpen(true)}
          className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold cursor-pointer shadow-xs inline-flex items-center gap-2"
        >
          <Bookmark className="w-4 h-4" />
          <span>Sign In with Student ID</span>
        </button>
      </div>
    );
  }

  const selectedFolderObj = folders.find(f => f.id === selectedFolderId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-7 animate-in fade-in duration-200">
      
      {/* 1. Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
        <button
          onClick={goToHome}
          className="hover:text-[var(--cherry-pink)] font-medium transition-colors cursor-pointer"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60" />
        <span className="font-semibold text-[var(--text)]">
          My Backpack ({allBackpackItems.length} items)
        </span>
      </nav>

      {/* 2. Hero Header with Actions matching the Private Shelf Aesthetic */}
      <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors">
        <div className="space-y-1.5 max-w-xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--cherry-pink)] block">
            YOUR PRIVATE SHELF
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--text)]">
            My Backpack
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
            Create custom folders and upload your own notes, revision guides, and study materials alongside official resources.
          </p>
        </div>

        {/* Primary Backpack Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsNewFolderModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--surface-alt)] hover:border-[var(--primary)] text-[var(--text)] border border-[var(--border)] transition-colors cursor-pointer inline-flex items-center gap-2 shadow-xs"
          >
            <FolderPlus className="w-4 h-4 text-[var(--cherry-pink)]" />
            <span>+ New folder</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold btn-primary transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs"
          >
            <Upload className="w-4 h-4" />
            <span>Upload material</span>
          </button>
        </div>
      </div>

      {/* 3. Folder Tabs & Search Strip */}
      <div className="space-y-4">
        {/* Folders Bar */}
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 border-b border-[var(--border)]">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs pb-1 sm:pb-0">
            {/* All Items Tab */}
            <button
              onClick={() => setSelectedFolderId('all')}
              className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                selectedFolderId === 'all'
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>All Items</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                selectedFolderId === 'all' ? 'bg-white/20 text-white' : 'bg-[var(--surface-alt)] text-[var(--text-muted)]'
              }`}>
                {allBackpackItems.length}
              </span>
            </button>

            {/* Custom Folders */}
            {folders.map(folder => {
              const count = getFolderItemCount(folder.id);
              const isActive = selectedFolderId === folder.id;

              return (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolderId(folder.id)}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--primary)] text-white shadow-xs'
                      : 'bg-[var(--surface)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--primary)]'
                  }`}
                >
                  <Folder className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[var(--cherry-pink)]'}`} />
                  <span>{folder.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[var(--surface-alt)] text-[var(--text-muted)]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}

            {/* Inline Quick Add Folder Button */}
            <button
              onClick={() => setIsNewFolderModalOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-[var(--cherry-pink)] bg-[var(--surface-alt)] hover:bg-[var(--border)] border border-dashed border-[var(--border)] transition-colors cursor-pointer inline-flex items-center gap-1.5"
              title="Add another folder"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add folder</span>
            </button>
          </div>
        </div>

        {/* Selected Folder Metadata & Search Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-[var(--text)] flex items-center gap-2">
              {selectedFolderId === 'all' ? (
                <>
                  <Bookmark className="w-4 h-4 text-[var(--cherry-pink)]" />
                  <span>Showing all {filteredItems.length} files in Backpack</span>
                </>
              ) : (
                <>
                  <FolderOpen className="w-4 h-4 text-[var(--cherry-pink)]" />
                  <span>Folder: {selectedFolderObj?.name}</span>
                  <span className="text-xs text-[var(--text-muted)] font-normal">
                    ({filteredItems.length} {filteredItems.length === 1 ? 'file' : 'files'})
                  </span>
                </>
              )}
            </h2>

            {selectedFolderId !== 'all' && selectedFolderObj && (
              <button
                onClick={() => handleDeleteFolder(selectedFolderObj.id, selectedFolderObj.name)}
                className="text-xs text-[var(--text-muted)] hover:text-rose-500 transition-colors cursor-pointer flex items-center gap-1"
                title="Delete this folder"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete folder</span>
              </button>
            )}
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search notes in backpack..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--focus)] transition-colors"
              />
            </div>

            <div className="flex items-center bg-[var(--surface-alt)] p-0.5 rounded-xl border border-[var(--border)] text-[11px] font-semibold">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterType === 'all' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--text-muted)]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('official')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterType === 'official' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--text-muted)]'
                }`}
              >
                Official
              </button>
              <button
                onClick={() => setFilterType('uploads')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  filterType === 'uploads' ? 'bg-[var(--surface)] text-[var(--text)] shadow-xs' : 'text-[var(--text-muted)]'
                }`}
              >
                My Uploads
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Files List */}
      {filteredItems.length === 0 ? (
        <div className="bg-[var(--surface)] rounded-3xl border border-dashed border-[var(--border)] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--surface-alt)] text-[var(--cherry-pink)] flex items-center justify-center mx-auto">
            {selectedFolderId === 'all' ? <Bookmark className="w-6 h-6" /> : <Folder className="w-6 h-6" />}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[var(--text)]">
              {searchQuery ? 'No matching notes found' : selectedFolderId === 'all' ? 'Your Backpack is empty' : `No files in "${selectedFolderObj?.name}"`}
            </h3>
            <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
              {searchQuery 
                ? 'Try a different search query or clear the filter.' 
                : 'Upload your own revision guides or browse course modules to pin materials here.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => {
                setUploadFolderId(selectedFolderId === 'all' ? (folders[0]?.id || 'none') : selectedFolderId);
                setIsUploadModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold btn-primary transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Study Material</span>
            </button>

            <button
              onClick={goToHome}
              className="px-4 py-2 rounded-xl text-xs font-semibold btn-secondary transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>Explore Curriculum</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[var(--surface)] rounded-3xl border border-[var(--border)] divide-y divide-[var(--border)] overflow-hidden shadow-xs">
          {filteredItems.map(item => {
            const isDownloading = downloadingId === item.id;
            const currentItemFolder = folders.find(f => f.id === item.folderId);

            return (
              <div
                key={item.id}
                className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[var(--surface-alt)]/40 transition-colors"
              >
                {/* Item Details */}
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-[var(--surface-alt)] border border-[var(--border)] flex items-center justify-center shrink-0 mt-0.5 text-[var(--primary)]">
                    <FileText className="w-5 h-5 text-[var(--cherry-pink)]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Topic / Category Pill */}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] px-2 py-0.5 rounded bg-[var(--surface-alt)] border border-[var(--border)]">
                        {item.category}
                      </span>

                      {/* Source Badge */}
                      {item.isOfficial ? (
                        <span className="text-[10px] font-bold text-[var(--primary)] bg-[var(--surface-alt)] px-2 py-0.5 rounded border border-[var(--border)]">
                          Verified Official
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-[var(--cherry-pink)] bg-[var(--cherry-pink-subtle)] px-2 py-0.5 rounded border border-[var(--cherry-pink-border)]">
                          My Upload
                        </span>
                      )}

                      {/* Folder Pill */}
                      {currentItemFolder ? (
                        <span className="text-[10px] font-semibold text-[var(--text)] bg-[var(--surface)] px-2 py-0.5 rounded border border-[var(--border)] flex items-center gap-1">
                          <Folder className="w-3 h-3 text-[var(--cherry-pink)]" />
                          <span>{currentItemFolder.name}</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-[var(--text-muted)] italic">
                          Unassigned Folder
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => {
                        if (item.isOfficial && item.originalResource) {
                          setPreviewResource(item.originalResource);
                        } else if (item.uploadData) {
                          setPreviewResource(userUploadToResource(item.uploadData));
                        }
                      }}
                      title={item.title}
                      className="text-sm font-bold text-[var(--text)] hover:text-[var(--cherry-pink)] cursor-pointer truncate mt-1.5 transition-colors"
                    >
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)] mt-1">
                      <span className="font-bold text-[var(--primary)]">{item.fileFormat}</span>
                      <span>•</span>
                      <span>{item.fileSize}</span>
                      <span>•</span>
                      <span>{item.pageCount} Pages</span>
                      <span>•</span>
                      <span>Added {formatDisplayDate(item.uploadDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Item Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {/* Folder Selector Dropdown */}
                  <select
                    value={item.folderId || 'none'}
                    onChange={e => handleMoveItemToFolder(item.id, item.isOfficial, e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] focus:outline-none focus:border-[var(--focus)] cursor-pointer"
                    title="Change folder"
                  >
                    <option value="none">No folder</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>
                        📁 {f.name}
                      </option>
                    ))}
                  </select>

                  {/* View Action */}
                  <button
                    onClick={() => {
                      if (item.isOfficial && item.originalResource) {
                        setPreviewResource(item.originalResource);
                      } else if (item.uploadData) {
                        setPreviewResource(userUploadToResource(item.uploadData));
                      }
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold btn-secondary transition-colors cursor-pointer flex items-center gap-1"
                    title="Read Document"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>

                  {/* Download Action */}
                  <button
                    onClick={() => {
                      if (item.isOfficial) {
                        downloadResource(item.id);
                      } else {
                        // Simulated personal file download
                        addToast({
                          title: 'Download Started',
                          message: `Downloading "${item.title.slice(0, 24)}...".`,
                          type: 'info',
                        });
                      }
                    }}
                    disabled={isDownloading}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold btn-primary transition-all shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    title="Download to device"
                  >
                    <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
                    <span className="hidden sm:inline">{isDownloading ? 'Saving...' : 'Download'}</span>
                  </button>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id, item.isOfficial, item.title)}
                    className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title={item.isOfficial ? 'Remove bookmark from Backpack' : 'Delete uploaded material'}
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Create New Folder Modal */}
      {isNewFolderModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsNewFolderModalOpen(false)}
        >
          <div 
            className="bg-[var(--surface)] text-[var(--text)] rounded-3xl border border-[var(--border)] p-6 sm:p-7 shadow-2xl max-w-md w-full space-y-4 animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-[var(--cherry-pink)]" />
                <h3 className="font-extrabold text-base tracking-tight">Create New Folder</h3>
              </div>
              <button
                onClick={() => setIsNewFolderModalOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Name your folder to group related subject notes, exam checklists, or reading lists.
            </p>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Folder Name <span className="text-[var(--cherry-pink)]">*</span>
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  placeholder="e.g. End-Term Revision, Lab Practicals, Math Cheatsheets"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--focus)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewFolderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold btn-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newFolderName.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold btn-primary transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Upload Study Material Modal */}
      {isUploadModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsUploadModalOpen(false)}
        >
          <div 
            className="bg-[var(--surface)] text-[var(--text)] rounded-3xl border border-[var(--border)] p-6 sm:p-7 shadow-2xl max-w-lg w-full space-y-4 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
              <div className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[var(--primary)]" />
                <h3 className="font-extrabold text-base tracking-tight">Upload Study Material</h3>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Add your handwritten notes, revision summaries, or reading guides alongside your official college curriculum.
            </p>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Document Title <span className="text-[var(--cherry-pink)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="e.g. Unit 3 Dynamic Programming Summary"
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--focus)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={e => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--focus)]"
                  >
                    <option value="Revision Notes">Revision Notes</option>
                    <option value="Formula Sheet">Formula Sheet</option>
                    <option value="Reading List">Reading List</option>
                    <option value="Lab Preparation">Lab Preparation</option>
                    <option value="Project Summary">Project Summary</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--text)] mb-1">
                    Save to Folder
                  </label>
                  <select
                    value={uploadFolderId}
                    onChange={e => setUploadFolderId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--focus)]"
                  >
                    <option value="none">No folder (All Items)</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>
                        📁 {f.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* File Format & Simulation Selector */}
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Format
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs text-[var(--text)] cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      checked={uploadFormat === 'PDF'}
                      onChange={() => setUploadFormat('PDF')}
                      className="accent-[var(--primary)]"
                    />
                    <span>PDF Document</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-[var(--text)] cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      checked={uploadFormat === 'DOCX'}
                      onChange={() => setUploadFormat('DOCX')}
                      className="accent-[var(--primary)]"
                    />
                    <span>DOCX Document</span>
                  </label>
                </div>
              </div>

              {/* File Attachment Dropzone */}
              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  File Attachment
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                  onChange={e => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setFileName(f.name);
                      if (!uploadTitle.trim()) {
                        setUploadTitle(f.name.replace(/\.[^/.]+$/, ''));
                      }
                    }
                  }}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--primary)] bg-[var(--bg)] flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
                >
                  <FileUp className="w-6 h-6 text-[var(--cherry-pink)] mb-1.5" />
                  <p className="text-xs font-bold text-[var(--text)]">
                    {fileName ? fileName : 'Click to choose file or drop PDF / DOCX'}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                    Maximum 25 MB • PDF or DOCX
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--text)] mb-1">
                  Key Notes & Summary (Optional)
                </label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={e => setUploadNotes(e.target.value)}
                  placeholder="Add quick reminders or key takeaways..."
                  className="w-full px-3.5 py-2 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text)] focus:outline-none focus:border-[var(--focus)]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold btn-secondary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!uploadTitle.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold btn-primary transition-all cursor-pointer shadow-xs disabled:opacity-50"
                >
                  Add to Backpack
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

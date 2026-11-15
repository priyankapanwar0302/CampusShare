import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { AnnouncementBanner } from './components/layout/AnnouncementBanner';
import { Footer } from './components/layout/Footer';
import { HomeDashboard } from './components/home/HomeDashboard';
import { DepartmentView } from './components/course/DepartmentView';
import { CourseView } from './components/course/CourseView';
import { SubjectHub } from './components/subject/SubjectHub';
import { AdminManagementHub } from './components/admin/AdminManagementHub';
import { BookmarksView } from './components/bookmarks/BookmarksView';
import { SearchModal } from './components/modals/SearchModal';
import { PDFViewerModal } from './components/modals/PDFViewerModal';
import { RequestResourceModal } from './components/modals/RequestResourceModal';
import { AuthModal } from './components/modals/AuthModal';
import { ChangePasswordModal } from './components/modals/ChangePasswordModal';
import { ToastContainer } from './components/common/ToastContainer';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { WallpaperLayers } from './components/common/WallpaperLayers';

const MainContent: React.FC = () => {
  const { viewState } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[var(--text)] transition-colors selection:bg-[var(--tint)] selection:text-[var(--text)]">
      {/* Decorative Full-Viewport Wallpaper Layers (Fixed behind everything) */}
      <WallpaperLayers />

      {/* Underlying Dashboard Shell */}
      <div className="flex flex-col min-h-screen transition-all duration-300">
        <AnnouncementBanner />
        <Navbar />

        <main className="flex-1">
          <ErrorBoundary>
            {viewState.type === 'home' && <HomeDashboard />}
            {viewState.type === 'category' && <DepartmentView categoryId={viewState.categoryId} />}
            {viewState.type === 'course' && (
              <CourseView
                courseId={viewState.courseId}
                initialSemester={viewState.semester}
              />
            )}
            {viewState.type === 'subject' && (
              <SubjectHub
                subjectId={viewState.subjectId}
                initialTab={viewState.tab}
              />
            )}
            {viewState.type === 'admin' && <AdminManagementHub />}
            {viewState.type === 'bookmarks' && <BookmarksView />}
          </ErrorBoundary>
        </main>

        <Footer />
      </div>

      {/* Global Modals & Notifications - rendered above blur layer */}
      <SearchModal />
      <PDFViewerModal />
      <RequestResourceModal />
      <AuthModal />
      <ChangePasswordModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}

export default App;

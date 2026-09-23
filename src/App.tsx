import { useState, useCallback, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import UploadScreen from './components/UploadScreen';
import PDFViewer from './components/PDFViewer';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import AIPanel from './components/AIPanel';
import { Bookmark, ReadingSettings } from './types';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [settings, setSettings] = useState<ReadingSettings>({
    theme: 'light',
    fontSize: 16,
    pageWidth: 900,
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [aiPanelOpen, setAiPanelOpen] = useState<boolean>(false);
  const [flipEnabled, setFlipEnabled] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('pdf-reader-bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
    const savedDark = localStorage.getItem('pdf-reader-dark');
    if (savedDark === 'true') {
      setDarkMode(true);
      setSettings((s: ReadingSettings) => ({ ...s, theme: 'dark' }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('pdf-reader-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('pdf-reader-dark', String(darkMode));
  }, [darkMode]);

  const handleFileUpload = useCallback((uploadedFile: File) => {
    setFile(uploadedFile);
    setCurrentPage(1);
  }, []);

  const handleDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    localStorage.setItem(`pdf-reader-progress-${file?.name}`, String(page));
  }, [file]);

  const handleZoomIn = useCallback(() => {
    setScale((s: number) => Math.min(s + 0.2, 3));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((s: number) => Math.max(s - 0.2, 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setScale(1.2);
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((d: boolean) => !d);
    setSettings((s: ReadingSettings) => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));
  }, []);

  const addBookmark = useCallback(() => {
    const existing = bookmarks.find(b => b.page === currentPage);
    if (existing) {
      setBookmarks(b => b.filter(bk => bk.page !== currentPage));
    } else {
      setBookmarks(b => [...b, {
        id: Date.now().toString(),
        page: currentPage,
        label: `Page ${currentPage}`,
        createdAt: new Date().toISOString(),
      }]);
    }
  }, [currentPage, bookmarks]);

  const removeBookmark = useCallback((id: string) => {
    setBookmarks(b => b.filter(bk => bk.id !== id));
  }, []);

  const goToBookmark = useCallback((page: number) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  }, []);

  const handleReset = useCallback(() => {
    setFile(null);
    setNumPages(0);
    setCurrentPage(1);
    setScale(1.2);
  }, []);

  if (!file) {
    return <UploadScreen onFileUpload={handleFileUpload} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />;
  }

  return (
    <div className={`h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <Toolbar
        currentPage={currentPage}
        numPages={numPages}
        scale={scale}
        darkMode={darkMode}
        bookmarks={bookmarks}
        showSearch={showSearch}
        searchQuery={searchQuery}
        aiPanelOpen={aiPanelOpen}
        flipEnabled={flipEnabled}
        soundEnabled={soundEnabled}
        onPageChange={handlePageChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onToggleDarkMode={toggleDarkMode}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onToggleAI={() => setAiPanelOpen(!aiPanelOpen)}
        onToggleFlip={() => setFlipEnabled(!flipEnabled)}
        onToggleSound={() => {
          const newState = !soundEnabled;
          setSoundEnabled(newState);
          localStorage.setItem('pdf-reader-sound', String(newState));
        }}
        onAddBookmark={addBookmark}
        onReset={handleReset}
        onToggleSearch={() => setShowSearch(!showSearch)}
        onSearchChange={setSearchQuery}
        fileName={file.name}
      />

      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <Sidebar
            bookmarks={bookmarks}
            currentPage={currentPage}
            numPages={numPages}
            darkMode={darkMode}
            onGoToPage={goToBookmark}
            onRemoveBookmark={removeBookmark}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <div className="flex-1 overflow-auto">
          <PDFViewer
            file={file}
            currentPage={currentPage}
            scale={scale}
            darkMode={darkMode}
            flipEnabled={flipEnabled}
            soundEnabled={soundEnabled}
            onDocumentLoadSuccess={handleDocumentLoadSuccess}
            onPageChange={handlePageChange}
            settings={settings}
          />
        </div>

        {aiPanelOpen && (
          <AIPanel
            file={file}
            currentPage={currentPage}
            numPages={numPages}
            darkMode={darkMode}
            onClose={() => setAiPanelOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

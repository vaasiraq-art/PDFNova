import { useState, useEffect, useCallback, useRef } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ReadingSettings } from '../types';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import PageFlipAnimation from './PageFlipAnimation';
import { pageFlipSound } from '../utils/pageFlipSound';

interface PDFViewerProps {
  file: File;
  currentPage: number;
  scale: number;
  darkMode: boolean;
  flipEnabled: boolean;
  soundEnabled: boolean;
  onDocumentLoadSuccess: (data: { numPages: number }) => void;
  onPageChange: (page: number) => void;
  settings: ReadingSettings;
}

export default function PDFViewer({
  file,
  currentPage,
  scale,
  darkMode,
  flipEnabled,
  soundEnabled,
  onDocumentLoadSuccess,
  onPageChange,
}: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [previousPage, setPreviousPage] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update previous page for flip direction tracking
  useEffect(() => {
    const timer = setTimeout(() => {
      setPreviousPage(currentPage);
    }, 900); // After animation completes
    return () => clearTimeout(timer);
  }, [currentPage]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      if (currentPage < numPages) {
        onPageChange(currentPage + 1);
      }
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }
  }, [currentPage, numPages, onPageChange]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleDocumentLoad = (data: { numPages: number }) => {
    setNumPages(data.numPages);
    onDocumentLoadSuccess(data);
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= numPages) {
      // Play flip sound
      const direction = newPage > currentPage ? 'next' : 'prev';
      pageFlipSound.playFlipSound(direction, soundEnabled);
      
      setPreviousPage(currentPage);
      onPageChange(newPage);
    }
  };

  // Click on left/right side of page to navigate
  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width * 0.3 && currentPage > 1) {
      handlePageChange(currentPage - 1);
    } else if (x > width * 0.7 && currentPage < numPages) {
      handlePageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex flex-col items-center py-6 px-4 min-h-full">
      {loading && (
        <div className={`flex items-center gap-3 mb-4 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-600 shadow-sm'}`}>
          <Loader2 size={20} className="animate-spin text-indigo-500" />
          <span>Loading PDF...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-4 max-w-lg text-center">
          <p className="font-medium mb-1">Error loading PDF</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Book container with realistic styling */}
      <div className="relative">
        {/* Book spine effect (left side) */}
        {flipEnabled && (
          <div
            className={`absolute top-0 bottom-0 -left-3 w-3 rounded-l-sm z-10 ${
              darkMode 
                ? 'bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800' 
                : 'bg-gradient-to-r from-amber-900 via-amber-700 to-amber-800'
            }`}
            style={{
              boxShadow: 'inset -2px 0 4px rgba(0,0,0,0.3), -2px 0 8px rgba(0,0,0,0.2)',
            }}
          />
        )}

        {/* Page edges (right side stack effect) */}
        {flipEnabled && (
          <div
            className={`absolute top-1 bottom-1 -right-1 w-2 rounded-r-sm z-0 ${
              darkMode ? 'bg-gray-600' : 'bg-gray-200'
            }`}
            style={{
              background: darkMode
                ? 'repeating-linear-gradient(to bottom, #374151 0px, #374151 1px, #4b5563 1px, #4b5563 2px)'
                : 'repeating-linear-gradient(to bottom, #e5e7eb 0px, #e5e7eb 1px, #f3f4f6 1px, #f3f4f6 2px)',
              boxShadow: '2px 0 4px rgba(0,0,0,0.1)',
            }}
          />
        )}

        {/* Page flip animation wrapper */}
        <PageFlipAnimation
          currentPage={currentPage}
          previousPage={previousPage}
          enabled={flipEnabled}
          darkMode={darkMode}
        >
          <div
            ref={containerRef}
            onClick={handlePageClick}
            className={`relative rounded-lg overflow-hidden cursor-pointer ${
              darkMode ? 'ring-1 ring-gray-700' : ''
            } ${flipEnabled ? 'shadow-2xl' : 'shadow-lg'}`}
            style={{
              transition: 'box-shadow 0.3s ease',
            }}
          >
            <Document
              file={file}
              onLoadSuccess={handleDocumentLoad}
              onLoadError={(err) => {
                setError(err.message);
                setLoading(false);
              }}
              loading={
                <div className={`flex flex-col items-center justify-center p-16 min-h-[500px] min-w-[400px] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <Loader2 size={48} className="animate-spin text-indigo-500 mb-4" />
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Preparing your book...
                  </p>
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="pdf-page"
                loading={
                  <div className={`flex items-center justify-center p-12 min-h-[600px] min-w-[400px] ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <Loader2 size={30} className="animate-spin text-indigo-400" />
                  </div>
                }
              />
            </Document>

            {/* Click zones indicator (subtle) */}
            {flipEnabled && (
              <>
                <div className="absolute left-0 top-0 bottom-0 w-[30%] opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="absolute inset-y-0 left-2 flex items-center">
                    <ChevronLeft size={24} className={`${darkMode ? 'text-white/30' : 'text-black/20'} drop-shadow-lg`} />
                  </div>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-[30%] opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                  <div className="absolute inset-y-0 right-2 flex items-center">
                    <ChevronRight size={24} className={`${darkMode ? 'text-white/30' : 'text-black/20'} drop-shadow-lg`} />
                  </div>
                </div>
              </>
            )}
          </div>
        </PageFlipAnimation>
      </div>

      {/* Page navigation at bottom */}
      <div className={`flex items-center gap-4 mt-8 p-3 rounded-xl ${darkMode ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white shadow-lg'}`}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`p-2 rounded-lg transition-all ${
            currentPage <= 1
              ? 'opacity-30 cursor-not-allowed'
              : darkMode
              ? 'hover:bg-gray-700 text-gray-300 active:scale-95'
              : 'hover:bg-gray-100 text-gray-600 active:scale-95'
          }`}
          title="Previous page (←)"
        >
          <ChevronLeft size={20} />
        </button>

        <span className={`text-sm font-medium min-w-[100px] text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Page {currentPage} of {numPages}
        </span>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= numPages}
          className={`p-2 rounded-lg transition-all ${
            currentPage >= numPages
              ? 'opacity-30 cursor-not-allowed'
              : darkMode
              ? 'hover:bg-gray-700 text-gray-300 active:scale-95'
              : 'hover:bg-gray-100 text-gray-600 active:scale-95'
          }`}
          title="Next page (→)"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Keyboard hint */}
      <div className={`flex items-center gap-4 mt-3 text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        <span>← → Arrow keys</span>
        <span>•</span>
        <span>Click page edges to flip</span>
        <span>•</span>
        <span>Space for next page</span>
      </div>
    </div>
  );
}

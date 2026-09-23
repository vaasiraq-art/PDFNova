import { useState, useEffect, useCallback } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ReadingSettings } from '../types';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

interface PDFViewerProps {
  file: File;
  currentPage: number;
  scale: number;
  darkMode: boolean;
  onDocumentLoadSuccess: (data: { numPages: number }) => void;
  onPageChange: (page: number) => void;
  settings: ReadingSettings;
}

export default function PDFViewer({
  file,
  currentPage,
  scale,
  darkMode,
  onDocumentLoadSuccess,
  onPageChange,
}: PDFViewerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
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
      onPageChange(newPage);
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

      <div className={`rounded-lg shadow-2xl overflow-hidden ${darkMode ? 'ring-1 ring-gray-700' : ''}`}>
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
      </div>

      {/* Page navigation at bottom */}
      <div className={`flex items-center gap-4 mt-6 p-3 rounded-xl ${darkMode ? 'bg-gray-800 ring-1 ring-gray-700' : 'bg-white shadow-lg'}`}>
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
      <p className={`text-xs mt-3 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        Use ← → arrow keys to navigate pages
      </p>
    </div>
  );
}

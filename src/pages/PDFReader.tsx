import { useState, useCallback, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Upload, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Moon, Sun, BookOpen, Loader2, BookmarkPlus } from 'lucide-react';

interface PDFReaderProps {
  darkMode: boolean;
}

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export default function PDFReader({ darkMode }: PDFReaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (f: File) => {
    setFile(f);
    setCurrentPage(1);
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' && currentPage < numPages) setCurrentPage(p => p + 1);
    if (e.key === 'ArrowLeft' && currentPage > 1) setCurrentPage(p => p - 1);
  }, [currentPage, numPages]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!file) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
          <BookOpen size={40} className="text-indigo-500" />
        </div>
        <h1 className={`text-3xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          PDF Reader
        </h1>
        <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Upload a PDF to start reading with a comfortable experience
        </p>
        <label className={`inline-flex flex-col items-center p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${darkMode ? 'border-gray-700 bg-gray-900 hover:border-indigo-500' : 'border-gray-300 bg-gray-50 hover:border-indigo-400'}`}>
          <Upload size={32} className="text-indigo-500 mb-3" />
          <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Click to upload PDF</span>
          <span className={`text-sm mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>or drag and drop</span>
          <input type="file" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} className="hidden" />
        </label>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Toolbar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <button onClick={() => setFile(null)} className={`px-3 py-1.5 rounded-lg text-sm ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
            ← New File
          </button>
          <span className={`text-sm truncate max-w-[200px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{file.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
            <ZoomOut size={16} />
          </button>
          <span className={`text-sm min-w-[50px] text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
            <ZoomIn size={16} />
          </button>
          <div className={`mx-2 h-6 w-px ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`} />
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} disabled:opacity-30`}>
            <ChevronLeft size={16} />
          </button>
          <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{currentPage} / {numPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage >= numPages} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'} disabled:opacity-30`}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className={`flex-1 overflow-auto ${darkMode ? 'bg-gray-950' : 'bg-gray-100'}`}>
        <div className="flex justify-center py-8">
          <Document
            file={file}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            loading={<div className="p-12"><Loader2 size={40} className="animate-spin text-indigo-500" /></div>}
          >
            <Page pageNumber={currentPage} scale={scale} renderTextLayer={true} renderAnnotationLayer={true} className="shadow-2xl" />
          </Document>
        </div>
      </div>
    </div>
  );
}

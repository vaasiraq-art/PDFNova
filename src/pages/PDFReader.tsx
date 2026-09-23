import { useState, useCallback, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Upload, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, BookOpen, Loader2 } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export default function PDFReader() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.2);

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
        <div className="w-20 h-20 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-6">
          <BookOpen size={40} className="text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">PDF Reader</h1>
        <p className="text-lg text-gray-600 mb-8">Upload a PDF to start reading</p>
        <label className="inline-flex flex-col items-center p-12 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors">
          <Upload size={32} className="text-blue-600 mb-3" />
          <span className="font-medium text-gray-900">Click to upload PDF</span>
          <span className="text-sm text-gray-500 mt-1">or drag and drop</span>
          <input type="file" accept=".pdf" onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} className="hidden" />
        </label>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-2">
          <button onClick={() => setFile(null)} className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900">
            ← New File
          </button>
          <span className="text-sm text-gray-500 truncate max-w-[200px]">{file.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} className="p-2 text-gray-600 hover:text-gray-900">
            <ZoomOut size={16} />
          </button>
          <span className="text-sm text-gray-600 min-w-[50px] text-center">{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} className="p-2 text-gray-600 hover:text-gray-900">
            <ZoomIn size={16} />
          </button>
          <div className="mx-2 h-6 w-px bg-gray-200" />
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-gray-600">{currentPage} / {numPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage >= numPages} className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-30">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 overflow-auto bg-gray-100">
        <div className="flex justify-center py-8">
          <Document
            file={file}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            loading={<div className="p-12"><Loader2 size={40} className="animate-spin text-blue-600" /></div>}
          >
            <Page pageNumber={currentPage} scale={scale} renderTextLayer={true} renderAnnotationLayer={true} className="shadow-lg" />
          </Document>
        </div>
      </div>
    </div>
  );
}

import { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

export default function PDFReader() {
  const [file, setFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [dragOver, setDragOver] = useState(false);

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
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl">📄</span>
                <span className="text-xl font-bold text-gray-900">PDFNova</span>
              </Link>
              <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
                ← All Tools
              </Link>
            </div>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">PDF Reader</h1>
          <p className="text-gray-600 mb-8">Upload a PDF to read it in your browser</p>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]); }}
            onClick={() => document.getElementById('pdf-upload')?.click()}
            className={`bg-white border-2 border-dashed rounded-lg p-16 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <p className="text-gray-700 font-medium mb-1">Drop your PDF here or click to browse</p>
            <p className="text-sm text-gray-500">PDF files only</p>
            <input
              id="pdf-upload"
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Toolbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl">📄</span>
              <span className="text-lg font-bold text-gray-900">PDFNova</span>
            </Link>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 truncate max-w-xs hidden sm:block">{file.name}</span>
              
              {/* Zoom */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setScale(s => Math.max(s - 0.2, 0.5))}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
                >
                  −
                </button>
                <span className="text-sm text-gray-600 w-12 text-center">{Math.round(scale * 100)}%</span>
                <button
                  onClick={() => setScale(s => Math.min(s + 0.2, 3))}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200"
                >
                  +
                </button>
              </div>

              {/* Pages */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage <= 1}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-30"
                >
                  ‹
                </button>
                <span className="text-sm text-gray-600">
                  {currentPage} / {numPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, numPages))}
                  disabled={currentPage >= numPages}
                  className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-30"
                >
                  ›
                </button>
              </div>

              <button
                onClick={() => setFile(null)}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
              >
                New File
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* PDF Viewer */}
      <main className="py-8 flex justify-center">
        <Document
          file={file}
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="text-gray-500">Loading...</div>}
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </main>
    </div>
  );
}

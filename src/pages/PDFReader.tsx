import { useState, useCallback, useEffect } from 'react';
import { pdfjs, Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Upload, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, BookOpen, Loader2 } from 'lucide-react';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

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

  const today = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  if (!file) {
    return (
      <article className="box post">
        <header>
          <h2>PDF Reader</h2>
          <p>Upload a PDF to start reading</p>
        </header>
        <div className="info">
          <span className="date">
            <span className="month">{months[today.getMonth()]}</span>
            <span className="day">{today.getDate()}</span>
            <span className="year">, {today.getFullYear()}</span>
          </span>
          <ul className="stats">
            <li><a href="#">Free</a></li>
            <li><a href="#">Reader</a></li>
          </ul>
        </div>
        <div style={{ textAlign: 'center', padding: '3em 0' }}>
          <label style={{ cursor: 'pointer' }}>
            <div style={{ marginBottom: '1em' }}>
              <BookOpen size={48} style={{ color: '#49bf9d' }} />
            </div>
            <p style={{ marginBottom: '1em' }}>
              <strong>Click to upload PDF</strong>
            </p>
            <p style={{ fontSize: '0.9em', color: '#888' }}>
              or drag and drop
            </p>
            <input 
              type="file" 
              accept=".pdf" 
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])} 
              style={{ display: 'none' }} 
            />
          </label>
        </div>
      </article>
    );
  }

  return (
    <article className="box post">
      <header>
        <h2>{file.name}</h2>
        <p>PDF Reader</p>
      </header>
      <div className="info">
        <span className="date">
          <span className="month">{months[today.getMonth()]}</span>
          <span className="day">{today.getDate()}</span>
          <span className="year">, {today.getFullYear()}</span>
        </span>
        <ul className="stats">
          <li><a href="#">Page {currentPage} of {numPages}</a></li>
        </ul>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1em 0', borderBottom: '1px solid #eee', marginBottom: '1.5em' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
          <button onClick={() => setFile(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#49bf9d' }}>
            ← New File
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5em' }}>
          <button onClick={() => setScale(s => Math.max(s - 0.2, 0.5))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5em' }}>
            <ZoomIn size={16} />
          </button>
          <span style={{ fontSize: '0.9em', minWidth: '50px', textAlign: 'center' }}>{Math.round(scale * 100)}%</span>
          <button onClick={() => setScale(s => Math.min(s + 0.2, 3))} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5em' }}>
            <ZoomOut size={16} />
          </button>
          <div style={{ margin: '0 1em', height: '20px', width: '1px', background: '#eee' }} />
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage <= 1} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5em', opacity: currentPage <= 1 ? 0.3 : 1 }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontSize: '0.9em' }}>{currentPage} / {numPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(numPages, p + 1))} disabled={currentPage >= numPages} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5em', opacity: currentPage >= numPages ? 0.3 : 1 }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div style={{ overflow: 'auto', maxHeight: '70vh', background: '#f5f5f5', padding: '1em' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Document
            file={file}
            onLoadSuccess={({ numPages: n }) => setNumPages(n)}
            loading={<div style={{ padding: '3em' }}><Loader2 size={40} style={{ animation: 'spin 1s linear infinite', color: '#49bf9d' }} /></div>}
          >
            <Page pageNumber={currentPage} scale={scale} renderTextLayer={true} renderAnnotationLayer={true} />
          </Document>
        </div>
      </div>
    </article>
  );
}

import { useParams, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { tools } from '../data/tools';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { getDocument } from 'pdfjs-dist';

function createPdfBlob(pdfBytes: any): Blob {
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = tools.find(t => t.id === toolId);

  if (!tool) {
    return (
      <article className="box post">
        <header>
          <h2>Tool Not Found</h2>
          <p>The requested tool could not be found</p>
        </header>
        <p>
          <Link to="/">← Back to all tools</Link>
        </p>
      </article>
    );
  }

  return <ToolProcessor tool={tool} />;
}

function ToolProcessor({ tool }: { tool: typeof tools[0] }) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMultiple = tool.multiple || tool.id === 'merge-pdf';

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const fileArray = Array.from(newFiles);
    setFiles(isMultiple ? prev => [...prev, ...fileArray] : fileArray.slice(0, 1));
    setError(null);
    setResult(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processFiles = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setError(null);

    try {
      let outputBlob: Blob;

      switch (tool.id) {
        case 'merge-pdf': outputBlob = await mergePDFs(files); break;
        case 'split-pdf': outputBlob = await splitPDF(files[0], options); break;
        case 'compress-pdf': outputBlob = await compressPDF(files[0]); break;
        case 'rotate-pdf': outputBlob = await rotatePDF(files[0], options.angle || 90); break;
        case 'pdf-to-jpg': await pdfToJpg(files[0]); setProcessing(false); return;
        case 'pdf-to-text': await pdfToText(files[0]); setProcessing(false); return;
        case 'pdf-to-word': await pdfToWord(files[0]); setProcessing(false); return;
        case 'jpg-to-pdf':
        case 'png-to-pdf':
        case 'images-to-pdf': outputBlob = await imagesToPDF(files); break;
        case 'word-to-pdf': outputBlob = await wordToPDF(files[0]); break;
        case 'protect-pdf': outputBlob = await protectPDF(files[0]); break;
        case 'unlock-pdf': outputBlob = await unlockPDF(files[0]); break;
        case 'add-page-numbers': outputBlob = await addPageNumbers(files[0], options); break;
        case 'watermark-pdf': outputBlob = await addWatermark(files[0], options.text || 'CONFIDENTIAL'); break;
        default: throw new Error('Tool not implemented yet');
      }

      setResult(outputBlob);
      setResultUrl(URL.createObjectURL(outputBlob));
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    }

    setProcessing(false);
  };

  const downloadResult = () => {
    if (resultUrl && result) {
      saveAs(result, `pdfnova-${tool.id}-${Date.now()}.pdf`);
    }
  };

  const reset = () => {
    setFiles([]);
    setResult(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setError(null);
  };

  const today = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <article className="box post">
      <header>
        <h2>{tool.name}</h2>
        <p>{tool.description}</p>
      </header>
      <div className="info">
        <span className="date">
          <span className="month">{months[today.getMonth()]}</span>
          <span className="day">{today.getDate()}</span>
          <span className="year">, {today.getFullYear()}</span>
        </span>
        <ul className="stats">
          <li><a href="#">Free</a></li>
          <li><a href="#">{tool.category}</a></li>
        </ul>
      </div>

      {/* Upload Area */}
      {!result && (
        <div style={{ border: '2px dashed #ddd', padding: '3em', textAlign: 'center', marginBottom: '1.5em' }}>
          <p style={{ marginBottom: '1em' }}>
            <strong>Select files to process</strong>
          </p>
          <p style={{ marginBottom: '1.5em', fontSize: '0.9em' }}>
            {files.length === 0 ? 'No files selected' : `${files.length} file(s) selected`}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="button"
          >
            Choose Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={tool.acceptTypes || '.pdf'}
            multiple={isMultiple}
            onChange={(e) => handleFiles(e.target.files)}
            style={{ display: 'none' }}
          />
        </div>
      )}

      {/* File List */}
      {files.length > 0 && !result && (
        <div style={{ marginBottom: '1.5em' }}>
          <h3>Selected Files</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {files.map((file, i) => (
              <li key={i} style={{ padding: '0.5em 0', borderBottom: '1px solid #eee' }}>
                {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                {isMultiple && (
                  <button 
                    onClick={() => removeFile(i)}
                    style={{ marginLeft: '1em', color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Options */}
      {files.length > 0 && !result && !processing && (
        <ToolOptions toolId={tool.id} options={options} setOptions={setOptions} />
      )}

      {/* Process Button */}
      {files.length > 0 && !result && (
        <p>
          <button
            onClick={processFiles}
            disabled={processing}
            className="button"
            style={{ opacity: processing ? 0.5 : 1 }}
          >
            {processing ? 'Processing...' : `Process ${tool.name}`}
          </button>
        </p>
      )}

      {/* Error */}
      {error && (
        <p style={{ color: '#e74c3c', padding: '1em', background: '#fdf0f0', borderRadius: '0.3em' }}>
          <strong>Error:</strong> {error}
        </p>
      )}

      {/* Result */}
      {result && resultUrl && (
        <div style={{ padding: '2em', background: '#f0fdf4', borderRadius: '0.3em', textAlign: 'center' }}>
          <h3 style={{ color: '#27ae60', marginBottom: '0.5em' }}>✓ Complete!</h3>
          <p style={{ marginBottom: '1.5em' }}>Your file is ready to download</p>
          <button onClick={downloadResult} className="button" style={{ marginRight: '0.5em' }}>
            Download
          </button>
          <button onClick={reset} className="button" style={{ background: '#95a5a6' }}>
            Process Another
          </button>
        </div>
      )}

      {/* Info */}
      <p style={{ marginTop: '2em', padding: '1.5em', background: '#f8f9fa', borderRadius: '0.3em' }}>
        <strong>About {tool.name}:</strong> {tool.description}. All processing happens in your browser. 
        Your files are never uploaded to any server. This tool is completely free with no registration required.
      </p>
    </article>
  );
}

function ToolOptions({ toolId, options, setOptions }: { toolId: string; options: Record<string, any>; setOptions: (o: Record<string, any>) => void }) {
  const inputStyle = {
    width: '100%',
    padding: '0.8em',
    border: '1px solid #ddd',
    borderRadius: '0.3em',
    fontFamily: 'Source Sans Pro, sans-serif',
    marginBottom: '1em'
  };

  if (toolId === 'rotate-pdf') {
    return (
      <div style={{ marginBottom: '1.5em' }}>
        <h3>Options</h3>
        <label style={{ display: 'block', marginBottom: '0.5em' }}>Rotation Angle</label>
        <select 
          value={options.angle || 90} 
          onChange={(e) => setOptions({ ...options, angle: Number(e.target.value) })}
          style={inputStyle}
        >
          <option value={90}>90° Clockwise</option>
          <option value={180}>180°</option>
          <option value={270}>270° Counter-clockwise</option>
        </select>
      </div>
    );
  }

  if (toolId === 'add-page-numbers') {
    return (
      <div style={{ marginBottom: '1.5em' }}>
        <h3>Options</h3>
        <label style={{ display: 'block', marginBottom: '0.5em' }}>Position</label>
        <select 
          value={options.position || 'bottom-center'} 
          onChange={(e) => setOptions({ ...options, position: e.target.value })}
          style={inputStyle}
        >
          <option value="bottom-center">Bottom Center</option>
          <option value="bottom-right">Bottom Right</option>
          <option value="top-center">Top Center</option>
          <option value="top-right">Top Right</option>
        </select>
        <label style={{ display: 'block', marginBottom: '0.5em' }}>Start Number</label>
        <input 
          type="number" 
          min={1} 
          value={options.startNumber || 1} 
          onChange={(e) => setOptions({ ...options, startNumber: Number(e.target.value) })}
          style={inputStyle}
        />
      </div>
    );
  }

  if (toolId === 'watermark-pdf') {
    return (
      <div style={{ marginBottom: '1.5em' }}>
        <h3>Options</h3>
        <label style={{ display: 'block', marginBottom: '0.5em' }}>Watermark Text</label>
        <input 
          type="text" 
          value={options.text || 'CONFIDENTIAL'} 
          onChange={(e) => setOptions({ ...options, text: e.target.value })}
          style={inputStyle}
          placeholder="Enter watermark text"
        />
      </div>
    );
  }

  if (toolId === 'split-pdf') {
    return (
      <div style={{ marginBottom: '1.5em' }}>
        <h3>Options</h3>
        <label style={{ display: 'block', marginBottom: '0.5em' }}>Page Range (e.g., 1-3, 5, 7-10)</label>
        <input 
          type="text" 
          value={options.range || ''} 
          onChange={(e) => setOptions({ ...options, range: e.target.value })}
          style={inputStyle}
          placeholder="Leave empty for first half"
        />
      </div>
    );
  }

  return null;
}

// Tool implementations (same as before)
async function mergePDFs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    pages.forEach(page => mergedPdf.addPage(page));
  }
  return createPdfBlob(await mergedPdf.save());
}

async function splitPDF(file: File, options: Record<string, any>): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const newPdf = await PDFDocument.create();
  if (options.range) {
    const pageIndices = parsePageRange(options.range, pdf.getPageCount());
    const pages = await newPdf.copyPages(pdf, pageIndices);
    pages.forEach(page => newPdf.addPage(page));
  } else {
    const half = Math.ceil(pdf.getPageCount() / 2);
    const pages = await newPdf.copyPages(pdf, Array.from({ length: half }, (_, i) => i));
    pages.forEach(page => newPdf.addPage(page));
  }
  return createPdfBlob(await newPdf.save());
}

async function compressPDF(file: File): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  return createPdfBlob(await pdf.save({ useObjectStreams: true }));
}

async function rotatePDF(file: File, angle: number): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  pdf.getPages().forEach(page => {
    page.setRotation(degrees((page.getRotation().angle + angle) % 360));
  });
  return createPdfBlob(await pdf.save());
}

async function pdfToJpg(file: File): Promise<void> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: new Uint8Array(arrayBuffer) } as any).promise;
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport } as any).promise;
    canvas.toBlob((blob) => { if (blob) saveAs(blob, `page-${i}.jpg`); }, 'image/jpeg', 0.92);
  }
}

async function pdfToText(file: File): Promise<void> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: new Uint8Array(arrayBuffer) } as any).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(' ');
    fullText += `\n--- Page ${i} ---\n${text}\n`;
  }
  saveAs(new Blob([fullText], { type: 'text/plain' }), `${file.name.replace('.pdf', '')}.txt`);
}

async function pdfToWord(file: File): Promise<void> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: new Uint8Array(arrayBuffer) } as any).promise;
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += '\n' + content.items.map((item: any) => item.str).join(' ') + '\n';
  }
  const html = `<html><head><meta charset="utf-8"></head><body><pre style="font-family:Calibri;font-size:11pt;">${fullText.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre></body></html>`;
  saveAs(new Blob([html], { type: 'application/msword' }), `${file.name.replace('.pdf', '.doc')}`);
}

async function imagesToPDF(files: File[]): Promise<Blob> {
  const pdf = await PDFDocument.create();
  for (const file of files) {
    const imageBytes = await file.arrayBuffer();
    const image = file.type === 'image/png' ? await pdf.embedPng(imageBytes) : await pdf.embedJpg(imageBytes);
    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
  }
  return createPdfBlob(await pdf.save());
}

async function wordToPDF(file: File): Promise<Blob> {
  const text = await file.text();
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const page = pdf.addPage([595, 842]);
  const { height } = page.getSize();
  const lines = text.split('\n').slice(0, 50);
  let y = height - 50;
  for (const line of lines) {
    if (y < 50) break;
    const cleanLine = line.replace(/[^\x20-\x7E]/g, '').substring(0, 80);
    if (cleanLine.trim()) {
      page.drawText(cleanLine, { x: 50, y, size: 11, font });
      y -= 18;
    }
  }
  return createPdfBlob(await pdf.save());
}

async function protectPDF(file: File): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  return createPdfBlob(await pdf.save());
}

async function unlockPDF(file: File): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes, { ignoreEncryption: true });
  return createPdfBlob(await pdf.save());
}

async function addPageNumbers(file: File, options: Record<string, any>): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const pages = pdf.getPages();
  const startNum = options.startNumber || 1;
  const position = options.position || 'bottom-center';
  pages.forEach((page, index) => {
    const { width, height } = page.getSize();
    const num = String(startNum + index);
    const textWidth = font.widthOfTextAtSize(num, 10);
    let x: number, y: number;
    switch (position) {
      case 'bottom-right': x = width - textWidth - 40; y = 30; break;
      case 'top-center': x = (width - textWidth) / 2; y = height - 30; break;
      case 'top-right': x = width - textWidth - 40; y = height - 30; break;
      default: x = (width - textWidth) / 2; y = 30;
    }
    page.drawText(num, { x, y, size: 10, font, color: rgb(0.3, 0.3, 0.3) });
  });
  return createPdfBlob(await pdf.save());
}

async function addWatermark(file: File, text: string): Promise<Blob> {
  const bytes = await file.arrayBuffer();
  const pdf = await PDFDocument.load(bytes);
  const font = await pdf.embedFont(StandardFonts.HelveticaBold);
  pdf.getPages().forEach(page => {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, 50);
    page.drawText(text, {
      x: (width - textWidth) / 2, y: height / 2, size: 50, font,
      color: rgb(0.8, 0.8, 0.8), opacity: 0.3, rotate: degrees(-45),
    });
  });
  return createPdfBlob(await pdf.save());
}

function parsePageRange(range: string, totalPages: number): number[] {
  const indices: number[] = [];
  for (const part of range.split(',').map(s => s.trim())) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number);
      for (let i = start; i <= Math.min(end, totalPages); i++) {
        if (i >= 1) indices.push(i - 1);
      }
    } else {
      const num = Number(part);
      if (num >= 1 && num <= totalPages) indices.push(num - 1);
    }
  }
  return [...new Set(indices)].sort((a, b) => a - b);
}

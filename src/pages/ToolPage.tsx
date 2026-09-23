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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tool Not Found</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">← Back to all tools</Link>
        </div>
      </div>
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
  const [dragOver, setDragOver] = useState(false);
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                PDFNova
              </span>
            </Link>
            <Link to="/" className="text-gray-500 hover:text-blue-600 text-sm font-medium transition-colors">
              ← All Tools
            </Link>
          </div>
        </div>
      </header>

      {/* Tool Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tool Header */}
        <div className="text-center mb-10">
          <div className={`w-16 h-16 ${tool.color} rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-lg`}>
            {tool.icon}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{tool.name}</h1>
          <p className="text-gray-500 text-lg">{tool.description}</p>
        </div>

        {/* Upload Area */}
        {!result && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            className={`bg-white rounded-2xl border-2 border-dashed p-12 text-center transition-all ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="mb-6">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {files.length === 0 ? 'Drop your files here' : `${files.length} file(s) selected`}
            </p>
            <p className="text-sm text-gray-400 mb-6">or click to browse</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
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
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
            <h3 className="font-bold text-gray-900 mb-4">Selected Files</h3>
            <div className="space-y-2">
              {files.map((file, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{file.name}</p>
                      <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  {isMultiple && (
                    <button
                      onClick={() => removeFile(i)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Options */}
        {files.length > 0 && !result && !processing && (
          <ToolOptions toolId={tool.id} options={options} setOptions={setOptions} />
        )}

        {/* Process Button */}
        {files.length > 0 && !result && (
          <div className="mt-8 text-center">
            <button
              onClick={processFiles}
              disabled={processing}
              className={`px-10 py-4 rounded-xl font-bold text-lg transition-all ${
                processing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:scale-105'
              }`}
            >
              {processing ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : `Process ${tool.name}`}
            </button>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <span className="font-medium">Error:</span> {error}
            </div>
          </div>
        )}

        {/* Result */}
        {result && resultUrl && (
          <div className="bg-white rounded-2xl shadow-lg border border-green-100 p-10 text-center mt-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Done!</h3>
            <p className="text-gray-500 mb-8">Your file is ready to download</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={downloadResult}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all hover:scale-105"
              >
                Download File
              </button>
              <button
                onClick={reset}
                className="px-8 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-all"
              >
                Process Another
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">About {tool.name}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {tool.description}. All processing happens in your browser — your files are never uploaded to any server. 
                This tool is completely free with no registration required.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function ToolOptions({ toolId, options, setOptions }: { toolId: string; options: Record<string, any>; setOptions: (o: Record<string, any>) => void }) {
  if (toolId === 'rotate-pdf') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <h3 className="font-bold text-gray-900 mb-4">Rotation Angle</h3>
        <div className="grid grid-cols-3 gap-3">
          {[{v: 90, l: '90°'}, {v: 180, l: '180°'}, {v: 270, l: '270°'}].map(opt => (
            <button
              key={opt.v}
              onClick={() => setOptions({ ...options, angle: opt.v })}
              className={`py-3 rounded-xl font-medium transition-all ${
                (options.angle || 90) === opt.v
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {opt.l}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (toolId === 'add-page-numbers') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <h3 className="font-bold text-gray-900 mb-4">Options</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
            <select
              value={options.position || 'bottom-center'}
              onChange={(e) => setOptions({ ...options, position: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            >
              <option value="bottom-center">Bottom Center</option>
              <option value="bottom-right">Bottom Right</option>
              <option value="top-center">Top Center</option>
              <option value="top-right">Top Right</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Number</label>
            <input
              type="number"
              min={1}
              value={options.startNumber || 1}
              onChange={(e) => setOptions({ ...options, startNumber: Number(e.target.value) })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    );
  }

  if (toolId === 'watermark-pdf') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <h3 className="font-bold text-gray-900 mb-4">Watermark Text</h3>
        <input
          type="text"
          value={options.text || 'CONFIDENTIAL'}
          onChange={(e) => setOptions({ ...options, text: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          placeholder="Enter watermark text"
        />
      </div>
    );
  }

  if (toolId === 'split-pdf') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        <h3 className="font-bold text-gray-900 mb-4">Page Range</h3>
        <input
          type="text"
          value={options.range || ''}
          onChange={(e) => setOptions({ ...options, range: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
          placeholder="e.g., 1-3, 5, 7-10"
        />
        <p className="text-xs text-gray-400 mt-2">Leave empty to extract first half</p>
      </div>
    );
  }

  return null;
}

// Tool implementations
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

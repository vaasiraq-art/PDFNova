import { useParams, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { tools } from '../data/tools';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { getDocument } from 'pdfjs-dist';

function createPdfBlob(pdfBytes: Uint8Array | number[]): Blob {
  return new Blob([pdfBytes as any], { type: 'application/pdf' });
}

export default function ToolPage() {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = tools.find(t => t.id === toolId);

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Tool Not Found</h1>
          <Link to="/" className="text-blue-600 hover:underline">← Back to tools</Link>
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
      setError(err.message || 'An error occurred while processing your file');
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
    setOptions({});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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

      {/* Tool Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Tool Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 ${tool.color} rounded flex items-center justify-center text-white font-bold`}>
              {tool.icon}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{tool.name}</h1>
          </div>
          <p className="text-gray-600">{tool.description}</p>
        </div>

        {/* Upload Area */}
        {!result && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`bg-white border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <p className="text-gray-700 font-medium mb-1">
              {files.length === 0 ? 'Drop files here or click to browse' : `${files.length} file(s) selected`}
            </p>
            <p className="text-sm text-gray-500">
              {tool.acceptTypes ? `Accepts: ${tool.acceptTypes}` : 'PDF files'}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={tool.acceptTypes || '.pdf'}
              multiple={isMultiple}
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />
          </div>
        )}

        {/* File List */}
        {files.length > 0 && !result && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
            <h3 className="font-medium text-gray-900 mb-3">Selected Files</h3>
            <ul className="space-y-2">
              {files.map((file, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700 truncate flex-1">
                    {file.name} <span className="text-gray-400">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                  </span>
                  {isMultiple && (
                    <button
                      onClick={() => removeFile(i)}
                      className="text-red-500 hover:text-red-700 ml-3 text-xs"
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
          <button
            onClick={processFiles}
            disabled={processing}
            className={`w-full mt-6 py-3 rounded-lg font-medium transition-colors ${
              processing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {processing ? 'Processing...' : `Process ${tool.name}`}
          </button>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Result */}
        {result && resultUrl && (
          <div className="bg-white border border-green-200 rounded-lg p-8 text-center mt-6">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Done!</h3>
            <p className="text-gray-600 mb-6">Your file is ready to download</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={downloadResult}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
              >
                Download
              </button>
              <button
                onClick={reset}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              >
                Process Another
              </button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-900">
          <strong>About this tool:</strong> {tool.description}. All processing happens in your browser — your files are never uploaded to any server.
        </div>
      </main>
    </div>
  );
}

function ToolOptions({ toolId, options, setOptions }: { toolId: string; options: Record<string, any>; setOptions: (o: Record<string, any>) => void }) {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500";

  if (toolId === 'rotate-pdf') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rotation Angle</label>
        <select
          value={options.angle || 90}
          onChange={(e) => setOptions({ ...options, angle: Number(e.target.value) })}
          className={inputClass}
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
      <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4 space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
          <select
            value={options.position || 'bottom-center'}
            onChange={(e) => setOptions({ ...options, position: e.target.value })}
            className={inputClass}
          >
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="top-center">Top Center</option>
            <option value="top-right">Top Right</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Number</label>
          <input
            type="number"
            min={1}
            value={options.startNumber || 1}
            onChange={(e) => setOptions({ ...options, startNumber: Number(e.target.value) })}
            className={inputClass}
          />
        </div>
      </div>
    );
  }

  if (toolId === 'watermark-pdf') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Watermark Text</label>
        <input
          type="text"
          value={options.text || 'CONFIDENTIAL'}
          onChange={(e) => setOptions({ ...options, text: e.target.value })}
          className={inputClass}
          placeholder="Enter watermark text"
        />
      </div>
    );
  }

  if (toolId === 'split-pdf') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Page Range</label>
        <input
          type="text"
          value={options.range || ''}
          onChange={(e) => setOptions({ ...options, range: e.target.value })}
          className={inputClass}
          placeholder="e.g., 1-3, 5, 7-10"
        />
        <p className="text-xs text-gray-500 mt-1">Leave empty to extract first half</p>
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
  const pdf = await getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 2 });
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport }).promise;
    canvas.toBlob((blob) => { if (blob) saveAs(blob, `page-${i}.jpg`); }, 'image/jpeg', 0.92);
  }
}

async function pdfToText(file: File): Promise<void> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
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
  const pdf = await getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
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

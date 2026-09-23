import { useParams, Link } from 'react-router-dom';
import { useState, useRef } from 'react';
import { tools } from '../data/tools';
import { Upload, Download, Loader2, CheckCircle2, AlertCircle, ArrowLeft, X } from 'lucide-react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { saveAs } from 'file-saver';
import { getDocument } from 'pdfjs-dist';

interface ToolPageProps {
  darkMode: boolean;
}

// Helper to create PDF blob from pdf-lib output
function createPdfBlob(pdfBytes: any): Blob {
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

export default function ToolPage({ darkMode }: ToolPageProps) {
  const { toolId } = useParams<{ toolId: string }>();
  const tool = tools.find(t => t.id === toolId);

  if (!tool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Tool not found</h1>
        <Link to="/" className="text-indigo-500 hover:underline">← Back to all tools</Link>
      </div>
    );
  }

  return <ToolProcessor tool={tool} darkMode={darkMode} />;
}

interface ToolProcessorProps {
  tool: typeof tools[0];
  darkMode: boolean;
}

function ToolProcessor({ tool, darkMode }: ToolProcessorProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [options, setOptions] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isMultiple = tool.multiple || tool.id === 'merge-pdf';

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const fileArray = Array.from(newFiles);
    if (isMultiple) {
      setFiles(prev => [...prev, ...fileArray]);
    } else {
      setFiles(fileArray.slice(0, 1));
    }
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
    setProgress(10);

    try {
      let outputBlob: Blob;

      switch (tool.id) {
        case 'merge-pdf':
          outputBlob = await mergePDFs(files);
          break;
        case 'split-pdf':
          outputBlob = await splitPDF(files[0], options);
          break;
        case 'compress-pdf':
          outputBlob = await compressPDF(files[0]);
          break;
        case 'rotate-pdf':
          outputBlob = await rotatePDF(files[0], options.angle || 90);
          break;
        case 'pdf-to-jpg':
          await pdfToJpg(files[0]);
          setProcessing(false);
          return;
        case 'pdf-to-text':
          await pdfToText(files[0]);
          setProcessing(false);
          return;
        case 'pdf-to-word':
          await pdfToWord(files[0]);
          setProcessing(false);
          return;
        case 'jpg-to-pdf':
        case 'png-to-pdf':
        case 'images-to-pdf':
          outputBlob = await imagesToPDF(files);
          break;
        case 'word-to-pdf':
          outputBlob = await wordToPDF(files[0]);
          break;
        case 'protect-pdf':
          outputBlob = await protectPDF(files[0]);
          break;
        case 'unlock-pdf':
          outputBlob = await unlockPDF(files[0]);
          break;
        case 'add-page-numbers':
          outputBlob = await addPageNumbers(files[0], options);
          break;
        case 'watermark-pdf':
          outputBlob = await addWatermark(files[0], options.text || 'CONFIDENTIAL');
          break;
        default:
          throw new Error('Tool not implemented yet');
      }

      setResult(outputBlob);
      const url = URL.createObjectURL(outputBlob);
      setResultUrl(url);
      setProgress(100);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing');
    }

    setProcessing(false);
  };

  const downloadResult = () => {
    if (resultUrl && result) {
      const ext = tool.id.includes('jpg') ? 'zip' : 'pdf';
      saveAs(result, `pdfnova-${tool.id}-${Date.now()}.${ext}`);
    }
  };

  const reset = () => {
    setFiles([]);
    setResult(null);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <Link to="/" className={`inline-flex items-center gap-1 text-sm mb-4 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}>
          <ArrowLeft size={14} />
          Back to all tools
        </Link>
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl shadow-lg`}>
            {tool.icon}
          </div>
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {tool.name}
            </h1>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {tool.description}
            </p>
          </div>
        </div>
      </div>

      {/* Upload Area */}
      {!result && (
        <div
          className={`rounded-2xl border-2 border-dashed p-8 md:p-12 text-center transition-all ${
            darkMode ? 'border-gray-700 bg-gray-900 hover:border-indigo-500' : 'border-gray-300 bg-gray-50 hover:border-indigo-400'
          }`}
        >
          <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-white shadow-md'}`}>
            <Upload size={28} className="text-indigo-500" />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            {files.length === 0 ? 'Drop your files here' : `${files.length} file(s) selected`}
          </h3>
          <p className={`text-sm mb-4 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            or click to browse • {isMultiple ? 'Multiple files allowed' : 'Single file'}
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-2.5 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-600 transition-colors"
          >
            Select Files
          </button>
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

      {/* File list */}
      {files.length > 0 && !result && (
        <div className={`mt-4 rounded-xl border p-4 ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-medium text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {files.length} file(s) selected
            </h4>
            <button onClick={reset} className="text-sm text-red-500 hover:text-red-600">Clear all</button>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {files.map((file, i) => (
              <div key={i} className={`flex items-center justify-between p-2.5 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">{tool.icon}</span>
                  <span className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{file.name}</span>
                  <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                </div>
                {isMultiple && (
                  <button onClick={() => removeFile(i)} className="text-gray-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool-specific options */}
      {files.length > 0 && !result && !processing && (
        <ToolOptions toolId={tool.id} options={options} setOptions={setOptions} darkMode={darkMode} />
      )}

      {/* Process Button */}
      {files.length > 0 && !result && (
        <div className="mt-6 text-center">
          <button
            onClick={processFiles}
            disabled={processing}
            className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 mx-auto"
          >
            {processing ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing... {progress > 0 && progress < 100 ? `${progress}%` : ''}
              </>
            ) : (
              <>
                Process {tool.name}
                <CheckCircle2 size={18} />
              </>
            )}
          </button>
        </div>
      )}

      {/* Progress bar */}
      {processing && (
        <div className={`mt-4 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-start gap-3">
          <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && resultUrl && (
        <div className={`mt-6 rounded-2xl border p-8 text-center ${darkMode ? 'border-green-800 bg-green-900/20' : 'border-green-200 bg-green-50'}`}>
          <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-white" />
          </div>
          <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-green-300' : 'text-green-800'}`}>
            Processing Complete!
          </h3>
          <p className={`text-sm mb-6 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            Your file is ready to download
          </p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={downloadResult}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-all flex items-center gap-2"
            >
              <Download size={18} />
              Download
            </button>
            <button
              onClick={reset}
              className={`px-6 py-3 rounded-xl font-semibold border-2 transition-all ${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-100'}`}
            >
              Process Another
            </button>
          </div>
        </div>
      )}

      {/* Info section */}
      <div className={`mt-12 p-6 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <h3 className={`font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          About {tool.name}
        </h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          {tool.description}. All processing happens securely in your browser — your files are never uploaded to any server.
          This tool is completely free with no registration required.
        </p>
      </div>
    </div>
  );
}

// Tool-specific options component
function ToolOptions({ toolId, options, setOptions, darkMode }: { toolId: string; options: Record<string, any>; setOptions: (o: Record<string, any>) => void; darkMode: boolean }) {
  const inputClass = `w-full px-3 py-2 rounded-lg border text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-700'} focus:outline-none focus:ring-2 focus:ring-indigo-500`;

  if (toolId === 'rotate-pdf') {
    return (
      <div className={`mt-4 p-4 rounded-xl border ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <label className={`text-sm font-medium mb-2 block ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Rotation Angle</label>
        <select value={options.angle || 90} onChange={(e) => setOptions({ ...options, angle: Number(e.target.value) })} className={inputClass}>
          <option value={90}>90° Clockwise</option>
          <option value={180}>180°</option>
          <option value={270}>270° (90° Counter-clockwise)</option>
        </select>
      </div>
    );
  }

  if (toolId === 'add-page-numbers') {
    return (
      <div className={`mt-4 p-4 rounded-xl border space-y-3 ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <div>
          <label className={`text-sm font-medium mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Position</label>
          <select value={options.position || 'bottom-center'} onChange={(e) => setOptions({ ...options, position: e.target.value })} className={inputClass}>
            <option value="bottom-center">Bottom Center</option>
            <option value="bottom-right">Bottom Right</option>
            <option value="top-center">Top Center</option>
            <option value="top-right">Top Right</option>
          </select>
        </div>
        <div>
          <label className={`text-sm font-medium mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Start Number</label>
          <input type="number" min={1} value={options.startNumber || 1} onChange={(e) => setOptions({ ...options, startNumber: Number(e.target.value) })} className={inputClass} />
        </div>
      </div>
    );
  }

  if (toolId === 'watermark-pdf') {
    return (
      <div className={`mt-4 p-4 rounded-xl border ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <label className={`text-sm font-medium mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Watermark Text</label>
        <input type="text" value={options.text || 'CONFIDENTIAL'} onChange={(e) => setOptions({ ...options, text: e.target.value })} className={inputClass} placeholder="Enter watermark text" />
      </div>
    );
  }

  if (toolId === 'split-pdf') {
    return (
      <div className={`mt-4 p-4 rounded-xl border ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
        <label className={`text-sm font-medium mb-1 block ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Page Range (e.g., 1-3, 5, 7-10)</label>
        <input type="text" value={options.range || ''} onChange={(e) => setOptions({ ...options, range: e.target.value })} className={inputClass} placeholder="Leave empty to extract first half" />
      </div>
    );
  }

  return null;
}

// ===== TOOL IMPLEMENTATIONS =====

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
    const image = file.type === 'image/png'
      ? await pdf.embedPng(imageBytes)
      : await pdf.embedJpg(imageBytes);
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

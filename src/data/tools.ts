export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  acceptTypes?: string;
  multiple?: boolean;
}

export const tools: Tool[] = [
  // Merge & Organize
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into one document', icon: '📎', color: 'from-red-500 to-rose-600', category: 'Organize' },
  { id: 'split-pdf', name: 'Split PDF', description: 'Extract pages from your PDF into separate files', icon: '✂️', color: 'from-orange-500 to-amber-600', category: 'Organize' },
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce file size while keeping quality', icon: '🗜️', color: 'from-green-500 to-emerald-600', category: 'Optimize' },
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate PDF pages to the correct orientation', icon: '🔄', color: 'from-blue-500 to-cyan-600', category: 'Organize' },

  // Convert FROM PDF
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert each PDF page into a JPG image', icon: '🖼️', color: 'from-purple-500 to-violet-600', category: 'Convert' },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF documents to editable Word files', icon: '📝', color: 'from-blue-600 to-indigo-600', category: 'Convert' },
  { id: 'pdf-to-text', name: 'PDF to Text', description: 'Extract text content from PDF documents', icon: '📄', color: 'from-gray-500 to-slate-600', category: 'Convert' },

  // Convert TO PDF
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG images to PDF documents', icon: '📸', color: 'from-pink-500 to-rose-600', category: 'Convert', acceptTypes: 'image/jpeg,image/jpg', multiple: true },
  { id: 'png-to-pdf', name: 'PNG to PDF', description: 'Convert PNG images to PDF documents', icon: '🎨', color: 'from-teal-500 to-cyan-600', category: 'Convert', acceptTypes: 'image/png', multiple: true },
  { id: 'images-to-pdf', name: 'Images to PDF', description: 'Convert multiple images to a single PDF', icon: '🖼️', color: 'from-indigo-500 to-blue-600', category: 'Convert', acceptTypes: 'image/*', multiple: true },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word documents to PDF format', icon: '📃', color: 'from-blue-500 to-blue-700', category: 'Convert', acceptTypes: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document' },

  // Security
  { id: 'protect-pdf', name: 'Protect PDF', description: 'Add password protection to your PDF', icon: '🔒', color: 'from-red-600 to-red-800', category: 'Security' },
  { id: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove password from a protected PDF', icon: '🔓', color: 'from-green-600 to-green-800', category: 'Security' },

  // Edit
  { id: 'add-page-numbers', name: 'Page Numbers', description: 'Add page numbers to your PDF document', icon: '🔢', color: 'from-amber-500 to-orange-600', category: 'Edit' },
  { id: 'watermark-pdf', name: 'Watermark', description: 'Add text watermark to your PDF pages', icon: '💧', color: 'from-sky-500 to-blue-600', category: 'Edit' },

  // Reader
  { id: 'pdf-reader', name: 'PDF Reader', description: 'Read PDF with AI assistant and bookmarks', icon: '📖', color: 'from-violet-500 to-purple-600', category: 'View' },
];

export const categories = ['All', 'Organize', 'Convert', 'Optimize', 'Edit', 'Security', 'View'];

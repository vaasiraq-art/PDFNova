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
  { id: 'merge-pdf', name: 'Merge PDF', description: 'Combine multiple PDFs into one document', icon: 'M', color: 'bg-red-500', category: 'Organize' },
  { id: 'split-pdf', name: 'Split PDF', description: 'Extract pages from your PDF', icon: 'S', color: 'bg-orange-500', category: 'Organize' },
  { id: 'compress-pdf', name: 'Compress PDF', description: 'Reduce file size while keeping quality', icon: 'C', color: 'bg-green-500', category: 'Optimize' },
  { id: 'rotate-pdf', name: 'Rotate PDF', description: 'Rotate PDF pages', icon: 'R', color: 'bg-blue-500', category: 'Organize' },

  // Convert FROM PDF
  { id: 'pdf-to-jpg', name: 'PDF to JPG', description: 'Convert PDF pages to JPG images', icon: '→', color: 'bg-purple-500', category: 'Convert' },
  { id: 'pdf-to-word', name: 'PDF to Word', description: 'Convert PDF to Word documents', icon: '→', color: 'bg-blue-600', category: 'Convert' },
  { id: 'pdf-to-text', name: 'PDF to Text', description: 'Extract text from PDF', icon: '→', color: 'bg-gray-500', category: 'Convert' },

  // Convert TO PDF
  { id: 'jpg-to-pdf', name: 'JPG to PDF', description: 'Convert JPG images to PDF', icon: '→', color: 'bg-pink-500', category: 'Convert', acceptTypes: 'image/jpeg,image/jpg', multiple: true },
  { id: 'png-to-pdf', name: 'PNG to PDF', description: 'Convert PNG images to PDF', icon: '→', color: 'bg-teal-500', category: 'Convert', acceptTypes: 'image/png', multiple: true },
  { id: 'images-to-pdf', name: 'Images to PDF', description: 'Convert multiple images to PDF', icon: '→', color: 'bg-indigo-500', category: 'Convert', acceptTypes: 'image/*', multiple: true },
  { id: 'word-to-pdf', name: 'Word to PDF', description: 'Convert Word documents to PDF', icon: '→', color: 'bg-blue-500', category: 'Convert', acceptTypes: '.doc,.docx,application/msword' },

  // Security
  { id: 'protect-pdf', name: 'Protect PDF', description: 'Add password protection', icon: 'P', color: 'bg-red-600', category: 'Security' },
  { id: 'unlock-pdf', name: 'Unlock PDF', description: 'Remove password from PDF', icon: 'U', color: 'bg-green-600', category: 'Security' },

  // Edit
  { id: 'add-page-numbers', name: 'Page Numbers', description: 'Add page numbers to PDF', icon: '#', color: 'bg-amber-500', category: 'Edit' },
  { id: 'watermark-pdf', name: 'Watermark', description: 'Add text watermark to PDF', icon: 'W', color: 'bg-sky-500', category: 'Edit' },

  // Reader
  { id: 'pdf-reader', name: 'PDF Reader', description: 'Read PDF with navigation', icon: '→', color: 'bg-violet-500', category: 'View' },
];

export const categories = ['All', 'Organize', 'Convert', 'Optimize', 'Edit', 'Security', 'View'];

import { useState, useRef } from 'react';
import { Upload, BookOpen, Moon, Sun } from 'lucide-react';

interface UploadScreenProps {
  onFileUpload: (file: File) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function UploadScreen({ onFileUpload, darkMode, toggleDarkMode }: UploadScreenProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
      onFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files[0]);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'}`}>
      <button
        onClick={toggleDarkMode}
        className={`absolute top-6 right-6 p-3 rounded-full transition-all ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-white hover:bg-gray-100 text-gray-600 shadow-md'}`}
        aria-label="Toggle dark mode"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <header className="text-center mb-12">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 ${darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'}`}>
          <BookOpen size={40} className="text-indigo-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          PDF Book Reader
        </h1>
        <p className={`text-lg max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Upload your PDF book and enjoy a comfortable reading experience with AI-powered assistance
        </p>
      </header>

      <main>
        <section
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          aria-label="Upload PDF file"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click(); }}
          className={`w-full max-w-lg p-12 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50 scale-105'
              : darkMode
              ? 'border-gray-600 bg-gray-800 hover:border-indigo-500 hover:bg-gray-750'
              : 'border-gray-300 bg-white hover:border-indigo-400 hover:shadow-xl'
          }`}
        >
          <div className="flex flex-col items-center">
            <div className={`p-4 rounded-full mb-4 ${isDragging ? 'bg-indigo-100' : darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <Upload size={32} className={`${isDragging ? 'text-indigo-500' : 'text-gray-400'}`} />
            </div>
            <p className="text-lg font-medium mb-2">
              {isDragging ? 'Drop your PDF here' : 'Drag & drop your PDF book'}
            </p>
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              or click to browse files • Supports all PDF files
            </p>
          </div>
        </section>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileSelect}
          className="hidden"
          aria-label="Select PDF file"
        />
      </main>

      <section className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-3xl w-full" aria-label="Features">
        <article className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur'}`}>
          <div className="text-2xl mb-2">🤖</div>
          <h2 className="font-medium mb-1">AI Assistant</h2>
          <p className="text-sm opacity-70">Ask questions, get summaries, and analyze your book with AI</p>
        </article>
        <article className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur'}`}>
          <div className="text-2xl mb-2">📖</div>
          <h2 className="font-medium mb-1">Page Flip</h2>
          <p className="text-sm opacity-70">Realistic 3D paper flip animation with sound effects</p>
        </article>
        <article className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur'}`}>
          <div className="text-2xl mb-2">📑</div>
          <h2 className="font-medium mb-1">Smart Bookmarks</h2>
          <p className="text-sm opacity-70">Save your favorite pages and track reading progress</p>
        </article>
        <article className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white/80 backdrop-blur'}`}>
          <div className="text-2xl mb-2">🌙</div>
          <h2 className="font-medium mb-1">Dark Mode</h2>
          <p className="text-sm opacity-70">Read comfortably day or night with theme switching</p>
        </article>
      </section>

      <footer className={`mt-16 text-center text-sm ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        <p>🔒 Your files are processed locally in your browser. Nothing is uploaded to any server.</p>
        <p className="mt-2">Free online PDF reader • No registration required • Works offline</p>
      </footer>
    </div>
  );
}

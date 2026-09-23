import { Link } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export default function Navbar({ darkMode, toggleDarkMode }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className={`sticky top-0 z-50 border-b backdrop-blur-xl ${darkMode ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              PDFNova
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              All Tools
            </Link>
            <Link to="/tools/merge-pdf" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              Merge
            </Link>
            <Link to="/tools/compress-pdf" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              Compress
            </Link>
            <Link to="/tools/pdf-to-jpg" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              Convert
            </Link>
            <Link to="/reader" className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}>
              Reader
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`md:hidden p-2.5 rounded-xl transition-all ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`md:hidden border-t ${darkMode ? 'border-gray-800 bg-gray-950' : 'border-gray-200 bg-white'}`}>
          <div className="px-4 py-3 space-y-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              All Tools
            </Link>
            <Link to="/tools/merge-pdf" onClick={() => setMobileOpen(false)} className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              Merge PDF
            </Link>
            <Link to="/tools/compress-pdf" onClick={() => setMobileOpen(false)} className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              Compress PDF
            </Link>
            <Link to="/tools/pdf-to-jpg" onClick={() => setMobileOpen(false)} className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              PDF to JPG
            </Link>
            <Link to="/tools/jpg-to-pdf" onClick={() => setMobileOpen(false)} className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              JPG to PDF
            </Link>
            <Link to="/reader" onClick={() => setMobileOpen(false)} className={`block px-4 py-2.5 rounded-lg text-sm font-medium ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
              PDF Reader
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

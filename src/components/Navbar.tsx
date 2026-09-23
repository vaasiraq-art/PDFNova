import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">PDFNova</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm text-gray-600 hover:text-gray-900">
              All Tools
            </Link>
            <Link to="/tools/merge-pdf" className="text-sm text-gray-600 hover:text-gray-900">
              Merge PDF
            </Link>
            <Link to="/tools/compress-pdf" className="text-sm text-gray-600 hover:text-gray-900">
              Compress
            </Link>
            <Link to="/tools/pdf-to-jpg" className="text-sm text-gray-600 hover:text-gray-900">
              Convert
            </Link>
            <Link to="/reader" className="text-sm text-gray-600 hover:text-gray-900">
              Reader
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

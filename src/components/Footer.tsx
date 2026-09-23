import { Link } from 'react-router-dom';
import { tools } from '../data/tools';

interface FooterProps {
  darkMode: boolean;
}

export default function Footer({ darkMode }: FooterProps) {
  const popularTools = tools.slice(0, 8);

  return (
    <footer className={`border-t mt-auto ${darkMode ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                PDFNova
              </span>
            </Link>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Free online PDF tools. Fast, secure, and easy to use. No registration required.
            </p>
          </div>

          {/* Popular Tools */}
          <div>
            <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Popular Tools</h3>
            <ul className="space-y-2">
              {popularTools.slice(0, 5).map(tool => (
                <li key={tool.id}>
                  <Link to={`/tools/${tool.id}`} className={`text-sm hover:text-indigo-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Convert */}
          <div>
            <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Convert</h3>
            <ul className="space-y-2">
              {tools.filter(t => t.category === 'Convert').slice(0, 5).map(tool => (
                <li key={tool.id}>
                  <Link to={`/tools/${tool.id}`} className={`text-sm hover:text-indigo-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className={`font-semibold text-sm mb-3 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Company</h3>
            <ul className="space-y-2">
              <li><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>About</span></li>
              <li><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Privacy Policy</span></li>
              <li><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Terms of Service</span></li>
              <li><span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Contact</span></li>
            </ul>
          </div>
        </div>

        <div className={`mt-8 pt-8 border-t text-center text-sm ${darkMode ? 'border-gray-800 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
          <p>© 2026 PDFNova. All rights reserved. Free PDF tools for everyone.</p>
        </div>
      </div>
    </footer>
  );
}

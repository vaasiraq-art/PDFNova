import { Link } from 'react-router-dom';
import { tools } from '../data/tools';

export default function Footer() {
  const popularTools = tools.slice(0, 6);

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">PDFNova</span>
            </Link>
            <p className="text-sm text-gray-600">
              Free online PDF tools. Fast, secure, and easy to use.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Popular Tools</h3>
            <ul className="space-y-2">
              {popularTools.map(tool => (
                <li key={tool.id}>
                  <Link to={`/tools/${tool.id}`} className="text-sm text-gray-600 hover:text-blue-600">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Convert</h3>
            <ul className="space-y-2">
              {tools.filter(t => t.category === 'Convert').slice(0, 5).map(tool => (
                <li key={tool.id}>
                  <Link to={`/tools/${tool.id}`} className="text-sm text-gray-600 hover:text-blue-600">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Company</h3>
            <ul className="space-y-2">
              <li><span className="text-sm text-gray-600">About</span></li>
              <li><span className="text-sm text-gray-600">Privacy Policy</span></li>
              <li><span className="text-sm text-gray-600">Terms of Service</span></li>
              <li><span className="text-sm text-gray-600">Contact</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>© 2026 PDFNova. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

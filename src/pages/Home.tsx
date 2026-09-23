import { Link } from 'react-router-dom';
import { tools, categories } from '../data/tools';
import { useState } from 'react';

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = activeCategory === 'All' 
    ? tools 
    : tools.filter(t => t.category === activeCategory);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Every PDF tool you need
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Merge, split, compress, convert, and edit PDFs. Free and easy to use.
            </p>
            <div className="flex gap-3">
              <Link
                to="/tools/merge-pdf"
                className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700"
              >
                Get Started
              </Link>
              <a
                href="#tools"
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50"
              >
                Browse Tools
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tools */}
      <section id="tools" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          All PDF Tools
        </h2>

        {/* Category Filter */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTools.map(tool => (
            <Link
              key={tool.id}
              to={tool.id === 'pdf-reader' ? '/reader' : `/tools/${tool.id}`}
              className="group p-6 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className={`w-12 h-12 ${tool.color} rounded-lg flex items-center justify-center text-white font-bold text-lg mb-4`}>
                {tool.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {tool.name}
              </h3>
              <p className="text-sm text-gray-600">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-8 text-center">
            Why use PDFNova?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">100% Free</h3>
              <p className="text-sm text-gray-600">
                All tools are completely free. No registration, no hidden costs, no file limits.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure & Private</h3>
              <p className="text-sm text-gray-600">
                Files are processed in your browser. Nothing is uploaded to any server.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast & Easy</h3>
              <p className="text-sm text-gray-600">
                Simple interface, instant results. Works on any device, no installation needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            { q: 'Is PDFNova free?', a: 'Yes, all tools are 100% free with no registration required.' },
            { q: 'Are my files secure?', a: 'Yes. All processing happens in your browser. Files never leave your device.' },
            { q: 'What formats are supported?', a: 'PDF, JPG, PNG, and common document formats. We support conversion between these formats.' },
            { q: 'Do I need to install software?', a: 'No. PDFNova works entirely in your web browser on any device.' },
          ].map((faq, i) => (
            <details key={i} className="border border-gray-200 rounded-lg">
              <summary className="px-5 py-4 cursor-pointer font-medium text-gray-900 hover:bg-gray-50">
                {faq.q}
              </summary>
              <div className="px-5 pb-4 text-sm text-gray-600">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

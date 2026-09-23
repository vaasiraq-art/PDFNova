import { Link } from 'react-router-dom';
import { tools, categories } from '../data/tools';
import { useState } from 'react';
import { ArrowRight, Shield, Zap, Globe, CheckCircle2 } from 'lucide-react';

interface HomeProps {
  darkMode: boolean;
}

export default function Home({ darkMode }: HomeProps) {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTools = activeCategory === 'All' 
    ? tools 
    : tools.filter(t => t.category === activeCategory);

  return (
    <div>
      {/* Hero Section */}
      <section className={`relative overflow-hidden ${darkMode ? 'bg-gradient-to-b from-gray-950 via-indigo-950/20 to-gray-950' : 'bg-gradient-to-b from-indigo-50 via-purple-50/50 to-white'}`}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-6">
              <Zap size={14} className="text-indigo-500" />
              <span className="text-sm font-medium text-indigo-500">100% Free • No Registration Required</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className={darkMode ? 'text-white' : 'text-gray-900'}>Every PDF Tool </span>
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                You Need
              </span>
            </h1>

            <p className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Merge, split, compress, convert, and edit PDFs with our powerful free online tools. 
              Fast, secure, and works entirely in your browser.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/tools/merge-pdf"
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight size={18} />
              </Link>
              <a
                href="#tools"
                className={`px-8 py-4 rounded-xl font-semibold border-2 transition-all hover:scale-105 ${darkMode ? 'border-gray-700 text-gray-300 hover:border-gray-600' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}
              >
                Browse All Tools
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className={`border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield, label: '100% Secure', desc: 'Files processed locally' },
              { icon: Zap, label: 'Lightning Fast', desc: 'Instant processing' },
              { icon: Globe, label: 'Works Everywhere', desc: 'Any device, any browser' },
              { icon: CheckCircle2, label: '100% Free', desc: 'No hidden costs' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-indigo-50'}`}>
                  <item.icon size={20} className="text-indigo-500" />
                </div>
                <div>
                  <p className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{item.label}</p>
                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            All PDF Tools
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Everything you need to work with PDFs, all in one place
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : darkMode
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              className={`group p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${
                darkMode
                  ? 'bg-gray-900 border-gray-800 hover:border-gray-700 hover:shadow-indigo-500/5'
                  : 'bg-white border-gray-200 hover:border-indigo-200 hover:shadow-indigo-500/10'
              }`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                {tool.icon}
              </div>
              <h3 className={`font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {tool.name}
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {tool.description}
              </p>
              <div className="flex items-center gap-1 mt-3 text-indigo-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Open tool</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className={`border-t ${darkMode ? 'border-gray-800 bg-gray-900/50' : 'border-gray-100 bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              How It Works
            </h2>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Three simple steps to process your PDFs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '1', title: 'Upload Your File', desc: 'Drag & drop or click to upload your PDF or other files', icon: '📤' },
              { step: '2', title: 'Choose Your Tool', desc: 'Select from 15+ powerful PDF tools to process your files', icon: '🛠️' },
              { step: '3', title: 'Download Result', desc: 'Get your processed file instantly, ready to use', icon: '✅' },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl ${darkMode ? 'bg-gray-800' : 'bg-white shadow-lg'}`}>
                  {item.icon}
                </div>
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white text-sm font-bold mb-3`}>
                  {item.step}
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{item.title}</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h2 className={`text-3xl font-bold text-center mb-12 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {[
            { q: 'Is PDFNova completely free?', a: 'Yes! All our PDF tools are 100% free to use with no hidden costs, no registration required, and no file limits.' },
            { q: 'Are my files secure?', a: 'Absolutely. All file processing happens directly in your browser. Your files never leave your device and are never uploaded to any server.' },
            { q: 'What file formats are supported?', a: 'We support PDF, JPG, PNG, and other common image formats. Our tools can convert between these formats and create PDFs from images.' },
            { q: 'Do I need to install any software?', a: 'No installation needed! PDFNova works entirely in your web browser on any device — desktop, tablet, or mobile.' },
            { q: 'Is there a file size limit?', a: 'Since processing happens in your browser, the limit depends on your device\'s memory. Most files up to 100MB work perfectly.' },
          ].map((faq, i) => (
            <details key={i} className={`group rounded-xl border p-5 ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
              <summary className={`font-semibold cursor-pointer list-none flex items-center justify-between ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                {faq.q}
                <span className="text-indigo-500 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className={`mt-3 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Ready to get started?
          </h2>
          <p className={`text-lg mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Join thousands of users who trust PDFNova for their PDF needs
          </p>
          <Link
            to="/tools/merge-pdf"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-105 transition-all"
          >
            Start Using PDF Tools
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}

import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import PDFReader from './pages/PDFReader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('pdfnova-dark') === 'true';
  });

  const toggleDarkMode = () => {
    setDarkMode((d: boolean) => {
      localStorage.setItem('pdfnova-dark', String(!d));
      return !d;
    });
  };

  return (
    <BrowserRouter>
      <div className={darkMode ? 'dark' : ''}>
        <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-950 text-white' : 'bg-white text-gray-900'}`}>
          <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home darkMode={darkMode} />} />
              <Route path="/reader" element={<PDFReader darkMode={darkMode} />} />
              <Route path="/tools/:toolId" element={<ToolPage darkMode={darkMode} />} />
            </Routes>
          </main>
          <Footer darkMode={darkMode} />
        </div>
      </div>
    </BrowserRouter>
  );
}

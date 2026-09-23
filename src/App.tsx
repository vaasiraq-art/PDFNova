import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import PDFReader from './pages/PDFReader';
import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <BrowserRouter>
      <div>
        {/* Sidebar */}
        <Sidebar />

        {/* Content */}
        <div id="content">
          <div className="inner">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/reader" element={<PDFReader />} />
              <Route path="/tools/:toolId" element={<ToolPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}

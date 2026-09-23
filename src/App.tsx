import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ToolPage from './pages/ToolPage';
import PDFReader from './pages/PDFReader';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/reader" element={<PDFReader />} />
        <Route path="/tools/:toolId" element={<ToolPage />} />
      </Routes>
    </BrowserRouter>
  );
}

import {
  ZoomIn,
  ZoomOut,
  Moon,
  Sun,
  BookmarkPlus,
  PanelLeft,
  Search,
  X,
  FileText,
  Bot,
  FlipHorizontal,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Bookmark } from '../types';

interface ToolbarProps {
  currentPage: number;
  numPages: number;
  scale: number;
  darkMode: boolean;
  bookmarks: Bookmark[];
  showSearch: boolean;
  searchQuery: string;
  aiPanelOpen: boolean;
  flipEnabled: boolean;
  soundEnabled: boolean;
  onPageChange: (page: number) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onToggleDarkMode: () => void;
  onToggleSidebar: () => void;
  onToggleAI: () => void;
  onToggleFlip: () => void;
  onToggleSound: () => void;
  onAddBookmark: () => void;
  onReset: () => void;
  onToggleSearch: () => void;
  onSearchChange: (query: string) => void;
  fileName: string;
}

export default function Toolbar({
  currentPage,
  numPages,
  scale,
  darkMode,
  bookmarks,
  showSearch,
  searchQuery,
  aiPanelOpen,
  flipEnabled,
  soundEnabled,
  onPageChange,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onToggleDarkMode,
  onToggleSidebar,
  onToggleAI,
  onToggleFlip,
  onToggleSound,
  onAddBookmark,
  onReset,
  onToggleSearch,
  onSearchChange,
  fileName,
}: ToolbarProps) {
  const isBookmarked = bookmarks.some(b => b.page === currentPage);

  return (
    <div className={`flex flex-col border-b ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm`}>
      {/* Main toolbar */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            title="Toggle sidebar"
          >
            <PanelLeft size={18} />
          </button>

          <button
            onClick={onReset}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'}`}
            title="Open new file"
          >
            <FileText size={16} />
            <span className="hidden md:inline truncate max-w-[150px]">{fileName}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Page navigation */}
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <input
              type="number"
              min={1}
              max={numPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= numPages) {
                  onPageChange(page);
                }
              }}
              className={`w-12 text-center text-sm bg-transparent border-none outline-none ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}
            />
            <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              / {numPages}
            </span>
          </div>

          {/* Zoom controls */}
          <div className={`flex items-center gap-0.5 ml-2 px-1 py-1 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <button
              onClick={onZoomOut}
              className={`p-1.5 rounded transition-all ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
            <button
              onClick={onResetZoom}
              className={`px-2 py-1 text-xs rounded transition-all ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
              title="Reset zoom"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              onClick={onZoomIn}
              className={`p-1.5 rounded transition-all ${darkMode ? 'hover:bg-gray-600 text-gray-300' : 'hover:bg-gray-200 text-gray-600'}`}
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {/* Bookmark */}
          <button
            onClick={onAddBookmark}
            className={`p-2 rounded-lg transition-all ml-1 ${
              isBookmarked
                ? 'text-yellow-500 hover:bg-yellow-500/10'
                : darkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <BookmarkPlus size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          {/* Search */}
          <button
            onClick={onToggleSearch}
            className={`p-2 rounded-lg transition-all ${
              showSearch
                ? 'text-indigo-500 bg-indigo-500/10'
                : darkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="Search"
          >
            <Search size={18} />
          </button>

          {/* AI Assistant */}
          <button
            onClick={onToggleAI}
            className={`p-2 rounded-lg transition-all ${
              aiPanelOpen
                ? 'text-purple-500 bg-purple-500/10'
                : darkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title="AI Assistant"
          >
            <Bot size={18} />
          </button>

          {/* Page Flip Animation */}
          <button
            onClick={onToggleFlip}
            className={`p-2 rounded-lg transition-all ${
              flipEnabled
                ? 'text-emerald-500 bg-emerald-500/10'
                : darkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={flipEnabled ? 'Disable page flip animation' : 'Enable page flip animation'}
          >
            <FlipHorizontal size={18} />
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg transition-all ${
              soundEnabled
                ? 'text-blue-500 bg-blue-500/10'
                : darkMode
                ? 'hover:bg-gray-700 text-gray-300'
                : 'hover:bg-gray-100 text-gray-600'
            }`}
            title={soundEnabled ? 'Mute page flip sound' : 'Enable page flip sound'}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Dark mode */}
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-100 text-gray-600'}`}
            title="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>

      {/* Search bar */}
      {showSearch && (
        <div className={`flex items-center gap-2 px-4 py-2 border-t ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
          <Search size={16} className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search in document..."
            className={`flex-1 bg-transparent border-none outline-none text-sm ${darkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'}`}
            autoFocus
          />
          <button
            onClick={onToggleSearch}
            className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Progress bar */}
      {numPages > 0 && (
        <div className="h-0.5 bg-gray-200 dark:bg-gray-700">
          <div
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${(currentPage / numPages) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}

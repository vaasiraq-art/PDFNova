import { Bookmark, X, BookOpen, Trash2, ChevronRight } from 'lucide-react';

interface SidebarProps {
  bookmarks: { id: string; page: number; label: string; createdAt: string }[];
  currentPage: number;
  numPages: number;
  darkMode: boolean;
  onGoToPage: (page: number) => void;
  onRemoveBookmark: (id: string) => void;
  onClose: () => void;
}

export default function Sidebar({
  bookmarks,
  currentPage,
  numPages,
  darkMode,
  onGoToPage,
  onRemoveBookmark,
  onClose,
}: SidebarProps) {
  const sortedBookmarks = [...bookmarks].sort((a, b) => a.page - b.page);

  // Generate quick jump pages
  const quickPages = Array.from({ length: Math.min(10, numPages) }, (_, i) => {
    const step = Math.max(1, Math.floor(numPages / 10));
    return Math.min(i * step + 1, numPages);
  });

  return (
    <div className={`w-72 border-r flex flex-col ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-lg`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <h2 className={`font-semibold flex items-center gap-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          <BookOpen size={18} />
          Navigation
        </h2>
        <button
          onClick={onClose}
          className={`p-1.5 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Current page info */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className={`text-xs uppercase tracking-wider mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Reading Progress
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Page {currentPage} of {numPages}
            </span>
            <span className={`text-sm font-medium ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
              {Math.round((currentPage / numPages) * 100)}%
            </span>
          </div>
          <div className={`h-2 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${(currentPage / numPages) * 100}%` }}
            />
          </div>
        </div>

        {/* Quick Jump */}
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
          <div className={`text-xs uppercase tracking-wider mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Quick Jump
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {quickPages.map((page) => (
              <button
                key={page}
                onClick={() => onGoToPage(page)}
                className={`py-1.5 px-1 text-xs rounded-lg transition-all ${
                  page === currentPage
                    ? 'bg-indigo-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        {/* Bookmarks */}
        <div className="p-4">
          <div className={`text-xs uppercase tracking-wider mb-3 flex items-center gap-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <Bookmark size={12} />
            Bookmarks ({sortedBookmarks.length})
          </div>

          {sortedBookmarks.length === 0 ? (
            <p className={`text-sm italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              No bookmarks yet. Click the bookmark icon in the toolbar to save pages.
            </p>
          ) : (
            <div className="space-y-1">
              {sortedBookmarks.map((bookmark) => (
                <div
                  key={bookmark.id}
                  className={`flex items-center justify-between p-2.5 rounded-lg transition-all cursor-pointer group ${
                    bookmark.page === currentPage
                      ? darkMode
                        ? 'bg-indigo-900/30 border border-indigo-700'
                        : 'bg-indigo-50 border border-indigo-200'
                      : darkMode
                      ? 'hover:bg-gray-700'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onGoToPage(bookmark.page)}
                >
                  <div className="flex items-center gap-2">
                    <Bookmark
                      size={14}
                      className={darkMode ? 'text-yellow-400' : 'text-yellow-500'}
                      fill="currentColor"
                    />
                    <div>
                      <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {bookmark.label}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(bookmark.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight size={14} className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveBookmark(bookmark.id);
                      }}
                      className={`p-1 rounded ${darkMode ? 'hover:bg-gray-600 text-gray-400' : 'hover:bg-gray-200 text-gray-500'}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

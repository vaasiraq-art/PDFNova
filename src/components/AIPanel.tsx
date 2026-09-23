import { useState, useEffect, useRef, useCallback } from 'react';
import { getDocument } from 'pdfjs-dist';
import {
  Bot,
  Send,
  Sparkles,
  Trash2,
  Key,
  X,
  Loader2,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface AIPanelProps {
  file: File;
  currentPage: number;
  numPages: number;
  darkMode: boolean;
  onClose: () => void;
}

export default function AIPanel({ file, currentPage, numPages, darkMode, onClose }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [extractedText, setExtractedText] = useState<Record<number, string>>({});
  const [isExtracting, setIsExtracting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('pdf-reader-openai-key');
    if (savedKey) setApiKey(savedKey);
    const savedMessages = localStorage.getItem('pdf-reader-ai-messages');
    if (savedMessages) setMessages(JSON.parse(savedMessages));
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('pdf-reader-ai-messages', JSON.stringify(messages.slice(-50)));
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Extract text from PDF pages
  const extractPageText = useCallback(async (pageNum: number): Promise<string> => {
    if (extractedText[pageNum]) return extractedText[pageNum];

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const text = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      
      setExtractedText(prev => ({ ...prev, [pageNum]: text }));
      return text;
    } catch (err) {
      console.error('Error extracting text:', err);
      return '';
    }
  }, [file, extractedText]);

  // Extract text from multiple pages for context
  const extractContext = useCallback(async (centerPage: number, range: number = 2): Promise<string> => {
    setIsExtracting(true);
    const startPage = Math.max(1, centerPage - range);
    const endPage = Math.min(numPages, centerPage + range);
    
    let fullText = '';
    for (let i = startPage; i <= endPage; i++) {
      const text = await extractPageText(i);
      if (text) {
        fullText += `\n--- Page ${i} ---\n${text}`;
      }
    }
    setIsExtracting(false);
    return fullText;
  }, [numPages, extractPageText]);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('pdf-reader-openai-key', key);
    setShowApiKeyInput(false);
  };

  const callOpenAI = async (context: string, userMessage: string): Promise<string> => {
    if (!apiKey) {
      return generateLocalResponse(context, userMessage);
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `You are an AI reading assistant helping a user understand their PDF book. 
              You have access to the book's text content. Answer questions accurately based on the content.
              Be concise, helpful, and educational. If the content doesn't contain the answer, say so honestly.
              Format responses with markdown for readability.`
            },
            {
              role: 'user',
              content: `Here is the relevant content from the book (around page ${currentPage}):\n\n${context}\n\nUser question: ${userMessage}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'API request failed');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (err: any) {
      console.error('OpenAI API error:', err);
      return `I couldn't reach the AI service. ${err.message}\n\nFalling back to local analysis...\n\n${generateLocalResponse(context, userMessage)}`;
    }
  };

  const generateLocalResponse = (context: string, userMessage: string): string => {
    const lowerMsg = userMessage.toLowerCase();
    const words = context.split(/\s+/);
    const wordCount = words.length;

    // Summary request
    if (lowerMsg.includes('summar') || lowerMsg.includes('what is this about') || lowerMsg.includes('overview')) {
      const sentences = context.split(/[.!?]+/).filter(s => s.trim().length > 20);
      const keySentences = sentences.slice(0, Math.min(5, sentences.length));
      return `📖 **Summary of nearby pages:**\n\n${keySentences.map(s => `• ${s.trim()}`).join('\n')}\n\n*Total text analyzed: ~${wordCount} words*`;
    }

    // Key points
    if (lowerMsg.includes('key point') || lowerMsg.includes('main idea') || lowerMsg.includes('important')) {
      const sentences = context.split(/[.!?]+/).filter(s => s.trim().length > 30);
      // Find sentences with important-sounding words
      const importantWords = ['important', 'key', 'main', 'essential', 'critical', 'fundamental', 'significant', 'conclusion', 'therefore', 'thus', 'result'];
      const keySentences = sentences.filter(s => 
        importantWords.some(w => s.toLowerCase().includes(w))
      ).slice(0, 5);
      
      if (keySentences.length > 0) {
        return `🔑 **Key Points Found:**\n\n${keySentences.map((s, i) => `${i + 1}. ${s.trim()}`).join('\n\n')}`;
      }
      return `📝 **Top Sentences from this section:**\n\n${sentences.slice(0, 5).map((s, i) => `${i + 1}. ${s.trim()}`).join('\n\n')}`;
    }

    // Vocabulary/Definitions
    if (lowerMsg.includes('define') || lowerMsg.includes('vocabulary') || lowerMsg.includes('meaning')) {
      const uniqueWords = [...new Set(words.map(w => w.toLowerCase().replace(/[^a-z]/g, '')))].filter(w => w.length > 6);
      return `📚 **Notable terms in this section:**\n\n${uniqueWords.slice(0, 15).map(w => `• **${w}**`).join('\n')}\n\n*Tip: Add your OpenAI API key for detailed definitions and explanations.*`;
    }

    // Word count / stats
    if (lowerMsg.includes('how many') || lowerMsg.includes('word count') || lowerMsg.includes('statistics')) {
      const sentences = context.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const paragraphs = context.split(/\n\n+/).filter(p => p.trim().length > 0);
      return `📊 **Text Statistics:**\n\n• Words: ~${wordCount}\n• Sentences: ~${sentences.length}\n• Paragraphs: ~${paragraphs.length}\n• Average words per sentence: ~${Math.round(wordCount / Math.max(sentences.length, 1))}\n• Pages analyzed: nearby pages around page ${currentPage}`;
    }

    // Questions about content
    if (lowerMsg.includes('what') || lowerMsg.includes('who') || lowerMsg.includes('when') || lowerMsg.includes('where') || lowerMsg.includes('how') || lowerMsg.includes('why')) {
      const sentences = context.split(/[.!?]+/).filter(s => s.trim().length > 20);
      const queryWords = lowerMsg.split(/\s+/).filter(w => w.length > 3);
      
      // Simple relevance scoring
      const scored = sentences.map(s => {
        const sLower = s.toLowerCase();
        const score = queryWords.filter(w => sLower.includes(w)).length;
        return { sentence: s.trim(), score };
      }).sort((a, b) => b.score - a.score);

      const relevant = scored.filter(s => s.score > 0).slice(0, 3);
      
      if (relevant.length > 0) {
        return `🔍 **Relevant passages found:**\n\n${relevant.map((r, i) => `${i + 1}. "${r.sentence}"`).join('\n\n')}\n\n*💡 For more accurate AI answers, add your OpenAI API key in settings.*`;
      }
      return `I found ${wordCount} words across the nearby pages, but couldn't find a direct match for your question. Try rephrasing or add your OpenAI API key for smarter answers.`;
    }

    // Default - show content preview
    const preview = context.substring(0, 500);
    return `📄 **Content from nearby pages:**\n\n"${preview}${context.length > 500 ? '...' : ''}"\n\n---\n*Ask me to summarize, find key points, or analyze this content. For AI-powered answers, add your OpenAI API key.*`;
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const context = await extractContext(currentPage, 2);
      const response = await callOpenAI(context, userMessage.content);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${err.message}`,
        timestamp: Date.now(),
      }]);
    }

    setLoading(false);
  };

  const handleQuickAction = async (action: string) => {
    setInput('');
    setLoading(true);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: action,
      timestamp: Date.now(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const context = await extractContext(currentPage, 2);
      const response = await callOpenAI(context, action);

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }]);
    } catch (err: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${err.message}`,
        timestamp: Date.now(),
      }]);
    }

    setLoading(false);
  };

  const clearChat = () => {
    setMessages([]);
    localStorage.removeItem('pdf-reader-ai-messages');
  };

  const quickActions = [
    { label: '📖 Summarize this section', action: 'Summarize the content around the current page' },
    { label: '🔑 Key points', action: 'What are the key points and main ideas?' },
    { label: '📊 Text statistics', action: 'Give me statistics about the text' },
    { label: '📚 Vocabulary', action: 'List important vocabulary and terms' },
  ];

  return (
    <div className={`w-96 flex flex-col border-l h-full ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <h2 className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              AI Reading Assistant
            </h2>
            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {apiKey ? '🟢 Connected to AI' : '🟡 Local analysis mode'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
            title="API Settings"
          >
            <Key size={16} />
          </button>
          <button
            onClick={clearChat}
            className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
            title="Clear chat"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* API Key Input */}
      {showApiKeyInput && (
        <div className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-100 bg-gray-50'}`}>
          <label className={`text-xs font-medium mb-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            OpenAI API Key (stored locally)
          </label>
          <div className="flex gap-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              className={`flex-1 px-3 py-2 text-sm rounded-lg border ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500' 
                  : 'bg-white border-gray-300 text-gray-700 placeholder-gray-400'
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            <button
              onClick={() => saveApiKey(apiKey)}
              className="px-3 py-2 bg-indigo-500 text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors"
            >
              Save
            </button>
          </div>
          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            🔒 Your key is stored only in your browser. Get one at platform.openai.com
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={`p-4 rounded-2xl mb-4 ${darkMode ? 'bg-gray-700' : 'bg-indigo-50'}`}>
              <Sparkles size={32} className="text-indigo-500" />
            </div>
            <h3 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              AI Reading Assistant
            </h3>
            <p className={`text-sm mb-6 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Ask questions about your book, get summaries, extract key points, and more.
            </p>
            <div className="grid grid-cols-2 gap-2 w-full">
              {quickActions.map((qa, i) => (
                <button
                  key={i}
                  onClick={() => handleQuickAction(qa.action)}
                  className={`p-3 rounded-xl text-xs font-medium transition-all text-left ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200'
                  }`}
                >
                  {qa.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-indigo-500 text-white'
                  : darkMode
                  ? 'bg-gray-700 text-gray-200'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Bot size={12} className="text-indigo-400" />
                  <span className="text-xs font-medium text-indigo-400">AI Assistant</span>
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap leading-relaxed">
                {formatMessage(msg.content)}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className={`rounded-2xl px-4 py-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-indigo-500" />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isExtracting ? 'Extracting text...' : 'Thinking...'}
                </span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className={`flex items-end gap-2 p-2 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask about your book..."
            rows={1}
            className={`flex-1 bg-transparent border-none outline-none resize-none text-sm ${
              darkMode ? 'text-gray-200 placeholder-gray-500' : 'text-gray-700 placeholder-gray-400'
            }`}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`p-2 rounded-lg transition-all ${
              input.trim() && !loading
                ? 'bg-indigo-500 text-white hover:bg-indigo-600'
                : darkMode
                ? 'bg-gray-600 text-gray-500'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send size={16} />
          </button>
        </div>
        <p className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
          Analyzing pages around page {currentPage}
        </p>
      </div>
    </div>
  );
}

function formatMessage(content: string): React.ReactNode {
  // Simple markdown-like formatting
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, ArrowLeft, Sparkles, Plus, Copy, ThumbsUp, ThumbsDown, Share, RefreshCw, MoreHorizontal, X, Link2, MessageCircle, Square } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Syntax highlighting for code blocks
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Memoized Message Component to prevent re-renders
const MessageItem = memo(({ msg, idx, isTyping, onShare }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      key={idx}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        "flex w-full",
        msg.role === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {msg.role === 'user' ? (
        <div className="max-w-[85%] md:max-w-[75%] rounded-2xl rounded-br-md px-4 py-3 bg-[--accent] text-white shadow-sm">
          <p className="text-sm leading-relaxed">{msg.content}</p>
        </div>
      ) : (
        <div className="w-full">
          <div className="prose prose-sm max-w-none break-words leading-loose text-primary">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-4 mt-5 text-primary" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-base font-bold mb-3 mt-4 text-accent" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-3 mt-4 text-primary" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 last:mb-0 text-sm leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-outside ml-5 mb-4 space-y-2 text-sm" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-5 mb-4 space-y-2 text-sm" {...props} />,
                li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-3 border-accent/50 bg-accent/10 pl-4 py-2 italic rounded-r mb-4 text-sm" {...props} />
                ),
                code: ({node, inline, className, children, ...props}) => {
                  const match = /language-(\w+)/.exec(className || '');
                  const language = match ? match[1] : '';
                  const codeString = String(children).replace(/\n$/, '');
                  
                  if (inline) {
                    return (
                      <code className="bg-border-soft text-accent px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                        {children}
                      </code>
                    );
                  }
                  
                  return (
                    <div className="relative my-4 rounded-lg overflow-hidden bg-[#1e1e1e]">
                      <div className="flex items-center justify-between px-4 py-2.5 bg-[#2d2d2d]">
                        <span className="text-xs text-gray-400 font-medium">
                          {language || 'code'}
                        </span>
                        <button 
                          onClick={() => navigator.clipboard.writeText(codeString)}
                          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy code</span>
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={oneDark}
                        language={language || 'text'}
                        PreTag="div"
                        customStyle={{
                          margin: 0,
                          borderRadius: 0,
                          padding: '1rem 1.25rem',
                          fontSize: '0.85rem',
                          lineHeight: '1.6',
                          background: '#1e1e1e',
                        }}
                        codeTagProps={{
                          style: {
                            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                          }
                        }}
                      >
                        {codeString}
                      </SyntaxHighlighter>
                    </div>
                  );
                },
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
          {/* CTA Buttons - Only show when NOT typing */}
          {!isTyping && (
            <div className="flex items-center gap-1 mt-4">
              <button 
                onClick={handleCopy}
                className={clsx(
                  "p-2 rounded-lg transition-colors",
                  copied ? "text-green-500" : "text-secondary hover:text-primary hover:bg-border-soft"
                )}
                title={copied ? "Copied!" : "Copy"}
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <button className="p-2 rounded-lg hover:bg-border-soft transition-colors text-secondary hover:text-primary" title="Good response">
                <ThumbsUp className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-border-soft transition-colors text-secondary hover:text-primary" title="Bad response">
                <ThumbsDown className="w-4 h-4" />
              </button>
              <button 
                onClick={() => onShare(msg.content)}
                className="p-2 rounded-lg hover:bg-border-soft transition-colors text-secondary hover:text-primary" 
                title="Share"
              >
                <Share className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-border-soft transition-colors text-secondary hover:text-primary" title="Regenerate">
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-2 rounded-lg hover:bg-border-soft transition-colors text-secondary hover:text-primary" title="More options">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
});

export default function ChatInterface() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shareModal, setShareModal] = useState({ open: false, content: '' });
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);

  const handleShare = (content) => {
    setShareModal({ open: true, content });
  };

  const closeShareModal = () => {
    setShareModal({ open: false, content: '' });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
  };

  const shareToWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareModal.content + '\n\n' + shareUrl)}`, '_blank');
  };

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareModal.content.slice(0, 200) + '...')}&url=${encodeURIComponent(shareUrl)}`, '_blank');
  };

  const shareToTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareModal.content.slice(0, 200))}`, '_blank');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mobile keyboard scroll handling - like ChatGPT
  useEffect(() => {
    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewport = window.visualViewport;
        // If viewport height is less than window height, keyboard is open
        if (viewport.height < window.innerHeight * 0.9) {
          // Scroll to bottom after a small delay to let layout settle
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
          }, 100);
        }
      }
    };

    const handleInputFocus = () => {
      // Small delay to let keyboard appear
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 300);
    };

    // Listen for visual viewport changes (keyboard appearing/disappearing)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }

    // Listen for input focus
    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleInputFocus);
    }

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
      if (input) {
        input.removeEventListener('focus', handleInputFocus);
      }
    };
  }, []);

  // Global keydown to focus input - only for regular typing
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Skip if already in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      
      // Skip if any modifier key is held (for shortcuts like Cmd+C, Cmd+V)
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      
      // Only focus on single printable characters (letters, numbers, symbols)
      // This ensures shortcuts don't trigger focus
      if (e.key.length === 1 && !e.repeat) {
        inputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/v1/ai/chat/${topicId}`, {
          credentials: 'include',
        });
        const data = await response.json();
        
        if (data.success && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [topicId]);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsTyping(false);
  };

  // Send message function
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    // If a request is already active, abort it
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const userMsg = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Create new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/v1/ai/chat`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                topicId,
                message: messageText,
                history: messages.slice(-10)
            }),
            signal: controller.signal
        });

        if (!response.ok) throw new Error("Network error");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let assistantMsg = { role: 'assistant', content: '' };
        
        setMessages(prev => [...prev, assistantMsg]);

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            const lines = chunk.split('\n\n');
            
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.replace('data: ', '');
                    if (dataStr === '[DONE]') break;
                    try {
                        const data = JSON.parse(dataStr);
                        if(data.text) {
                            assistantMsg.content += data.text;
                            setMessages(prev => {
                                const newMsgs = [...prev];
                                newMsgs[newMsgs.length - 1] = { ...assistantMsg };
                                return newMsgs;
                            });
                        }
                    } catch (e) {}
                }
            }
        }

    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request aborted');
        } else {
            setMessages(prev => [...prev, { role: 'assistant', content: "Connection failed. Please try again." }]);
        }
    } finally {
        // Only turn off typing if THIS request is the current active one
        // This prevents turning off typing when a new request has already started
        if (abortControllerRef.current === controller) {
            setIsTyping(false);
            abortControllerRef.current = null;
        }
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleQuickAction = (action) => {
    sendMessage(action);
  };

  const isEmptyState = messages.length === 0 && !isLoading;

  return (
    <div className="fixed inset-0 flex flex-col bg-main">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur-xl border-b border-border-soft">
            <div className="flex items-center gap-3">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-border-soft rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-secondary" />
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-sm">
                        <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-primary font-semibold">Crix</span>
                </div>
            </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto overscroll-none">
          {isEmptyState ? (
            <div className="flex flex-col items-center justify-center h-full px-4">
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-6 shadow-lg shadow-accent/20">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-semibold text-primary text-center mb-2">
                What can I help with?
              </h1>
              <p className="text-secondary text-sm">Ask me anything about this topic</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto p-4 space-y-6 pb-4">
              {messages.map((msg, idx) => (
                <MessageItem key={idx} msg={msg} idx={idx} isTyping={isTyping} onShare={handleShare} />
              ))}
              {isTyping && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                       <div className="flex items-center gap-2">
                           <div className="flex gap-1">
                               <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                               <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                               <span className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"></span>
                           </div>
                       </div>
                   </motion.div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-card/80 backdrop-blur-xl border-t border-border-soft p-4">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSend}>
                  <div className="flex items-center gap-2 bg-main rounded-full px-3 py-2 border border-border-soft focus-within:border-accent/50 transition-all">
                      <button 
                          type="button" 
                          className="p-2 hover:bg-border-soft rounded-full transition-colors text-secondary hover:text-primary"
                          title="Attach file"
                      >
                          <Plus className="w-5 h-5" />
                      </button>
                      <input
                          ref={inputRef}
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Ask anything..."
                          className="flex-1 bg-transparent text-primary placeholder:text-secondary py-2 focus:outline-none text-sm font-medium"
                      />
                      <button 
                          type={isTyping ? "button" : "submit"}
                          onClick={isTyping ? handleStop : undefined}
                          disabled={!isTyping && !input.trim()}
                          className={clsx(
                              "p-2.5 rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 transition-all",
                              isTyping 
                                  ? "bg-red-500 text-white" 
                                  : "bg-accent text-white disabled:opacity-40 disabled:pointer-events-none"
                          )}
                          title={isTyping ? "Stop generating" : "Send message"}
                      >
                          {isTyping ? (
                              <Square className="w-3.5 h-3.5 fill-current" />
                          ) : (
                              <Send className="w-4 h-4" />
                          )}
                      </button>
                  </div>
              </form>
              
              {/* Quick Actions */}
              <div className="flex justify-center gap-2 mt-3 flex-wrap">
                  {['Summarize', 'Give me 5 MCQs', 'Explain simpler'].map(quickAction => (
                      <button 
                          key={quickAction}
                          onClick={() => handleQuickAction(quickAction)}
                          disabled={isTyping}
                          className="whitespace-nowrap px-3 py-1.5 rounded-full bg-card border border-border-soft text-xs text-secondary font-medium hover:bg-main hover:text-primary hover:border-accent/30 transition-all disabled:opacity-50"
                      >
                          {quickAction}
                      </button>
                  ))}
              </div>
            </div>
        </div>

        {/* Share Modal */}
        {shareModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Blur backdrop */}
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={closeShareModal}
            />
            
            {/* Modal content */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-card rounded-2xl p-6 w-[90%] max-w-md shadow-2xl border border-border-soft"
            >
              {/* Close button */}
              <button 
                onClick={closeShareModal}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-border-soft transition-colors"
              >
                <X className="w-5 h-5 text-secondary" />
              </button>

              <h3 className="text-lg font-semibold text-primary mb-4">Share</h3>

              {/* Link copy section */}
              <div className="mb-6">
                <p className="text-xs text-secondary mb-2">Copy link</p>
                <div className="flex items-center gap-2 bg-main rounded-xl p-3 border border-border-soft">
                  <Link2 className="w-4 h-4 text-secondary flex-shrink-0" />
                  <span className="text-sm text-primary truncate flex-1">{shareUrl}</span>
                  <button 
                    onClick={copyLink}
                    className="px-3 py-1.5 bg-accent text-white text-xs font-medium rounded-lg hover:opacity-90 transition-all"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Social share buttons */}
              <p className="text-xs text-secondary mb-3">Share to</p>
              <div className="grid grid-cols-3 gap-3">
                {/* WhatsApp */}
                <button 
                  onClick={shareToWhatsApp}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-main border border-border-soft hover:border-green-500/50 hover:bg-green-500/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-primary font-medium">WhatsApp</span>
                </button>

                {/* Twitter/X */}
                <button 
                  onClick={shareToTwitter}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-main border border-border-soft hover:border-gray-400/50 hover:bg-gray-400/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-primary font-medium">Twitter</span>
                </button>

                {/* Telegram */}
                <button 
                  onClick={shareToTelegram}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-main border border-border-soft hover:border-blue-500/50 hover:bg-blue-500/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#0088cc] flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                    </svg>
                  </div>
                  <span className="text-xs text-primary font-medium">Telegram</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
    </div>
  );
}

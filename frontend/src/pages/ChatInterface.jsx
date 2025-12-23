import { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import axios from 'axios';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Send, ArrowLeft, Sparkles, Plus, Copy, ThumbsUp, ThumbsDown, Share, RefreshCw, MoreHorizontal, X, Link2, MessageCircle, Square, ArrowDown, Menu, Check, Heart } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

// Syntax highlighting for code blocks
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Memoized Message Component to prevent re-renders
const MessageItem = memo(({ msg, idx, isTyping, onShare, messageRef }) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'like' or 'dislike'

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div 
      ref={messageRef} 
      key={idx}
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut", delay: idx * 0.05 }}
      className={clsx(
        "flex w-full mb-8",
        msg.role === 'user' ? "justify-end" : "justify-start"
      )}
    >
      {msg.role === 'user' ? (
        <div className="max-w-[85%] md:max-w-[75%] rounded-2xl rounded-br-md px-4 py-3 bg-[--accent] text-white shadow-sm">
          <p className="text-sm leading-relaxed">{msg.content}</p>
        </div>
      ) : (
        <div className="w-full group/msg">
          <div className="relative p-6 md:p-8 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-md border border-white/5 shadow-2xl overflow-hidden transition-all duration-500 hover:bg-white/[0.05] hover:border-white/10">
            {/* Subtle Gradient Glow */}
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-accent/10 blur-[100px] rounded-full pointer-events-none" />
            
            <div className="prose prose-sm md:prose-base max-w-none break-words leading-loose text-primary relative z-10">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  h1: ({node, ...props}) => <h1 className="text-xl md:text-2xl font-black mb-8 mt-4 text-primary tracking-tighter" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-lg md:text-xl font-bold mb-6 mt-8 text-accent tracking-tight" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-base font-bold mb-4 mt-6 text-primary tracking-tight" {...props} />,
                  p: ({node, ...props}) => <p className="mb-6 last:mb-0 text-sm md:text-base leading-[1.8] text-secondary/90 font-medium" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 mb-6 space-y-4 text-sm md:text-base text-secondary/90" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-6 mb-6 space-y-4 text-sm md:text-base text-secondary/90" {...props} />,
                  li: ({node, ...props}) => <li className="leading-relaxed pl-2 hover:text-primary transition-colors" {...props} />,
                  hr: ({node, ...props}) => (
                    <div className="my-12 px-10">
                      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    </div>
                  ),
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-accent/40 bg-accent/5 pl-6 py-5 italic rounded-r-2xl mb-8 text-sm md:text-base text-secondary/80 border-y border-r border-dashed border-accent/10" {...props} />
                  ),
                  code: ({node, inline, className, children, ...props}) => {
                    const match = /language-(\w+)/.exec(className || '');
                    const language = match ? match[1] : '';
                    const codeString = String(children).replace(/\n$/, '');
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    const [localCopied, setLocalCopied] = useState(false);
                    
                    if (inline) {
                      return (
                        <code className="bg-white/10 text-accent px-1.5 py-0.5 rounded-md text-xs font-mono font-bold" {...props}>
                          {children}
                        </code>
                      );
                    }
                    
                    return (
                      <div className="relative my-8 rounded-2xl overflow-hidden bg-[#0d1117] border border-white/5 shadow-2xl group/code scale-[1.02] -mx-2 md:mx-0">
                        {/* Apple Style Window Header */}
                        <div className="flex items-center justify-between px-5 py-4 bg-[#161b22] border-b border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-black/10 shadow-inner" />
                              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-black/10 shadow-inner" />
                              <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-black/10 shadow-inner" />
                            </div>
                            <span className="ml-3 text-[10px] text-secondary/50 font-mono uppercase tracking-[0.2em] font-black">
                              {language || 'code'}
                            </span>
                          </div>
                          
                          <div className="relative">
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(codeString);
                                setLocalCopied(true);
                                setTimeout(() => setLocalCopied(false), 2000);
                              }}
                              className={clsx(
                                "p-2 rounded-lg border transition-all duration-300 group/copy",
                                localCopied 
                                  ? "text-red-500 bg-red-500/10 border-red-500/20 scale-110" 
                                  : "text-secondary/60 hover:text-white bg-white/5 border-white/5 hover:border-white/10"
                              )}
                              title="Copy Code"
                            >
                              <div className="relative w-4 h-4 flex items-center justify-center">
                                {localCopied ? (
                                  <motion.div
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="flex items-center justify-center"
                                  >
                                    <Check className="w-4 h-4 text-red-500" />
                                    <Sparkles className="w-3 h-3 text-red-500 absolute -top-1 -right-1" />
                                  </motion.div>
                                ) : (
                                  <Copy className="w-4 h-4 transition-transform group-hover/copy:scale-110" />
                                )}
                              </div>
                            </button>
                          </div>
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={language || 'text'}
                          PreTag="div"
                          customStyle={{
                            margin: 0,
                            borderRadius: 0,
                            padding: '1.5rem',
                            fontSize: '0.9rem',
                            lineHeight: '1.8',
                            background: 'transparent',
                          }}
                          codeTagProps={{
                            style: {
                              fontFamily: '"JetBrains Mono", "SF Mono", "Fira Code", ui-monospace, monospace',
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
          </div>
          
          {/* CTA Buttons - Only show when NOT typing */}
          {!isTyping && (
            <div className="flex items-center gap-2 mt-3 ml-4 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-300">
              {[
                { icon: Copy, onClick: handleCopy, active: copied, title: "Copy Answer" },
                { 
                  icon: ThumbsUp, 
                  onClick: () => setFeedback(prev => prev === 'like' ? null : 'like'), 
                  active: feedback === 'like',
                  activeClass: "text-green-400 bg-green-400/10 shadow-[0_0_15px_rgba(74,222,128,0.2)]",
                  title: "Helpful" 
                },
                { 
                  icon: ThumbsDown, 
                  onClick: () => setFeedback(prev => prev === 'dislike' ? null : 'dislike'), 
                  active: feedback === 'dislike',
                  activeClass: "text-red-400 bg-red-400/10 shadow-[0_0_15px_rgba(248,113,113,0.2)]",
                  title: "Not Helpful" 
                },
                { icon: Share, onClick: () => onShare(msg.content), title: "Share" },
                { icon: RefreshCw, title: "Regenerate" }
              ].map((btn, i) => (
                <button 
                  key={i}
                  onClick={btn.onClick}
                  className={clsx(
                    "p-2 rounded-xl transition-all duration-300 transform active:scale-90",
                    btn.active ? (btn.activeClass || "text-accent bg-accent/10") : "text-secondary hover:text-primary hover:bg-white/5"
                  )}
                  title={btn.title}
                >
                  <motion.div
                    animate={btn.active ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    <btn.icon className={clsx("w-3.5 h-3.5", btn.active && "fill-current")} />
                  </motion.div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
});

// Sidebar Component with Accordion
const ChapterSidebar = memo(({ chapters, activeChapterId, activeTopicId, isLoading, onTopicSelect }) => {
    const [expandedChId, setExpandedChId] = useState(activeChapterId);

    useEffect(() => {
        if (activeChapterId) {
            setExpandedChId(activeChapterId);
        }
    }, [activeChapterId]);

    const handleChapterClick = (chId) => {
        setExpandedChId(prev => prev === chId ? null : chId);
    };

    return (
        <div className="flex flex-col h-full bg-card border-r border-border-soft relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-red-500/5 blur-[100px] pointer-events-none" />
            
            {/* Branding */}
            <Link to="/dashboard" className="flex items-center gap-3 p-6 border-b border-border-soft/50 hover:bg-white/5 transition-all duration-300 relative z-10">
                <div className="w-9 h-9 rounded-xl bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/20 border border-white/10">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-primary tracking-tight">Crix</h2>
                    <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest opacity-70">Neural Engine</p>
                </div>
            </Link>

            {/* Chapters List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar relative z-10">
                {isLoading ? (
                    [1,2,3,4].map(i => (
                        <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                    ))
                ) : (
                    chapters.map((ch) => {
                        const isExpanded = expandedChId === ch._id;
                        const isActiveChapter = activeChapterId === ch._id;

                        return (
                            <div key={ch._id} className="flex flex-col space-y-2">
                                <button
                                    onClick={() => handleChapterClick(ch._id)}
                                    className={clsx(
                                        "w-full text-left p-5 rounded-[1.8rem] transition-all duration-500 group relative border",
                                        isActiveChapter
                                          ? "bg-accent/10 border-accent/30 shadow-[0_5px_15px_rgba(0,122,255,0.1)]"
                                          : "bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col gap-1.5">
                                            <span className={clsx(
                                                "text-[9px] uppercase tracking-[0.2em] font-black transition-colors line-clamp-1",
                                                isActiveChapter ? "text-accent" : "text-secondary/50 group-hover:text-secondary"
                                            )}>
                                                {ch.unitTitle || 'Chapter'}
                                            </span>
                                            <span className={clsx(
                                                "text-sm font-bold line-clamp-1 leading-tight transition-colors",
                                                isActiveChapter ? "text-white" : "text-secondary group-hover:text-primary"
                                            )}>
                                                {ch.title}
                                            </span>
                                        </div>
                                    </div>
                                    {isActiveChapter && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-accent rounded-r-full shadow-[0_0_15px_rgba(0,122,255,0.8)]" />
                                    )}
                                </button>

                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0, y: -10 }}
                                            animate={{ height: "auto", opacity: 1, y: 0 }}
                                            exit={{ height: 0, opacity: 0, y: -10 }}
                                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pl-6 pr-2 py-2 space-y-2 border-l border-accent/20 ml-6 my-2">
                                                {ch.topics && ch.topics.length > 0 ? (
                                                    ch.topics.map((topic) => {
                                                        const isTopicActive = topic._id === activeTopicId;
                                                        return (
                                                            <button
                                                                key={topic._id}
                                                                onClick={() => onTopicSelect(ch._id, topic._id)}
                                                                className={clsx(
                                                                    "w-full text-left py-3 px-4 rounded-2xl text-xs transition-all flex items-center gap-3 group/topic",
                                                                    isTopicActive
                                                                        ? "bg-accent text-white font-bold shadow-lg shadow-accent/20"
                                                                        : "text-secondary hover:text-primary hover:bg-white/5"
                                                                )}
                                                            >
                                                                <span className={clsx(
                                                                    "w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors shadow-sm",
                                                                    isTopicActive ? "bg-white scale-125" : "bg-white/20 group-hover/topic:bg-white/40"
                                                                )} />
                                                                <span className="line-clamp-1">{topic.title}</span>
                                                            </button>
                                                        )
                                                    })
                                                ) : (
                                                    <div className="text-[10px] text-secondary/30 uppercase tracking-widest italic px-4 py-3">Void</div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )
                    })
                )}
            </div>
        </div>
    );
});

export default function ChatInterface() {
  const { subjectId, chapterId, topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chapters, setChapters] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoadingChapters, setIsLoadingChapters] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [subjectName, setSubjectName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [shareModal, setShareModal] = useState({ open: false, content: '' });
  const messagesEndRef = useRef(null);
  const latestUserMsgRef = useRef(null);
  const inputRef = useRef(null);
  const inputContainerRef = useRef(null);
  const chatAreaRef = useRef(null);
  const abortControllerRef = useRef(null);

  // Derive active topic for header
  const activeTopic = useMemo(() => {
      if (!chapters.length || !topicId) return null;
      for (const ch of chapters) {
          const found = ch.topics?.find(t => t._id === topicId);
          if (found) return found;
      }
      return null;
  }, [chapters, topicId]);

  // Session Tracking - Save to localStorage for "Continue Learning"
  useEffect(() => {
    if (activeTopic && subjectId && chapterId && topicId && subjectName) {
        const activeChapter = chapters.find(ch => ch._id === chapterId);
        const session = {
            subjectId,
            chapterId,
            topicId,
            topicTitle: activeTopic.title,
            subjectName: subjectName,
            unitTitle: activeChapter?.unitTitle || "Unit",
            timestamp: Date.now()
        };
        localStorage.setItem('crix_last_session', JSON.stringify(session));
        console.log("Session saved:", session);
    }
  }, [activeTopic, subjectId, chapterId, topicId, subjectName, chapters]);

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
    if (!isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  // Scroll to user message when sent (to top of viewport)
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!isLoading && lastMsg?.role === 'user') {
      // Small timeout to ensure DOM update
      setTimeout(() => {
        latestUserMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [messages, isLoading]);

  // Auto-scroll when AI finishes typing
  useEffect(() => {
    if (!isTyping && messages.length > 0) {
      // AI just finished typing, scroll to show complete answer
      const timer = setTimeout(() => {
        scrollToBottom();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  // Scroll handler to toggle button visibility
  useEffect(() => {
    const chatArea = chatAreaRef.current;
    if (!chatArea) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatArea;
      // Show button if user is scrolled up more than 100px from bottom
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    };

    chatArea.addEventListener('scroll', handleScroll);
    return () => chatArea.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile keyboard scroll handling - like ChatGPT (instant scroll)
  useEffect(() => {
    let scrollTimeoutId = null;

    const scrollToInput = () => {
      // Clear any pending scroll
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);

      // Scroll the chat area to bottom so input is visible
      if (chatAreaRef.current) {
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      }
      // Also use scrollIntoView on messages end
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
    };

    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewport = window.visualViewport;
        const heightDiff = window.innerHeight - viewport.height;
        // If keyboard is open (height difference > 100px)
        if (heightDiff > 100) {
          scrollToInput();
        }
      }
    };

    const handleInputFocus = () => {
      // Immediate scroll
      // scrollToInput();
      // Single backup scroll after keyboard opens
      scrollTimeoutId = setTimeout(scrollToInput, 300);
    };

    // Listen for visual viewport changes
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }

    // Listen for input focus
    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleInputFocus);
    }

    return () => {
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
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

  // Fetch chapters for sidebar
  useEffect(() => {
    const fetchChapters = async () => {
      if (!subjectId) {
        console.warn("Sidebar: No subjectId found");
        return;
      }
      try {
        console.log("Sidebar: Fetching chapters for", subjectId);
        // Corrected URL to match ChapterView behavior
        const response = await axios.get(`/syllabus/${subjectId}`);
        console.log("Sidebar: Response", response.data);

        if (response.data?.subject?.units) {
          setSubjectName(response.data.subject.name || "");
          // Flatten chapters from all units
          const allChapters = response.data.subject.units.flatMap(unit =>
            unit.chapters.map(ch => ({
              ...ch,
              unitId: unit._id,
              unitTitle: unit.title
            }))
          );
          console.log("Sidebar: Processed chapters", allChapters);
          setChapters(allChapters);
        } else {
             console.warn("Sidebar: Invalid data structure", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch chapters:", error);
      } finally {
        setIsLoadingChapters(false);
      }
    };

    fetchChapters();
  }, [subjectId]);

  // Fetch chat history on mount
  // Fetch chat history on mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      setIsLoading(true);
      setMessages([]); // Clear previous messages immediately
      try {
        const response = await fetch(`/api/v1/ai/chat/${topicId}`, {
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

    if (topicId) {
        fetchChatHistory();
    }
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
        const response = await fetch(`/api/v1/ai/chat`, {
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

  // Modified handle function for accordion topic clicks
  const handleTopicClick = useCallback((newChapterId, newTopicId) => {
      // Navigate to new topic
      navigate(`/chat/${subjectId}/${newChapterId}/${newTopicId}`);
      setSidebarOpen(false);

      // Trigger scroll explicitly as requested
      setTimeout(() => {
          scrollToBottom();
      }, 100);

      // Also reset chat specific states if needed
      // setMessages([]); // Optional: clear messages if you want instant visual feedback before load
      // setIsLoading(true);
  }, [subjectId, navigate]);

  return (
    <div className="fixed inset-0 flex bg-main overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 h-full flex-shrink-0 z-30">
            <ChapterSidebar
                chapters={chapters}
                activeChapterId={chapterId}
                activeTopicId={topicId}
                isLoading={isLoadingChapters}
                onTopicSelect={handleTopicClick}
            />
        </div>

        {/* Mobile Sidebar (Drawer) */}
        <AnimatePresence>
            {sidebarOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 left-0 w-[85%] max-w-xs z-50 md:hidden bg-main shadow-2xl"
                    >
                        <ChapterSidebar
                            chapters={chapters}
                            activeChapterId={chapterId}
                            activeTopicId={topicId}
                            isLoading={isLoadingChapters}
                            onTopicSelect={handleTopicClick}
                        />
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </motion.div>
                </>
            )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full relative w-full">
            {/* Header */}
            <header className="flex items-center justify-between gap-4 px-6 py-4 bg-card/80 backdrop-blur-md sticky top-0 border-b border-border-soft">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="md:hidden p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-95 group"
                    >
                        <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
                    </button>
                    
                    {/* Mobile Branding - Topic Name */}
                    <div className="md:hidden flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <p className="text-[10px] font-bold text-accent uppercase tracking-widest line-clamp-1">
                                {subjectName || 'Subject'}
                            </p>
                        </div>
                        <h2 className="text-sm font-bold text-white tracking-tight line-clamp-1 truncate">
                            {activeTopic?.title || 'Chat'}
                        </h2>
                    </div>

                    {/* Desktop Header Title */}
                     <div className="hidden md:flex items-center gap-4">
                        <button 
                            onClick={() => navigate(-1)}
                            className="p-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl hover:bg-white/20 transition-all active:scale-95 group"
                        >
                             <ArrowLeft className="w-5 h-5 text-primary group-hover:-translate-x-1 transition-transform" />
                        </button>
                        <div className="h-10 w-px bg-white/10 mx-2" />
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-2 mb-0.5">
                                <p className="text-[10px] font-bold text-accent uppercase tracking-widest line-clamp-1">
                                    {subjectName || 'Subject'}
                                </p>
                                {chapters.find(c => c._id === chapterId)?.unitTitle && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-border-soft" />
                                        <p className="text-[10px] font-medium text-secondary line-clamp-1">
                                            {chapters.find(c => c._id === chapterId).unitTitle}
                                        </p>
                                    </>
                                )}
                            </div>
                            <h2 className="text-lg font-bold text-white tracking-tight line-clamp-1">
                                {activeTopic?.title || 'Chat'}
                            </h2>
                        </div>
                     </div>
                </div>

                 {/* Desktop Actions */}
                 <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden md:flex items-center gap-4 px-4 py-2 rounded-2xl bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                            <span className="text-[10px] font-black text-secondary/80 uppercase tracking-widest">Neural Live</span>
                        </div>
                    </div>

                    {/* Mobile Hamburger Menu */}
                    <button 
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 active:scale-95 transition-all text-secondary hover:text-primary"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                 </div>
            </header>

            {/* Chat Area */}
            <div ref={chatAreaRef} className={clsx("flex-1 overflow-y-auto overscroll-none", isTyping ? "pb-[50vh]" : "pb-4")}>
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
                            <MessageItem 
                                key={idx} 
                                msg={msg} 
                                idx={idx} 
                                isTyping={isTyping} 
                                onShare={handleShare} 
                                messageRef={msg.role === 'user' ? latestUserMsgRef : null}
                            />
                        ))}
                        {isTyping && (
                            <motion.div 
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }} 
                                className="flex justify-start mb-10 ml-2"
                            >
                                <div className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                                    {[0, 0.2, 0.4].map((delay, i) => (
                                        <motion.div
                                            key={i}
                                            animate={{ opacity: [0.3, 1, 0.3] }}
                                            transition={{ duration: 1.5, repeat: Infinity, delay, ease: "easeInOut" }}
                                            className="w-1 h-1 rounded-full bg-accent"
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} className="h-1" />
                    </div>
                )}
            </div>

            {/* Scroll To Bottom Button */}
            <AnimatePresence>
                {showScrollButton && (
                    <div className="fixed bottom-36 md:bottom-36 inset-x-0 md:right-[calc(50%-10rem)] md:left-auto z-20 flex justify-center pointer-events-none">
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={scrollToBottom}
                            className="pointer-events-auto p-3 bg-card border border-border-soft text-primary rounded-full shadow-xl hover:bg-accent hover:text-white hover:border-accent transition-all flex items-center justify-center"
                        >
                            <ArrowDown className="w-5 h-5" />
                        </motion.button>
                     </div>
                )}
            </AnimatePresence>

            {/* Input Area */}
            <div className="bg-card/80 backdrop-blur-xl border-t border-border-soft p-4 z-20">
                <div className="max-w-3xl mx-auto">
                    <form onSubmit={handleSend}>
                        <div className="flex items-center gap-2 bg-main rounded-full px-3 py-2 border border-border-soft focus-within:border-accent/50 transition-all shadow-sm">
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
                <div className="fixed inset-0 flex items-center justify-center">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={closeShareModal}
                    />
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-card rounded-2xl p-6 w-[90%] max-w-md shadow-2xl border border-border-soft"
                    >
                        <button 
                            onClick={closeShareModal}
                            className="absolute top-4 right-4 p-2 rounded-full hover:bg-border-soft transition-colors"
                        >
                            <X className="w-5 h-5 text-secondary" />
                        </button>
                        <h3 className="text-lg font-semibold text-primary mb-4">Share</h3>
                        {/* ... Share content logic ... */}
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
                    </motion.div>
                </div>
            )}
        </div>
    </div>
  );
}

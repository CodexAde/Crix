import { useState, useRef, useContext, useEffect, useMemo, useCallback, memo } from 'react';
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

import UserContext from '../context/User/UserContext';
import SyllabusContext from '../context/Syllabus/SyllabusContext';
import SubjectContext from '../context/Subject/SubjectContext';

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
          <div className="relative overflow-hidden transition-all duration-500 ">
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
                  ul: ({node, ...props}) => <ul className="list-none space-y-4 text-sm md:text-base text-secondary/90 mb-6" {...props} />,
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
                      <>
                        <div className="relative mb-8 rounded-2xl overflow-hidden bg-[#0a0a0a] border border-white/[0.05] shadow-2xl group/code -mx-2 md:mx-0">
                          {/* Ultra Minimal Header */}
                          <div className="flex items-center justify-between px-5 py-3 bg-white/[0.02] border-b border-white/[0.05]">
                            <span className="text-[10px] text-accent/40 font-mono font-medium lowercase tracking-wider">
                              {language || 'code'}
                            </span>
                            
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(codeString);
                                setLocalCopied(true);
                                setTimeout(() => setLocalCopied(false), 2000);
                              }}
                              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-secondary hover:text-primary transition-all active:scale-95 group/copy"
                            >
                              {localCopied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 group-hover/copy:scale-110 transition-transform" />}
                              <span className="text-[10px] font-medium tracking-tight">
                                {localCopied ? "Copied" : "Copy code"}
                              </span>
                            </button>
                          </div>
                          <SyntaxHighlighter
                            style={oneDark}
                            language={language || 'text'}
                            PreTag="div"
                            customStyle={{
                              margin: 0,
                              borderRadius: 0,
                              padding: '1.5rem',
                              fontSize: '0.85rem',
                              lineHeight: '1.7',
                              background: 'transparent',
                            }}
                            codeTagProps={{
                              style: {
                                fontFamily: '"JetBrains Mono", "SF Mono", "Fira Code", monospace',
                              }
                            }}
                          >
                            {codeString}
                        </SyntaxHighlighter>
                        </div>
                        {/* Smooth & Balanced Decorative Separator */}
                        <div className="my-6 px-4">
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                        </div>
                      </>
                    );
                  },
                  table: ({node, ...props}) => (
                    <div className="my-8 overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-sm shadow-xl">
                      <table className="w-full border-collapse text-sm text-left" {...props} />
                    </div>
                  ),
                  thead: ({node, ...props}) => <thead className="bg-white/[0.05] border-b border-white/10" {...props} />,
                  tbody: ({node, ...props}) => <tbody className="divide-y divide-white/5" {...props} />,
                  tr: ({node, ...props}) => <tr className="hover:bg-white/[0.02] transition-colors group/tr" {...props} />,
                  th: ({node, ...props}) => <th className="px-6 py-4 font-bold text-accent uppercase tracking-wider text-[10px]" {...props} />,
                  td: ({node, ...props}) => <td className="px-6 py-4 text-secondary group-hover/tr:text-primary transition-colors leading-relaxed" {...props} />,
                }}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
          </div>
          
          {/* CTA Buttons - Only show when NOT typing */}
          {!isTyping && (
            <div className="flex items-center gap-2 mt-3 opacity-1 group-hover/msg:opacity-100 transition-opacity duration-300">
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

    // Keep expansion in sync with active chapter on load/change
    useEffect(() => {
        if (activeChapterId) {
            setExpandedChId(activeChapterId);
        }
    }, [activeChapterId]);

    const handleChapterClick = (chId) => {
        setExpandedChId(prev => prev === chId ? null : chId);
    };

    return (
        <div className="flex flex-col h-full bg-card/50 backdrop-blur-3xl bg-card border-r border-border-soft">
            {/* Branding */}
            <Link to="/dashboard" className="flex items-center gap-3 p-6 border-border-soft/50 hover:bg-white/5 transition-colors cursor-pointer block">
                <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-primary tracking-tight">Crix</h2>
                <p className="text-[8px] text-accent font-bold uppercase tracking-widest opacity-70">Neural Engine</p>
            </div>
            </Link>

            {/* Chapters List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
                {isLoading ? (
                    [1,2,3,4].map(i => (
                        <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                    ))
                ) : (
                    chapters.map((ch) => {
                        const isExpanded = expandedChId === ch._id;
                        const isActiveChapter = activeChapterId === ch._id;

                        return (
                            <div key={ch._id} className="flex flex-col space-y-1">
                                <button
                                    onClick={() => handleChapterClick(ch._id)}
                                    className={clsx(
                                        "w-full text-left p-3.5 rounded-xl transition-all duration-300 group relative border",
                                        isActiveChapter
                                          ? "bg-accent/5 border-accent/10 mx-2 my-5 rounded-[2.5rem] hover:bg-accent/10"
                                          : "bg-transparent border border-border-soft mx-2 my-1 rounded-2xl hover:bg-white/5 hover:border-white/10"
                                    )}
                                >
                                    <div className="flex items-center justify-between overflow-hidden">
                                        <div className="flex flex-col gap-1 min-w-0">
                                            <span className={clsx(
                                                "text-[10px] uppercase tracking-wider font-semibold transition-colors truncate",
                                                isActiveChapter ? "text-accent" : "text-secondary/70 group-hover:text-secondary"
                                            )}>
                                                {ch.unitTitle || 'Chapter'}
                                            </span>
                                            <span className={clsx(
                                                "text-sm font-semibold truncate leading-tight transition-colors",
                                                isActiveChapter ? "text-primary" : "text-secondary group-hover:text-primary"
                                            )}>
                                                {ch.title}
                                            </span>
                                        </div>
                                    </div>
                                    {isActiveChapter && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-accent rounded-r-full" />
                                    )}
                                </button>

                                {/* Topics Accordion Body */}
                                <AnimatePresence initial={false}>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-border-soft ml-4 my-1">
                                                {ch.topics && ch.topics.length > 0 ? (
                                                    ch.topics.map((topic) => {
                                                        const isTopicActive = topic._id === activeTopicId;
                                                        return (
                                                            <button
                                                                key={topic._id}
                                                                onClick={() => onTopicSelect(ch._id, topic._id)}
                                                                className={clsx(
                                                                    "w-full text-left py-2 px-3 rounded-lg text-sm transition-all flex items-center gap-2 group/topic",
                                                                    isTopicActive
                                                                        ? "bg-accent/10 text-accent font-medium shadow-sm"
                                                                        : "text-secondary hover:text-primary hover:bg-white/5"
                                                                )}
                                                            >
                                                                <span className="truncate">{topic.title}</span>
                                                            </button>
                                                        )
                                                    })
                                                ) : (
                                                    <div className="text-xs text-secondary/50 italic px-3 py-2">No topics available</div>
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


export default function ChatInterface({ isRoadmap = false }) {
  const { subjectId, chapterId, topicId, roadmapId, dayId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userProfile, loading: loadingProfile } = useContext(UserContext);
  const { userSubjects } = useContext(SubjectContext);
  const { activeUnitData, activeSubjectData, loadingUnit, loadingSubject, fetchUnitContent, fetchSubjectData } = useContext(SyllabusContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [shareModal, setShareModal] = useState({ open: false, content: '' });
  
  // Roadmap States
  const [roadmapChapters, setRoadmapChapters] = useState([]);
  const [subjectNameState, setSubjectNameState] = useState("");
  const [isLoadingRoadmap, setIsLoadingRoadmap] = useState(false);
  const [copied, setCopied] = useState(false);

  const messagesEndRef = useRef(null);
  const latestUserMsgRef = useRef(null);
  const inputRef = useRef(null);
  const chatAreaRef = useRef(null);
  const abortControllerRef = useRef(null);
  const chatCache = useRef({});

  const activeChapterId = isRoadmap ? dayId : chapterId;
  const activeSubjectId = isRoadmap ? roadmapId : subjectId;

  // Find subject and units from context
  const subject = useMemo(() => userSubjects?.find(s => s._id === activeSubjectId), [userSubjects, activeSubjectId]);
  const units = useMemo(() => subject?.units || [], [subject]);
  const subjectName = useMemo(() => isRoadmap ? subjectNameState : (subject?.name || ""), [isRoadmap, subjectNameState, subject]);

  // Flattened chapters across ALL units for the sidebar
  const allChapters = useMemo(() => {
    if (isRoadmap) return roadmapChapters;
    
    if (!activeSubjectData?.units) return [];
    
    return activeSubjectData.units.flatMap(unit => 
        (unit.chapters || []).map(chapter => ({
            ...chapter,
            unitTitle: `Unit ${unit.unitNumber}`
        }))
    );
  }, [isRoadmap, roadmapChapters, activeSubjectData]);

  // Find current topic
  const activeTopic = useMemo(() => {
      const currentChapters = isRoadmap ? roadmapChapters : allChapters;
      if (!currentChapters || !topicId) return null;
      for (const ch of currentChapters) {
          const found = ch.topics?.find(t => t._id === topicId);
          if (found) return found;
      }
      return null;
  }, [isRoadmap, roadmapChapters, allChapters, topicId]);

  const activeUnitTitle = useMemo(() => {
    if (isRoadmap) {
        return roadmapChapters.find(c => c._id === activeChapterId)?.unitTitle || "";
    }
    // Find unit title from allChapters
    return allChapters.find(c => c._id === activeChapterId)?.unitTitle || "";
  }, [isRoadmap, roadmapChapters, activeChapterId, allChapters]);

  useEffect(() => {
    if (activeTopic && activeSubjectId && activeChapterId && topicId && subjectName && !isRoadmap) {
        const session = {
            subjectId: activeSubjectId,
            chapterId: activeChapterId,
            topicId,
            topicTitle: activeTopic.title,
            subjectName: subjectName,
            unitTitle: activeUnitTitle || "Unit",
            timestamp: Date.now()
        };
        localStorage.setItem('crix_last_session', JSON.stringify(session));
    }
  }, [activeTopic, activeSubjectId, activeChapterId, topicId, subjectName, activeUnitTitle, isRoadmap]);

  const handleShare = (content) => {
    setShareModal({ open: true, content });
  };

  const closeShareModal = () => {
    setShareModal({ open: false, content: '' });
  };

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const scrollToBottom = (behavior = "smooth") => {
    // If behavior is an event object (from onClick), default to "smooth"
    const scrollBehavior = typeof behavior === 'string' ? behavior : "smooth";
    
    if (chatAreaRef.current) {
        chatAreaRef.current.scrollTo({
            top: chatAreaRef.current.scrollHeight,
            behavior: scrollBehavior
        });
    } else {
        messagesEndRef.current?.scrollIntoView({ behavior: scrollBehavior, block: "end" });
    }
  };

  useEffect(() => {
    if (!isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!isLoading && lastMsg?.role === 'user') {
      setTimeout(() => {
        latestUserMsgRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 50);
    }
  }, [messages, isLoading]);

  useEffect(() => {
    if (!isTyping && messages.length > 0) {
      scrollToBottom();
    }
  }, [isTyping, messages.length]);

  useEffect(() => {
    const chatArea = chatAreaRef.current;
    if (!chatArea) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = chatArea;
      const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
      setShowScrollButton(isScrolledUp);
    };

    chatArea.addEventListener('scroll', handleScroll);
    return () => chatArea.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    let scrollTimeoutId = null;

    const scrollToInput = () => {
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);

      if (chatAreaRef.current) {
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      }
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant', block: 'end' });
    };

    const handleViewportChange = () => {
      if (window.visualViewport) {
        const viewport = window.visualViewport;
        const heightDiff = window.innerHeight - viewport.height;
        if (heightDiff > 100) {
          scrollToInput();
        }
      }
    };

    const handleInputFocus = () => {
      setTimeout(scrollToInput, 100);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
    }

    const inputEl = inputRef.current;
    if (inputEl) {
      inputEl.addEventListener('focus', handleInputFocus);
    }

    return () => {
      if (scrollTimeoutId) clearTimeout(scrollTimeoutId);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportChange);
      }
      if (inputEl) {
        inputEl.removeEventListener('focus', handleInputFocus);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key.length === 1 && !e.repeat) {
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Roadmap Data Fetching
  useEffect(() => {
    const fetchRoadmap = async () => {
      if (!isRoadmap || !roadmapId) return;
      setIsLoadingRoadmap(true);
      try {
        const response = await axios.get(`/roadmaps/${roadmapId}`);
        if (response.data?.data?.roadmap?.days) {
          const roadmap = response.data.data.roadmap;
          setSubjectNameState(roadmap.name || "Roadmap");
          const allDays = roadmap.days.map(day => ({
            _id: day._id,
            title: day.title,
            unitTitle: `Day ${day.dayNumber}`,
            topics: day.topics || []
          }));
          setRoadmapChapters(allDays);
        }
      } catch (error) {
          console.error("Failed to fetch roadmap:", error);
      } finally {
          setIsLoadingRoadmap(false);
      }
    };
    fetchRoadmap();
  }, [isRoadmap, roadmapId]);

  // Fetch full subject data for sidebar if needed
  useEffect(() => {
    if (!isRoadmap && activeSubjectId && (!activeSubjectData || activeSubjectData._id !== activeSubjectId)) {
        fetchSubjectData(activeSubjectId);
    }
  }, [activeSubjectId, isRoadmap, fetchSubjectData, activeSubjectData]);

  // Fetch chat history with caching
  useEffect(() => {
    const fetchChatHistory = async () => {
      if (chatCache.current[topicId]) {
        setMessages(chatCache.current[topicId]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setMessages([]); 
      try {
        const response = await fetch(`/api/v1/ai/chat/${topicId}`, {
          credentials: 'include',
        });
        const data = await response.json();

        if (data.success && data.messages.length > 0) {
          setMessages(data.messages);
          chatCache.current[topicId] = data.messages;
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
      if (isRoadmap) {
        navigate(`/roadmap/${roadmapId}/${newChapterId}/${newTopicId}`);
      } else {
        navigate(`/chat/${subjectId}/${newChapterId}/${newTopicId}`);
      }
      setSidebarOpen(false);

      setTimeout(() => {
          scrollToBottom("smooth");
      }, 100);
  }, [subjectId, roadmapId, navigate, isRoadmap]);

  return (
    <div className="fixed inset-0 flex bg-main overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:block w-64 h-full flex-shrink-0 z-30">
            <ChapterSidebar
                chapters={allChapters}
                activeChapterId={activeChapterId}
                activeTopicId={topicId}
                isLoading={isRoadmap ? isLoadingRoadmap : (loadingProfile || loadingSubject)}
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
                        transition={{ duration: 0.2 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/40 z-40 md:hidden pointer-events-auto"
                    />
                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
                        className="fixed inset-y-0 left-0 w-[85%] max-w-xs z-50 md:hidden bg-main shadow-2xl overflow-hidden"
                        style={{ willChange: 'transform' }}
                    >
                        <ChapterSidebar
                            chapters={allChapters}
                            activeChapterId={activeChapterId}
                            activeTopicId={topicId}
                            isLoading={isRoadmap ? isLoadingRoadmap : (loadingProfile || loadingSubject)}
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
            <header className="flex items-center justify-between gap-4 px-6 py-4 bg-card/80 backdrop-blur-md sticky top-0  border-border-soft">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <button 
                        onClick={() => isRoadmap ? navigate(`/roadmap/${roadmapId}`) : navigate(`/syllabus/${subjectId}`)} 
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
                        <h2 className="text-sm font-bold text-primary tracking-tight line-clamp-1 truncate">
                            {activeTopic?.title || 'Chat'}
                        </h2>
                    </div>

                    {/* Desktop Header Title */}
                     <div className="hidden md:flex items-center gap-4">
                        <button 
                            onClick={() => isRoadmap ? navigate(`/roadmap/${roadmapId}`) : navigate(`/syllabus/${subjectId}`)}
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
                                {activeUnitTitle && (
                                    <>
                                        <span className="w-1 h-1 rounded-full bg-border-soft" />
                                        <p className="text-[10px] font-medium text-secondary line-clamp-1">
                                            {activeUnitTitle}
                                        </p>
                                    </>
                                )}
                            </div>
                            <h2 className="text-lg font-bold text-secondary/80 tracking-tight line-clamp-1">
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
            <AnimatePresence>
                {shareModal.open && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeShareModal}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative bg-card/90 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-white/10 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-accent/20 blur-[80px] rounded-full pointer-events-none" />
                            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent/10 blur-[80px] rounded-full pointer-events-none" />

                            <button 
                                onClick={closeShareModal}
                                className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 text-secondary hover:text-primary transition-all active:scale-90"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-2xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                                        <Share className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-primary tracking-tight">Share</h3>
                                        <p className="text-xs text-secondary font-medium">Spread the knowledge</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Link Copy Section */}
                                    <div>
                                        <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 px-1">Quick Link</p>
                                        <div className="flex items-center gap-2 bg-white/5 rounded-2xl p-2 border border-white/10 group focus-within:border-accent/40 transition-all">
                                            <div className="pl-2">
                                                <Link2 className="w-4 h-4 text-secondary group-focus-within:text-accent transition-colors" />
                                            </div>
                                            <span className="text-xs text-secondary/80 truncate flex-1 font-medium">{shareUrl}</span>
                                            <button 
                                                onClick={copyLink}
                                                className="px-4 py-2 bg-accent text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-accent/10"
                                            >
                                                {copied ? "Copied!" : "Copy"}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Social Share Section */}
                                    <div>
                                        <p className="text-[10px] font-bold text-accent uppercase tracking-widest mb-3 px-1">Share To</p>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { icon: MessageCircle, label: 'WhatsApp', onClick: shareToWhatsApp, color: 'hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/20' },
                                                { icon: Send, label: 'Telegram', onClick: shareToTelegram, color: 'hover:bg-blue-500/10 hover:text-blue-500 hover:border-blue-500/20' },
                                                { icon: X, label: 'Twitter', onClick: shareToTwitter, color: 'hover:bg-white/10 hover:text-primary hover:border-white/20' }
                                            ].map((social, i) => (
                                                <button
                                                    key={i}
                                                    onClick={social.onClick}
                                                    className={clsx(
                                                        "flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/5 transition-all active:scale-95 group",
                                                        social.color
                                                    )}
                                                >
                                                    <social.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                                                    <span className="text-[10px] font-bold">{social.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    </div>
  );
}

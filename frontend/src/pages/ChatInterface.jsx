import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Send, ArrowLeft, MoreHorizontal, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function ChatInterface() {
  const { subjectId, chapterId, topicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch chat history on mount
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/v1'}/ai/chat/${topicId}`, {
          credentials: 'include',
        });
        const data = await response.json();
        
        if (data.success && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          // No history, show welcome message
          setMessages([
            { role: 'assistant', content: `Hi ${user?.name?.split(' ')[0] || 'there'}! I'm ready to help you master this topic. What should we start with?` }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch chat history:", error);
        setMessages([
          { role: 'assistant', content: `Hi ${user?.name?.split(' ')[0] || 'there'}! I'm ready to help you master this topic. What should we start with?` }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChatHistory();
  }, [topicId, user]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
        const token = document.cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];
        
        // Use native fetch for streaming
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000/api/v1'}/ai/chat`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                topicId,
                message: userMsg.content,
                history: messages.slice(-10) // Keep context reasonable
            })
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
                    } catch (e) {
                         // Ignore parse errors for partial chunks
                    }
                }
            }
        }

    } catch (error) {
        setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting to the AI. Please try again." }]);
    } finally {
        setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f5f6f8]">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-border-soft sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5 text-secondary" />
                </button>
                <div>
                     <h1 className="font-bold text-primary text-sm md:text-base">AI Tutor</h1>
                     <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-secondary">Online</span>
                     </div>
                </div>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full text-secondary">
                <MoreHorizontal className="w-5 h-5" />
            </button>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.map((msg, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={clsx(
                        "flex w-full",
                        msg.role === 'user' ? "justify-end" : "justify-start"
                    )}
                >
                    <div className={clsx(
                        "max-w-[85%] md:max-w-[70%] rounded-2xl p-4 shadow-sm",
                        msg.role === 'user' 
                            ? "bg-accent text-white rounded-br-none" 
                            : "bg-white text-primary border border-border-soft rounded-bl-none"
                    )}>
                        {msg.role === 'assistant' && (
                             <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-3 h-3 text-accent" />
                                <span className="text-[10px] font-bold text-accent uppercase tracking-wider">AI Tutor</span>
                             </div>
                        )}

                        <div className={clsx("prose prose-sm max-w-none break-words leading-relaxed", 
                            msg.role === 'user' ? "prose-invert" : "prose-headings:text-primary prose-a:text-accent prose-strong:text-primary prose-code:text-accent"
                        )}>
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={{
                                    // Custom styling for specific elements to make it "mast"
                                    h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-4 mt-6 border-b border-border-soft pb-2" {...props} />,
                                    h2: ({node, ...props}) => <h2 className="text-lg font-bold mb-3 mt-5 text-accent/90" {...props} />,
                                    h3: ({node, ...props}) => <h3 className="text-base font-bold mb-2 mt-4" {...props} />,
                                    p: ({node, ...props}) => <p className="mb-3 last:mb-0" {...props} />,
                                    ul: ({node, ...props}) => <ul className="list-disc list-outside ml-4 mb-4 space-y-1" {...props} />,
                                    ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-4 mb-4 space-y-1" {...props} />,
                                    blockquote: ({node, ...props}) => (
                                        <blockquote className="border-l-4 border-accent/50 bg-accent/5 pl-4 py-2 italic rounded-r-lg mb-4 text-gray-700" {...props} />
                                    ),
                                    code: ({node, inline, className, children, ...props}) => {
                                        return inline ? (
                                            <code className="bg-gray-100 text-accent px-1.5 py-0.5 rounded text-xs font-mono font-medium" {...props}>
                                                {children}
                                            </code>
                                        ) : (
                                            <div className="relative group">
                                                <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-xs font-mono my-4 shadow-inner" {...props}>
                                                    {children}
                                                </code>
                                            </div>
                                        );
                                    },
                                    table: ({node, ...props}) => (
                                        <div className="overflow-x-auto my-4 rounded-lg border border-border-soft shadow-sm">
                                            <table className="min-w-full divide-y divide-gray-200" {...props} />
                                        </div>
                                    ),
                                    th: ({node, ...props}) => <th className="bg-gray-50 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />,
                                    td: ({node, ...props}) => <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 border-t border-gray-100" {...props} />,
                                }}
                            >
                                {msg.content}
                            </ReactMarkdown>
                        </div>
                    </div>
                </motion.div>
            ))}
            {isTyping && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                     <div className="bg-white rounded-2xl rounded-bl-none p-4 border border-border-soft flex gap-1">
                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                         <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                     </div>
                 </motion.div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-border-soft">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center gap-3">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    className="flex-1 bg-gray-100 text-primary placeholder:text-gray-400 rounded-full py-3 px-6 focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all font-medium"
                />
                <button 
                    type="submit" 
                    disabled={!input.trim() || isTyping}
                    className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center hover:bg-blue-600 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-soft"
                >
                    <Send className="w-5 h-5 ml-0.5" />
                </button>
            </form>
            <div className="flex justify-center gap-2 mt-3 overflow-x-auto pb-1">
                {['Summarize', 'Give me 5 MCQs', 'Explain simpler'].map(quickAction => (
                    <button 
                        key={quickAction}
                        onClick={() => { setInput(quickAction); }}
                        className="whitespace-nowrap px-3 py-1.5 rounded-lg bg-gray-50 border border-border-soft text-xs text-secondary hover:bg-gray-100 transition-colors"
                    >
                        {quickAction}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
}

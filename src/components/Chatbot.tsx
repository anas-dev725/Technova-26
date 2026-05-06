import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithAI } from '../services/geminiService';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: 'init',
  text: "hey i'm your technova ai buddy feel free to ask any queries you have",
  sender: 'bot',
  timestamp: new Date()
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    console.log("Chatbot: Sending message...", inputValue);
    if (!inputValue.trim() || isTyping) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Prepare history for Gemini
    const history = messages
      .filter(m => m.id !== 'init') 
      .map(m => ({
        role: (m.sender === 'bot' ? 'model' : 'user') as 'user' | 'model',
        parts: [{ text: m.text }]
      }));

    try {
      console.log("Chatbot: Calling chatWithAI...");
      const response = await chatWithAI(userMsg.text, history);
      console.log("Chatbot: Received response", response);
      
      const botMsg: Message = {
        id: Date.now().toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-tr from-blue-600 to-blue-400 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 transition-all z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-white dark:border-gray-900 rounded-full"></span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-[90vw] sm:w-[380px] h-[550px] max-h-[80vh] bg-white dark:bg-[#111] border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-between shrink-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Technova AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <p className="text-blue-100 text-xs font-medium">Always here to help</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-[#0a0a0a]">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex items-end gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-200 dark:bg-white/10'}`}>
                    {msg.sender === 'user' ? <User className="w-3 h-3 text-blue-600 dark:text-blue-400" /> : <Bot className="w-3 h-3 text-gray-600 dark:text-gray-400" />}
                  </div>
                  <div 
                    className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-blue-600 text-white rounded-br-sm' 
                        : 'bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-white/5 rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center shrink-0">
                    <Bot className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/5 p-3 rounded-2xl rounded-bl-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-white/10 shrink-0">
              <form 
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-gray-100 dark:bg-white/5 border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-[#1a1a1a] rounded-full px-4 py-2 text-sm text-gray-900 dark:text-white outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center shrink-0 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

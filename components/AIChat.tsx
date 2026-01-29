import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { MessageCircle, X, Send, Sparkles, Bot, Loader2, AlertCircle } from 'lucide-react';
import { useApps } from '../context/AppContext';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const AIChat: React.FC = () => {
  const { apps } = useApps();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: 'Hi! I\'m the AS Universe AI. How can I help you find an app today?' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Chat instance ref to maintain session
  const chatSessionRef = useRef<Chat | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const initializeChat = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const appList = apps.map(a => `${a.name} (${a.category})`).join(', ');
      const systemInstruction = `You are the AI assistant for AS UNIVERSE APPSTORE. 
      Your goal is to help users discover apps, solve educational queries, and navigate the store.
      
      Available Apps in Store: ${appList}.
      
      Tone: Friendly, helpful, and concise. Use emojis occasionally.
      If asked about apps not in the list, politely mention you only manage the AS Universe catalog but can try to help with general info.`;

      chatSessionRef.current = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction,
        }
      });
      setError(null);
      return true;
    } catch (error) {
      console.error("Failed to init chat", error);
      setError("AI Service Unavailable");
      return false;
    }
  };

  // Initialize chat when opened for the first time
  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      initializeChat();
    }
  }, [isOpen, apps]);

  const handleSend = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg = inputText.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      if (!chatSessionRef.current) {
        const success = await initializeChat();
        if (!success) {
           throw new Error("Could not connect to AI service.");
        }
      }

      if (chatSessionRef.current) {
        const result = await chatSessionRef.current.sendMessage({ message: userMsg });
        const responseText = result.text;
        
        if (responseText) {
          setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        }
      }
    } catch (error) {
      console.error("Chat Error", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting right now. Please check your connection or try again later." }]);
      setError("Connection Failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-[60] flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-[90vw] md:w-[350px] max-h-[60vh] md:max-h-[500px] bg-[#1c1f2e]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 pointer-events-auto">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-600 to-cyan-600 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2 text-white">
              <Sparkles size={18} className="animate-pulse" />
              <span className="font-bold tracking-wide">AI Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors text-white"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-500/10' 
                      : 'bg-[#0f111a] border border-white/10 text-gray-200 rounded-bl-none shadow-md'}
                  `}
                >
                  {msg.role === 'model' && (
                    <div className="flex items-center gap-1.5 mb-1 opacity-50">
                        <Bot size={12} />
                        <span className="text-[10px] font-bold uppercase">Gemini</span>
                    </div>
                  )}
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="bg-[#0f111a] border border-white/10 p-3 rounded-2xl rounded-bl-none flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-indigo-400" />
                    <span className="text-xs text-gray-400">Thinking...</span>
                 </div>
              </div>
            )}
            {error && (
               <div className="flex justify-center my-2">
                  <span className="text-xs text-red-400 bg-red-500/10 px-3 py-1 rounded-full flex items-center gap-1">
                     <AlertCircle size={12}/> {error}
                  </span>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-[#131520] border-t border-white/5">
            <div className="relative">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything..."
                className="w-full bg-[#1c1f2e] border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:border-indigo-500 outline-none transition-all placeholder:text-gray-600"
              />
              <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white p-4 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all hover:-translate-y-1 active:scale-95 group relative border-2 border-white/10"
      >
        <span className="absolute inset-0 rounded-full bg-white/20 animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></span>
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

    </div>
  );
};

export default AIChat;

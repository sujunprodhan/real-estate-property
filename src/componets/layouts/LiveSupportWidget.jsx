'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Phone, X, Send, Bot, Paperclip } from 'lucide-react';

const aiResponses = [
  "Hello! How can I assist you with your real estate journey today?",
  "We have some amazing properties on the market. Are you looking to buy or rent?",
  "I'm EstateEase AI! Please note I can't book viewings directly here, but you can do that from the property details page.",
  "That's interesting! Please leave a message for our admin in the inbox for more detailed support.",
  "I'm an AI assistant. For human support, you can use the WhatsApp button or log in to your profile and use the Inbox!"
];

export default function LiveSupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I'm EstateEase AI. How can I help you?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages(prev => [...prev, { text: randomResponse, sender: 'ai' }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* AI Chat Window */}
      {isOpen && (
        <div className="w-[320px] md:w-[360px] h-[450px] bg-base-100 rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-base-200/50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-primary px-4 py-4 flex items-center justify-between text-white rounded-t-3xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
                <Bot size={20} />
              </div>
              <div>
                <h4 className="font-extrabold text-sm tracking-wide">EstateEase AI</h4>
                <p className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">Live Support</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="btn btn-ghost btn-circle btn-sm text-white/80 hover:text-white hover:bg-white/20">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-base-200/30">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-medium shadow-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-primary-content rounded-br-sm' 
                    : 'bg-base-100 text-base-content border border-base-200 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-base-100 border border-base-200 text-base-content rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 shadow-sm">
                  <div className="w-1.5 h-1.5 bg-base-content/40 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-base-content/40 rounded-full animate-bounce [animation-delay:-.15s]" />
                  <div className="w-1.5 h-1.5 bg-base-content/40 rounded-full animate-bounce [animation-delay:-.3s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-3 bg-base-100 border-t border-base-200/60 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="input input-sm flex-1 bg-base-200/50 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            <button type="submit" disabled={!input.trim()} className="btn btn-sm btn-circle btn-primary shadow-md shadow-primary/20">
              <Send size={14} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Buttons */}
      <div className="flex flex-col gap-3">
        <a 
          href="https://wa.me/1234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:scale-110 transition-transform duration-300"
        >
          <Phone size={22} fill="currentColor" />
        </a>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/30 hover:scale-105 transition-transform duration-300 border-2 border-white/20"
        >
          {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        </button>
      </div>
    </div>
  );
}

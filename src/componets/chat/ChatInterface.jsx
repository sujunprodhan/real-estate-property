'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, X, Image as ImageIcon, Search, MoreVertical, MessageSquare } from 'lucide-react';
import { getMessages, sendMessage, getAllMessageThreads, markThreadAsRead } from '../../actions/server/message';

export default function ChatInterface({ session, isAdminMode }) {
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeUserEmail, setActiveUserEmail] = useState('');
  const [activeUserName, setActiveUserName] = useState('');
  const [activeUserImage, setActiveUserImage] = useState(null);
  const [input, setInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [uploading, setUploading] = useState(false);
  const chatContainerRef = useRef(null);
  
  // For user mode, there's only one thread (Admin).
  const adminEmail = 'admin@estateease.com';
  
  const uploadImageToImgbb = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY || '801df07212c14c5c7db6a2aee813d11b';
    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) return data.data.url;
      return null;
    } catch (err) {
      return null;
    }
  };

  const fetchThreads = async () => {
    if (isAdminMode) {
      const allThreads = await getAllMessageThreads();
      setThreads(allThreads);
      if (activeUserEmail) {
        const current = allThreads.find(t => t.userEmail === activeUserEmail);
        if (current) setMessages(current.messages);
      }
    } else {
      const msgs = await getMessages(session?.user?.email);
      setMessages(msgs);
      
      const adminThread = {
        userEmail: adminEmail,
        userName: 'Support Admin',
        userImage: null,
        messages: msgs,
        lastMessage: msgs.length > 0 ? (msgs[msgs.length - 1].text || 'Attachment') : 'Start a conversation',
        unreadCount: msgs.filter(m => !m.read && m.senderRole === 'admin').length,
        updatedAt: msgs.length > 0 ? msgs[msgs.length - 1].createdAt : new Date(),
      };
      setThreads([adminThread]);
      
      // Auto select for user
      if (!activeUserEmail) {
        setActiveUserEmail(adminEmail);
        setActiveUserName('Support Admin');
      }

      if (msgs.some(m => !m.read && m.senderRole === 'admin')) {
        await markThreadAsRead(session?.user?.email, true);
      }
    }
  };

  useEffect(() => {
    fetchThreads();
    const interval = setInterval(fetchThreads, 3000); // Polling every 3s
    return () => clearInterval(interval);
  }, [isAdminMode, activeUserEmail, session]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() && !attachment) return;
    
    setUploading(true);
    let attachmentUrl = '';
    if (attachment) {
      attachmentUrl = await uploadImageToImgbb(attachment);
    }
    
    const newMsg = {
      senderEmail: session?.user?.email,
      senderName: session?.user?.name,
      senderImage: session?.user?.image,
      senderRole: isAdminMode ? 'admin' : 'user',
      receiverEmail: isAdminMode ? activeUserEmail : adminEmail,
      receiverName: isAdminMode ? activeUserName : 'Administrator',
      receiverImage: isAdminMode ? activeUserImage : null,
      text: input,
      attachment: attachmentUrl,
    };
    
    setInput('');
    setAttachment(null);
    setUploading(false);
    
    // Optimistic UI
    setMessages(prev => [...prev, { ...newMsg, createdAt: new Date() }]);
    
    await sendMessage(newMsg);
    fetchThreads();
  };

  const filteredThreads = threads.filter(t => t.userName.toLowerCase().includes(searchQuery.toLowerCase()));

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 gap-0 h-[calc(100vh-140px)] min-h-[500px] w-full bg-base-100 rounded-3xl shadow-2xl border border-base-200 overflow-hidden">
      
      {/* Sidebar (Thread List) */}
      <div className="flex flex-col border-r border-base-200 lg:col-span-1 bg-base-100/50 max-h-[300px] lg:max-h-full">
        {/* Sidebar Header */}
        <div className="p-5 border-b border-base-200 space-y-4 shrink-0">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-base-content tracking-tight">Messages</h2>
            <button className="btn btn-ghost btn-circle btn-sm bg-base-200/50">
              <MoreVertical size={16} className="text-base-content/70" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3.5 top-2.5 text-base-content/40" size={16} />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full pl-10 bg-base-200/50 rounded-full text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 h-10 border-transparent"
            />
          </div>
        </div>

        {/* Thread List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredThreads.length === 0 ? (
            <p className="text-xs font-bold text-center text-base-content/40 mt-10">No conversations found.</p>
          ) : (
            filteredThreads.map(t => (
              <button 
                key={t.userEmail}
                onClick={async () => { 
                  setActiveUserEmail(t.userEmail); 
                  setActiveUserName(t.userName); 
                  setActiveUserImage(t.userImage); 
                  setMessages(t.messages); 
                  
                  // Optimistically clear unread count
                  setThreads(prev => prev.map(thread => 
                    thread.userEmail === t.userEmail ? { ...thread, unreadCount: 0 } : thread
                  ));

                  if (isAdminMode) {
                    await markThreadAsRead(t.userEmail, false);
                  } else {
                    await markThreadAsRead(session?.user?.email, true);
                  }
                  fetchThreads();
                }}
                className={`w-full p-3 rounded-2xl text-left transition-all flex items-center gap-3 relative group ${activeUserEmail === t.userEmail ? 'bg-primary/5 shadow-sm border border-primary/10' : 'hover:bg-base-200/50 border border-transparent'}`}
              >
                <div className="relative shrink-0">
                  {t.userImage ? (
                    <img src={t.userImage} alt={t.userName} className="w-11 h-11 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-base-300 text-base-content flex items-center justify-center font-black text-sm shadow-sm">
                      {t.userName?.slice(0, 2).toUpperCase() || 'US'}
                    </div>
                  )}
                  {/* Status Dot */}
                  <span className={`w-3 h-3 rounded-full absolute -bottom-0.5 -right-0.5 border-2 border-base-100 ${t.unreadCount > 0 ? 'bg-success animate-pulse' : 'bg-base-300'}`}></span>
                </div>
                
                <div className="overflow-hidden flex-1">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-extrabold text-xs text-base-content truncate pr-2">{t.userName}</h4>
                    <span className="text-[9px] font-bold text-base-content/40 shrink-0">{formatTime(t.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <p className={`text-[10px] truncate ${t.unreadCount > 0 ? 'text-base-content font-bold' : 'text-base-content/60 font-semibold'}`}>
                      {t.lastMessage}
                    </p>
                    {t.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-success text-white flex items-center justify-center text-[8px] font-black shrink-0 shadow-sm">
                        {t.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-col lg:col-span-3 bg-base-100 relative h-full overflow-hidden">
        {!activeUserEmail ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-base-200/10">
            <div className="w-24 h-24 rounded-full bg-success/10 text-success flex items-center justify-center mb-6 shadow-sm">
              <MessageSquare size={48} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-black text-base-content tracking-tight mb-2">Select a Conversation</h2>
            <p className="text-xs font-bold text-base-content/50 max-w-xs mx-auto leading-relaxed">
              Choose a customer from the left panel to start a professional support session.
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-base-200 flex justify-between items-center shrink-0 bg-base-100/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  {isAdminMode && activeUserImage ? (
                    <img src={activeUserImage} alt={activeUserName} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-base-300 text-base-content flex items-center justify-center font-black text-sm shadow-sm">
                      {isAdminMode ? (activeUserName?.slice(0, 2).toUpperCase() || 'US') : 'AD'}
                    </div>
                  )}
                  <span className="w-3 h-3 bg-success rounded-full absolute bottom-0 right-0 border-2 border-base-100"></span>
                </div>
                <div>
                  <h3 className="font-black text-base text-base-content tracking-tight">
                    {isAdminMode ? activeUserName : 'Support Admin'}
                  </h3>
                  <p className="text-[10px] font-bold text-success uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                    Active Now
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-base-200/30">
              {messages.map((msg, idx) => {
                const isMe = msg.senderEmail === session?.user?.email;
                return (
                  <div key={idx} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-end gap-2 max-w-[80%]">
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-base-300 shrink-0 overflow-hidden shadow-sm border border-base-200">
                          {msg.senderImage ? (
                            <img src={msg.senderImage} alt={msg.senderName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-[9px] text-base-content/70">
                              {msg.senderName?.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="text-[10px] font-bold text-base-content/40 px-1">
                          {msg.senderName} • {formatTime(msg.createdAt)}
                        </div>
                        <div className={`px-5 py-3 text-sm font-semibold shadow-sm ${
                          isMe 
                            ? 'bg-primary text-primary-content rounded-[20px] rounded-br-sm' 
                            : 'bg-base-100 border border-base-200 text-base-content rounded-[20px] rounded-bl-sm'
                        }`}>
                          {msg.attachment && (
                            <img src={msg.attachment} alt="attachment" className="max-w-[200px] md:max-w-[250px] rounded-xl mb-2 border border-base-200/50" />
                          )}
                          {msg.text}
                        </div>
                      </div>

                      {isMe && (
                        <div className="w-8 h-8 rounded-full bg-primary/20 shrink-0 overflow-hidden shadow-sm border border-primary/30">
                          {msg.senderImage ? (
                            <img src={msg.senderImage} alt={msg.senderName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-black text-[9px] text-primary">
                              {msg.senderName?.slice(0, 2).toUpperCase() || 'ME'}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Chat Input */}
            <div className="p-4 bg-base-100 border-t border-base-200 shrink-0">
              {attachment && (
                <div className="mb-3 flex items-center gap-2 bg-base-200 w-max px-3 py-1.5 rounded-xl border border-base-300">
                  <ImageIcon size={14} className="text-primary" />
                  <span className="text-xs font-bold text-base-content/70 truncate max-w-[150px]">{attachment.name}</span>
                  <button type="button" onClick={() => setAttachment(null)} className="text-error hover:bg-error/10 p-1 rounded-lg ml-2 transition-colors"><X size={14}/></button>
                </div>
              )}
              <form onSubmit={handleSend} className="flex gap-2 items-center bg-base-200/50 p-2 rounded-[2rem] border border-base-200 focus-within:border-primary/30 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
                <label className="btn btn-circle btn-ghost btn-sm text-base-content/50 hover:text-primary">
                  <Paperclip size={18} />
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setAttachment(e.target.files[0])} />
                </label>
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={uploading ? "Uploading attachment..." : "Type a message..."}
                  disabled={uploading}
                  className="flex-1 bg-transparent text-sm font-semibold focus:outline-none placeholder:text-base-content/40 px-2" 
                />
                <button 
                  type="submit" 
                  disabled={uploading || (!input.trim() && !attachment)} 
                  className={`btn btn-circle btn-sm shadow-md h-10 w-10 shrink-0 ${input.trim() || attachment ? 'btn-primary' : 'btn-disabled bg-base-300 text-base-content/30'}`}
                >
                  <Send size={16} className={input.trim() || attachment ? 'ml-0.5' : ''} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

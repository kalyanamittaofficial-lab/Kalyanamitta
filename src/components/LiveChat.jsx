import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabase';
import { Send, X, MessageSquare, User, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_REACTIONS = [
  'සාදු! සාදු! 🙏',
  'තෙරුවන් සරණයි ✨',
  'නමෝ බුද්ධාය 🌸',
];

export default function LiveChat({ isOpen, onClose, viewerCount = 0 }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [userName, setUserName] = useState(() => localStorage.getItem('km_chat_name') || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const channelRef = useRef(null);

  // Scroll to bottom smoothly
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Auth & Profile initialization
  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUser(session.user);
        // Check admin role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        if (roleData?.role === 'superadmin' || roleData?.role === 'editor') {
          setIsAdmin(true);
        }

        // Determine user display name
        const userDisplayName =
          session.user.user_metadata?.full_name ||
          session.user.user_metadata?.name ||
          session.user.email?.split('@')[0] ||
          'ධර්ම මිත්‍ර';

        if (!localStorage.getItem('km_chat_name')) {
          setUserName(userDisplayName);
          localStorage.setItem('km_chat_name', userDisplayName);
        }
      }
    })();
  }, []);

  // Realtime Messages Subscription + Initial Fetch
  useEffect(() => {
    // 1. Fetch recent messages from table (if table exists)
    (async () => {
      try {
        const { data, error } = await supabase
          .from('live_chat_messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(60);

        if (!error && Array.isArray(data)) {
          setMessages(data);
        }
      } catch (err) {
        console.warn('Initial chat fetch failed (table may not be configured yet):', err);
      }
    })();

    // 2. Realtime Broadcast Channel (works instantly even before SQL migration)
    const channel = supabase.channel('live_stream_chat_room', {
      config: { broadcast: { self: true } },
    });

    channelRef.current = channel;

    channel
      .on('broadcast', { event: 'new_message' }, ({ payload }) => {
        if (!payload) return;
        setMessages((prev) => {
          // Prevent duplicates if already present
          if (prev.some((m) => m.id === payload.id)) return prev;
          return [...prev, payload];
        });
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'live_chat_messages' }, (payload) => {
        if (!payload.new) return;
        setMessages((prev) => {
          if (prev.some((m) => m.id === payload.new.id)) return prev;
          return [...prev, payload.new];
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSaveName = (e) => {
    e?.preventDefault();
    const clean = nameInput.trim();
    if (!clean) return;
    setUserName(clean);
    localStorage.setItem('km_chat_name', clean);
    setIsEditingName(false);
  };

  const sendMessage = async (textToSend) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    if (!userName.trim()) {
      setIsEditingName(true);
      return;
    }

    setSending(true);

    const tempId = `msg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const newMsg = {
      id: tempId,
      session_id: 1,
      user_name: userName.trim(),
      message: content,
      user_id: currentUser?.id || null,
      is_admin: isAdmin,
      created_at: new Date().toISOString(),
    };

    // Instant local optimistic update
    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Instant Realtime broadcast to all viewers
    try {
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'new_message',
          payload: newMsg,
        });
      }
    } catch (err) {
      console.warn('Realtime broadcast notice:', err);
    }

    // Persist to Supabase DB
    try {
      await supabase.from('live_chat_messages').insert({
        session_id: 1,
        user_name: newMsg.user_name,
        message: newMsg.message,
        user_id: newMsg.user_id,
        is_admin: newMsg.is_admin,
      });
    } catch (err) {
      // Table might not exist yet, broadcast already handled it
      console.warn('DB chat insert notice:', err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 60, scale: 0.98 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.98 }}
      transition={{ type: 'spring', damping: 26, stiffness: 280 }}
      style={{
        position: 'fixed',
        right: 'clamp(12px, 2vw, 24px)',
        top: 'clamp(70px, 10vh, 90px)',
        bottom: 'clamp(16px, 3vh, 32px)',
        width: 'min(380px, calc(100vw - 28px))',
        background: 'rgba(14, 14, 18, 0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '20px',
        zIndex: 100000,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 1px rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
        pointerEvents: 'auto',
      }}
    >
      {/* ── Chat Header ── */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(255, 255, 255, 0.02)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px', height: '32px', borderRadius: '10px',
            background: 'rgba(140, 21, 21, 0.25)',
            border: '1px solid rgba(140, 21, 21, 0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ef4444',
          }}>
            <MessageSquare size={16} />
          </div>
          <div>
            <h3 style={{
              margin: 0, fontSize: '0.95rem', fontWeight: 700,
              fontFamily: 'var(--font-sinhala)', color: '#fff',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              සජීවී කතිකාවත
              <span style={{
                fontSize: '0.7rem', fontWeight: 600,
                color: '#22c55e', background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.25)',
                padding: '2px 8px', borderRadius: '12px',
              }}>
                Live
              </span>
            </h3>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.5)' }}>
              {viewerCount > 0 ? `${viewerCount.toLocaleString()} viewers online` : 'Active conversation'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          title="Close chat"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: 'none', color: 'rgba(255, 255, 255, 0.7)',
            width: '32px', height: '32px', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; }}
        >
          <X size={18} />
        </button>
      </div>

      {/* ── User Display Name Bar ── */}
      <div style={{
        padding: '10px 18px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(0, 0, 0, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
      }}>
        {userName ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.75)' }}>
            <User size={13} color="var(--primary)" />
            <span>නම: <strong style={{ color: '#fff' }}>{userName}</strong></span>
            {isAdmin && (
              <span style={{
                background: 'rgba(140, 21, 21, 0.4)', color: '#fca5a5',
                fontSize: '0.65rem', fontWeight: 700, padding: '1px 6px',
                borderRadius: '8px', border: '1px solid rgba(220, 38, 38, 0.3)',
              }}>
                ADMIN
              </span>
            )}
          </div>
        ) : (
          <div style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={14} />
            <span>කතිකාවතට එක්වීමට නම ඇතුළත් කරන්න</span>
          </div>
        )}

        <button
          onClick={() => {
            setNameInput(userName);
            setIsEditingName((e) => !e);
          }}
          style={{
            background: 'none', border: 'none',
            color: 'var(--primary)', fontSize: '0.75rem',
            cursor: 'pointer', textDecoration: 'underline',
            fontFamily: 'var(--font-sinhala)',
          }}
        >
          {userName ? 'වෙනස් කරන්න' : 'නම යොදන්න'}
        </button>
      </div>

      {/* ── Name Edit Modal/Dropdown ── */}
      <AnimatePresence>
        {isEditingName && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleSaveName}
            style={{
              padding: '12px 18px',
              background: 'rgba(25, 20, 24, 0.95)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex', gap: '8px',
            }}
          >
            <input
              type="text"
              autoFocus
              placeholder="ඔබේ නම (Your Name)…"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={25}
              style={{
                flex: 1, padding: '8px 12px',
                borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.15)',
                background: 'rgba(0, 0, 0, 0.4)', color: '#fff', fontSize: '0.85rem',
                outline: 'none', fontFamily: 'var(--font-sinhala)',
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--primary)', color: '#fff',
                border: 'none', padding: '8px 14px', borderRadius: '8px',
                fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                fontFamily: 'var(--font-sinhala)',
              }}
            >
              තහවුරු
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* ── Messages List ── */}
      <div
        className="live-chat-scroll"
        style={{
          flex: 1,
          padding: '16px 18px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          scrollBehavior: 'smooth',
        }}
      >
        {messages.length === 0 ? (
          <div style={{
            margin: 'auto 0',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.4)',
            fontSize: '0.85rem',
            padding: '24px 12px',
            fontFamily: 'var(--font-sinhala)',
          }}>
            <Sparkles size={28} color="var(--primary)" style={{ opacity: 0.6, marginBottom: '8px' }} />
            <p style={{ margin: '0 0 6px 0', color: 'rgba(255, 255, 255, 0.7)', fontWeight: 600 }}>
              සජීවී කතිකාවතට සාදරයෙන් පිළිගනිමු!
            </p>
            <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.5 }}>
              දේශනාව පිළිබඳ ඔබේ අදහස් හෝ සාකච්ඡා මෙහි යොමු කළ හැක.
            </p>
          </div>
        ) : (
          messages.map((msg, i) => {
            const isMe = msg.user_name === userName;
            const timeStr = msg.created_at
              ? new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
              : '';

            return (
              <div
                key={msg.id || i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '100%',
                }}
              >
                {/* Sender info */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '3px',
                  fontSize: '0.72rem',
                  color: isMe ? 'var(--primary)' : 'rgba(255, 255, 255, 0.55)',
                }}>
                  {msg.is_admin && <Shield size={11} color="#ef4444" />}
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-sinhala)' }}>
                    {msg.user_name}
                  </span>
                  {timeStr && (
                    <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{timeStr}</span>
                  )}
                </div>

                {/* Message Bubble */}
                <div style={{
                  padding: '9px 14px',
                  borderRadius: isMe ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: isMe
                    ? 'linear-gradient(135deg, rgba(140, 21, 21, 0.9) 0%, rgba(180, 25, 25, 0.85) 100%)'
                    : msg.is_admin
                    ? 'rgba(140, 21, 21, 0.25)'
                    : 'rgba(255, 255, 255, 0.07)',
                  border: `1px solid ${
                    isMe
                      ? 'rgba(220, 38, 38, 0.4)'
                      : msg.is_admin
                      ? 'rgba(220, 38, 38, 0.3)'
                      : 'rgba(255, 255, 255, 0.08)'
                  }`,
                  color: '#fff',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                  fontFamily: 'var(--font-sinhala)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  maxWidth: '88%',
                }}>
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ── Quick Reactions Bar ── */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        background: 'rgba(0, 0, 0, 0.2)',
        display: 'flex',
        gap: '6px',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        flexShrink: 0,
      }}>
        {QUICK_REACTIONS.map((reaction, idx) => (
          <button
            key={idx}
            onClick={() => sendMessage(reaction)}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.85)',
              padding: '4px 10px',
              borderRadius: '16px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-sinhala)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(140, 21, 21, 0.3)'; e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.5)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'; }}
          >
            {reaction}
          </button>
        ))}
      </div>

      {/* ── Input Bar ── */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(10, 10, 14, 0.8)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexShrink: 0,
      }}>
        <input
          type="text"
          placeholder={userName ? 'පණිවිඩයක් ලියන්න…' : 'නම ඇතුළත් කර පණිවිඩයක් යවන්න…'}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={300}
          disabled={sending}
          style={{
            flex: 1,
            padding: '10px 14px',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(255, 255, 255, 0.04)',
            color: '#fff',
            fontSize: '0.88rem',
            outline: 'none',
            fontFamily: 'var(--font-sinhala)',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
          onBlur={e => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
        />

        <button
          onClick={() => sendMessage()}
          disabled={sending || !inputText.trim()}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            border: 'none',
            background: inputText.trim() ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: inputText.trim() ? 'pointer' : 'default',
            transition: 'all 0.2s',
            flexShrink: 0,
          }}
          title="Send message"
        >
          <Send size={16} />
        </button>
      </div>

      <style>{`
        .live-chat-scroll::-webkit-scrollbar {
          width: 5px;
        }
        .live-chat-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .live-chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        .live-chat-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(140, 21, 21, 0.6);
        }
      `}</style>
    </motion.aside>
  );
}

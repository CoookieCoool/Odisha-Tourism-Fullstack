import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../utils/api';
import './Chatbot.css';

const QUICK_REPLIES = [
  'Tell me about Konark', 'Jagannath Temple history', 'Best time to visit',
  'Wildlife in Odisha', 'Famous Odia food', 'Tribal culture'
];

const WELCOME = { role: 'bot', text: '🙏 Namaste! I\'m Kalinga Guide — your AI travel companion for Odisha. Ask me about temples, beaches, wildlife, food, festivals, history, or travel tips!', id: 0 };

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
  useEffect(() => { if (open) setTimeout(() => inputRef.current?.focus(), 300); }, [open]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', text: msg, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Build history for context
    const history = messages.slice(-8).map(m => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      content: m.text
    }));

    try {
      const res = await sendChatMessage(msg, history);
      const botMsg = { role: 'bot', text: res.data.response, id: Date.now() + 1 };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot', text: '🙏 I\'m having trouble connecting. Please check if the server is running and try again.',
        id: Date.now() + 1
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="chat-fab" onClick={() => setOpen(!open)} title="Chat with Kalinga Guide">
        <span>{open ? '✕' : '🙏'}</span>
      </button>

      {open && (
        <div className="chatbot">
          <div className="chat-header">
            <div className="chat-avatar">🕌</div>
            <div>
              <div className="chat-name">Kalinga Guide</div>
              <div className="chat-status">● AI-Powered Odisha Expert</div>
            </div>
            <button className="chat-minimize" onClick={() => setOpen(false)}>–</button>
          </div>

          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div key={msg.id || i} className={`chat-msg ${msg.role}`}>
                {msg.role === 'bot' && <div className="msg-avatar">🕌</div>}
                <div className="msg-bubble">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-msg bot">
                <div className="msg-avatar">🕌</div>
                <div className="msg-bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 2 && (
            <div className="quick-replies">
              {QUICK_REPLIES.map(r => (
                <button key={r} className="quick-reply" onClick={() => send(r)}>{r}</button>
              ))}
            </div>
          )}

          <div className="chat-input-row">
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about Odisha..."
              disabled={loading}
            />
            <button className="chat-send" onClick={() => send()} disabled={loading || !input.trim()}>➤</button>
          </div>
        </div>
      )}
    </>
  );
}

import { useCallback } from 'react';
import type { SalesItem } from '../../types';
import { useChatConsultant } from '../../hooks/useChatConsultant';
import './ChatConsultant.css';

interface ChatConsultantProps {
  contextItems?: SalesItem[];
}

export default function ChatConsultant({ contextItems = [] }: ChatConsultantProps) {
  const { messages, input, setInput, isTyping, sendMessage } = useChatConsultant(contextItems);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <div className="glass-card chat-card animate-fade-in-up stagger-5">
      <div className="section-title">
        Konsultan Bisnis AI
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chat-bubble ${msg.role}`}>
            <p>{msg.content}</p>
          </div>
        ))}
        {isTyping && (
          <div className="chat-bubble assistant typing">
            <span className="dot" />
            <span className="dot" />
            <span className="dot" />
          </div>
        )}
      </div>

      <div className="chat-input-bar">
        <input
          className="glass-input chat-field"
          type="text"
          placeholder="Tanya apa saja tentang bisnis..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="btn-primary send-btn"
          onClick={sendMessage}
          disabled={!input.trim()}
          type="button"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}

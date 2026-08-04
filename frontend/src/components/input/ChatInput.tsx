import './ChatInput.css';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CLEAN_PLACEHOLDER = `Contoh:
Hari ini laku:
- Mie instan 24 dus, jual 3500 modal 2800
- Kangkung 15 ikat, jual 3000 modal 1500
- Sabun mandi 36 batang, jual 4000 modal 3200`;

export default function ChatInput({ value, onChange }: ChatInputProps) {
  return (
    <div className="chat-input-wrapper animate-fade-in-up">
      <div className="figma-glass-pill-container">
        <textarea
          id="chat-input"
          className="figma-chat-textarea"
          placeholder={CLEAN_PLACEHOLDER}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
        />
      </div>
      <p className="input-hint">
        Ketik penjualan dengan bahasa sehari-hari. DagangAI akan memahaminya secara otomatis.
      </p>
    </div>
  );
}

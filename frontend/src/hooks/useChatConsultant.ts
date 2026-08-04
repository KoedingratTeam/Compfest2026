import { useState, useCallback } from 'react';
import type { ChatMessage, SalesItem } from '../types';
import { sendChatConsultMessage } from '../services/api';

const INITIAL_WELCOME_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Halo, saya DagangAI asisten bisnis Anda. Silakan tanyakan hal seputar analisis penjualan atau strategi warung Anda.',
    timestamp: new Date(),
  },
];

export function useChatConsultant(contextItems: SalesItem[] = []) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_WELCOME_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const replyText = await sendChatConsultMessage(trimmed, contextItems);
      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: replyText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: 'Maaf, terjadi masalah koneksi. Fokus utama saat ini adalah mengoptimalkan penjualan barang dengan profit margin tertinggi.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [input, contextItems]);

  return {
    messages,
    input,
    setInput,
    isTyping,
    sendMessage,
  };
}

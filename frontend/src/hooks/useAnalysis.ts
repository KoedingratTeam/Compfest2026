import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { InputMode, SalesItem, AnalysisResult } from '../types';
import { MOCK_ANALYSIS, MOCK_SALES_ITEMS } from '../data/mockData';
import { analyzeSalesData, parseChatInput } from '../services/api';

// Shared state module store
let currentAnalysisResult: AnalysisResult = MOCK_ANALYSIS;

export function getLatestAnalysis(): AnalysisResult {
  return currentAnalysisResult;
}

export function useAnalysis() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<InputMode>('chat');
  const [chatText, setChatText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit =
    activeTab === 'chat'
      ? chatText.trim().length > 0
      : true;

  const handleAnalyze = useCallback(
    async (formItems: SalesItem[]) => {
      setIsLoading(true);
      setError(null);

      try {
        let itemsToAnalyze = formItems;

        if (activeTab === 'chat' && chatText.trim()) {
          itemsToAnalyze = await parseChatInput(chatText);
        }

        const result = await analyzeSalesData(itemsToAnalyze);
        currentAnalysisResult = result;

        navigate('/result');
      } catch (err) {
        console.error('Failed to analyze sales data:', err);
        setError('Gagal menganalisis data. Menggunakan data default.');
        currentAnalysisResult = MOCK_ANALYSIS;
        navigate('/result');
      } finally {
        setIsLoading(false);
      }
    },
    [activeTab, chatText, navigate]
  );

  return {
    activeTab,
    setActiveTab,
    chatText,
    setChatText,
    isLoading,
    error,
    canSubmit,
    handleAnalyze,
  };
}

import { useCallback } from 'react';
import type { SalesItem } from '../types';
import { useAnalysis } from '../hooks/useAnalysis';
import { useFormInput } from '../hooks/useFormInput';
import TabSwitcher from '../components/input/TabSwitcher';
import ChatInput from '../components/input/ChatInput';
import FormInput from '../components/input/FormInput';
import OCRUpload from '../components/input/OCRUpload';

export default function InputPage() {
  const {
    activeTab,
    setActiveTab,
    chatText,
    setChatText,
    isLoading,
    canSubmit,
    handleAnalyze,
  } = useAnalysis();

  const { items: formItems, setItems: setFormItems, updateItem, addRow, removeRow } = useFormInput();

  const handleScanSuccess = useCallback(
    (scannedItems: SalesItem[]) => {
      setFormItems(scannedItems);
      setActiveTab('form');
    },
    [setFormItems, setActiveTab]
  );

  return (
    <div className="page-content input-page">
      <div className="hero-section animate-fade-in-up">
        <h1 className="hero-title">Analisis Penjualan Cerdas</h1>
        <p className="hero-subtitle">
          Masukkan data penjualan harian via chat, tabel, atau foto nota/struk belanja.
          Dapatkan insight bisnis & rekomendasi AI dalam hitungan detik.
        </p>
      </div>

      <div className="input-container animate-fade-in-up stagger-2">
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'chat' && <ChatInput value={chatText} onChange={setChatText} />}

        {activeTab === 'form' && (
          <FormInput
            items={formItems}
            updateItem={updateItem}
            addRow={addRow}
            removeRow={removeRow}
          />
        )}

        {activeTab === 'ocr' && <OCRUpload onScanSuccess={handleScanSuccess} />}

        {activeTab !== 'ocr' && (
          <button
            className={`btn-primary analyze-btn ${isLoading ? 'loading' : ''}`}
            onClick={() => handleAnalyze(formItems)}
            disabled={!canSubmit || isLoading}
            type="button"
          >
            {isLoading ? 'Menganalisis...' : 'Analisis Sekarang'}
          </button>
        )}
      </div>
    </div>
  );
}

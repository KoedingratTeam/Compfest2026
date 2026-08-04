import { useState, useRef, useCallback } from 'react';
import type { SalesItem } from '../../types';
import { scanReceiptImage } from '../../services/api';
import './OCRUpload.css';

interface OCRUploadProps {
  onScanSuccess: (items: SalesItem[]) => void;
}

export default function OCRUpload({ onScanSuccess }: OCRUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = useCallback((selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      alert('Mohon pilih file gambar (JPG, PNG, WEBP).');
      return;
    }
    setFile(selectedFile);
    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        handleFileChange(e.dataTransfer.files[0]);
      }
    },
    [handleFileChange]
  );

  const handleScan = useCallback(async () => {
    if (!file) return;
    setIsScanning(true);
    try {
      const items = await scanReceiptImage(file);
      onScanSuccess(items);
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setIsScanning(false);
    }
  }, [file, onScanSuccess]);

  const clearFile = useCallback(() => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [previewUrl]);

  return (
    <div className="ocr-upload-wrapper animate-fade-in-up">
      <div
        className={`ocr-dropzone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !file && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="file-input-hidden"
          onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
        />

        {previewUrl ? (
          <div className="preview-container">
            <img src={previewUrl} alt="Preview Nota" className="receipt-preview-img" />
            <button className="remove-photo-btn" onClick={clearFile} type="button" title="Ganti foto">
              ✕
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <p className="upload-title">Upload atau Drop Foto Struk / Nota Fisik</p>
            <p className="upload-subtitle">Format gambar (JPG, PNG, WEBP) hingga 10MB</p>
          </div>
        )}
      </div>

      {file && (
        <button
          className={`btn-primary scan-action-btn ${isScanning ? 'loading' : ''}`}
          onClick={handleScan}
          disabled={isScanning}
          type="button"
        >
          {isScanning ? 'Membaca Struk...' : 'Ekstrak Data dari Struk'}
        </button>
      )}
    </div>
  );
}

import { useState, useCallback } from 'react';
import type { SalesItem } from '../types';

const INITIAL_EMPTY_ROW: SalesItem[] = [
  {
    id: crypto.randomUUID(),
    nama: '',
    jumlah: 0,
    hargaJual: 0,
    hargaModal: 0,
  },
];

export function useFormInput(initialItems: SalesItem[] = INITIAL_EMPTY_ROW) {
  const [items, setItems] = useState<SalesItem[]>(initialItems);

  const updateItem = useCallback(
    (id: string, field: keyof SalesItem, value: string | number) => {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
      );
    },
    []
  );

  const addRow = useCallback(() => {
    const newItem: SalesItem = {
      id: crypto.randomUUID(),
      nama: '',
      jumlah: 0,
      hargaJual: 0,
      hargaModal: 0,
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  const removeRow = useCallback((id: string) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((item) => item.id !== id) : prev));
  }, []);

  return {
    items,
    setItems,
    updateItem,
    addRow,
    removeRow,
  };
}

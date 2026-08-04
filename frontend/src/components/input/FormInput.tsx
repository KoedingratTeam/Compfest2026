import type { SalesItem } from '../../types';
import './FormInput.css';

interface FormInputProps {
  items: SalesItem[];
  updateItem: (id: string, field: keyof SalesItem, value: string | number) => void;
  addRow: () => void;
  removeRow: (id: string) => void;
}

export default function FormInput({ items, updateItem, addRow, removeRow }: FormInputProps) {
  return (
    <div className="form-input-wrapper animate-fade-in-up">
      <div className="form-table-scroll">
        <table className="form-table">
          <thead>
            <tr>
              <th>Nama Barang</th>
              <th>Jumlah</th>
              <th>Harga Jual</th>
              <th>Harga Modal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <input
                    className="glass-input table-input"
                    type="text"
                    value={item.nama}
                    onChange={(e) => updateItem(item.id, 'nama', e.target.value)}
                    placeholder="cth: Mie Instan"
                  />
                </td>
                <td>
                  <input
                    className="glass-input table-input input-number"
                    type="number"
                    value={item.jumlah || ''}
                    onChange={(e) => updateItem(item.id, 'jumlah', Number(e.target.value))}
                    placeholder="0"
                    min="0"
                  />
                </td>
                <td>
                  <input
                    className="glass-input table-input input-number"
                    type="number"
                    value={item.hargaJual || ''}
                    onChange={(e) => updateItem(item.id, 'hargaJual', Number(e.target.value))}
                    placeholder="Rp"
                    min="0"
                  />
                </td>
                <td>
                  <input
                    className="glass-input table-input input-number"
                    type="number"
                    value={item.hargaModal || ''}
                    onChange={(e) => updateItem(item.id, 'hargaModal', Number(e.target.value))}
                    placeholder="Rp"
                    min="0"
                  />
                </td>
                <td>
                  <button
                    className="remove-btn"
                    onClick={() => removeRow(item.id)}
                    disabled={items.length <= 1}
                    type="button"
                    title="Hapus baris"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-secondary add-row-btn" onClick={addRow} type="button">
        Tambah Baris
      </button>
    </div>
  );
}

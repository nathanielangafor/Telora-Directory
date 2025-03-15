// components/AddContactModal.js
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './AddContactModal.module.css';

export default function AddContactModal({ formData, onInputChange, onFileChange, onAdd, onClose, isAdding }) {
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  if (!mounted) return null;

  return createPortal(
    <div className={`${styles.overlay} ${exiting ? styles.exit : ''}`} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Add Contact</h2>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            Position <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={onInputChange}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            Cohort <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="cohort"
            value={formData.cohort}
            onChange={onInputChange}
            className={styles.inputField}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            value={formData.linkedin}
            onChange={onInputChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Photo</label>
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={onFileChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.cancelButton} onClick={handleClose}>
            Cancel
          </button>
          <button className={styles.addButton} onClick={onAdd} disabled={isAdding}>
            {isAdding ? 'Adding...' : 'Add Contact'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

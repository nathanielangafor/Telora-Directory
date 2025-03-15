import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './EditModal.module.css';

export default function EditModal({ formData, onInputChange, onFileChange, onSave, onDelete, onClose, isSaving }) {
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => onClose(), 300);
  };

  if (!mounted) return null;

  return createPortal(
    <div className={`${styles.overlay} ${exiting ? styles.exit : ''}`} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>Edit Founder</h2>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Position</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={onInputChange}
            className={styles.inputField}
          />
        </div>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>Cohort</label>
          <input
            type="text"
            name="cohort"
            value={formData.cohort}
            onChange={onInputChange}
            className={styles.inputField}
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
        <div className={styles.buttonContainer}>
          <div className={styles.leftButtons}>
            <button className={styles.deleteButton} onClick={onDelete}>
              Delete
            </button>
          </div>
          <div className={styles.rightButtons}>
            <button className={styles.cancelButton} onClick={handleClose}>
              Cancel
            </button>
            <button className={styles.saveButton} onClick={onSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

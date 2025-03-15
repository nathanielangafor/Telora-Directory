import { useState } from 'react';
import EditModal from './EditModal';
import styles from './FounderCard.module.css';

export default function FounderCard({ founder }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: founder.name,
    position: founder.position,
    cohort: founder.cohort,
    linkedin: founder.linkedin,
    phone: founder.phone,
    image: founder.image,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/updateFounder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: founder.id, ...formData }),
      });
      if (res.ok) {
        setShowModal(false);
      } else {
        console.error('Error updating founder');
      }
    } catch (error) {
      console.error('Error updating founder', error);
    }
    setIsSaving(false);
  };

  const deleteContact = async () => {
    const password = window.prompt("Enter password to delete this contact:");
    if (password !== "S25") {
      alert("Incorrect password.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this contact?")) return;
    try {
      const res = await fetch('/api/deleteFounder', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: founder.id }),
      });
      if (res.ok) {
        setShowModal(false);
        window.location.reload();
      } else {
        console.error("Error deleting founder");
      }
    } catch (error) {
      console.error("Error deleting founder", error);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.editIcon} onClick={() => setShowModal(true)}>
        ✎
      </div>
      <img src={formData.image} alt={formData.name} className={styles.avatar} />
      <h2>{formData.name}</h2>
      <p className={styles.position}>{formData.position}</p>
      <p className={styles.phone}>Phone: {formData.phone}</p>
      <p className={styles.cohort}>Cohort: {formData.cohort}</p>
      <a href={formData.linkedin} target="_blank" rel="noopener noreferrer">
        View on LinkedIn
      </a>
      {showModal && (
        <EditModal
          formData={formData}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
          onSave={saveChanges}
          onDelete={deleteContact}
          onClose={() => setShowModal(false)}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}

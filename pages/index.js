// pages/index.js
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import clientPromise from '../lib/mongodb';

// Define text limits for each field
const fieldLimits = {
  name: 50,
  position: 50,
  summary: 300,
  linkedin: 100,
  email: 100,
  github: 100,
  x: 100,
  phone: 20,
  otherWebsite: 100, // new field limit
};

// --- getServerSideProps ---
export async function getServerSideProps() {
  const placeholderImage =
    'https://scontent-lga3-2.xx.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s480x480&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_ohc=wOXUzZhUIhAQ7kNvgEi4RXI&_nc_oc=AdhzmH63wsQMW-Wpzz8fCzAXLHdrOkcmyzeCHZc66pjMfyRcEiuGVL-to2Q7J6PXgdU&_nc_zt=24&_nc_ht=scontent-lga3-2.xx&_nc_gid=FAEEVj02QwIqCAubc-hcBA&oh=00_AYFmBJEdinsFdRwORCX3w-zKykcOOjwXO0HfmOQgU18beQ&oe=67FC5CBA';

  const dummyData = [
    {
      name: 'Zach Nguyen',
      position: 'CTO @ Catalyst',
      linkedin: 'https://www.linkedin.com/in/zach-nguyen/',
      phone: '+1(585) 710-8726',
      image: placeholderImage,
      email: 'zach@example.com',
      github: 'https://github.com/zachnguyen',
      x: 'https://x.com/zachnguyen',
      summary:
        "Zach Nguyen is the Chief Technology Officer at Catalyst. With extensive experience in tech leadership and innovation, he drives cutting-edge solutions in the digital landscape.",
      otherWebsite: 'https://example.com', // new field sample
    },
    {
      name: 'Nathaniel Angafor',
      position: 'CEO @ Catalyst',
      linkedin: 'https://www.linkedin.com/in/janesmith/',
      phone: '+1(240) 437-7557',
      image: placeholderImage,
      email: 'nathaniel@example.com',
      github: 'https://github.com/nathanielangafor',
      x: 'https://x.com/nathanielangafor',
      summary:
        "Nathaniel Angafor is the Chief Executive Officer at Catalyst, spearheading strategic growth and sustainability with a keen focus on innovative business solutions.",
      otherWebsite: '', // empty by default
    },
  ];

  const client = await clientPromise;
  const db = client.db();

  const count = await db.collection('founders').countDocuments();
  if (count === 0) {
    await db.collection('founders').insertMany(dummyData);
  }
  const founders = await db.collection('founders').find({}).toArray();

  const formattedFounders = founders.map((f) => ({
    id: f._id.toString(),
    name: f.name,
    position: f.position,
    linkedin: f.linkedin,
    phone: f.phone,
    image: f.image,
    email: f.email,
    github: f.github,
    x: f.x,
    summary: f.summary,
    otherWebsite: f.otherWebsite, // pass along new field
  }));

  return {
    props: { founders: formattedFounders },
  };
}

// --- AutofillLinkedinModal Component ---
function AutofillLinkedinModal({ linkedinUrl, onInputChange, onAutofill, onFillManually, onClose, isAutofilling }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Autofill with Linkedin</h2>
        <div className="inputGroup">
          <label className="inputLabel">LinkedIn URL</label>
          <input
            type="text"
            name="linkedin"
            value={linkedinUrl}
            onChange={onInputChange}
            className="inputField"
          />
        </div>
        <div className="buttonContainer">
          <div className="leftButtons">
            <button 
              className="fillManuallyButton" 
              onClick={(e) => { e.preventDefault(); onFillManually(); }}
            >
              Fill Manually
            </button>
          </div>
          <div className="rightButtons">
            <button className="addButton" onClick={onAutofill} disabled={isAutofilling}>
              {isAutofilling ? 'Autofilling...' : 'Autofill'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// --- AddContactModal Component ---
function AddContactModal({ formData, onInputChange, onFileChange, onAdd, onClose, isAdding }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Add Contact</h2>
        <div className="inputGroup">
          <label className="inputLabel">
            Name <span className="required">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            className="inputField"
            required
            maxLength={fieldLimits.name}
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">
            Position <span className="required">*</span>
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={onInputChange}
            className="inputField"
            required
            maxLength={fieldLimits.position}
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Summary</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={onInputChange}
            className="inputField"
            maxLength={fieldLimits.summary}
            placeholder="Enter a brief summary (max 300 characters)"
            rows="3"
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">LinkedIn</label>
          <input
            type="text"
            name="linkedin"
            value={formData.linkedin}
            onChange={onInputChange}
            className="inputField"
            maxLength={fieldLimits.linkedin}
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            className="inputField"
            maxLength={fieldLimits.email}
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">GitHub</label>
          <input
            type="text"
            name="github"
            value={formData.github}
            onChange={onInputChange}
            className="inputField"
            maxLength={fieldLimits.github}
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">X</label>
          <input
            type="text"
            name="x"
            value={formData.x}
            onChange={onInputChange}
            className="inputField"
            maxLength={fieldLimits.x}
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Other Website</label>
          <input
            type="text"
            name="otherWebsite"
            value={formData.otherWebsite}
            onChange={onInputChange}
            className="inputField"
            maxLength={fieldLimits.otherWebsite}
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={onInputChange}
            className="inputField"
            maxLength={fieldLimits.phone}
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Photo</label>
          <input type="file" name="photo" accept="image/*" onChange={onFileChange} className="inputField" />
          {formData.photoAutoFilled && (
            <div className="photoIndicator">Photo auto-filled from LinkedIn</div>
          )}
        </div>
        <div className="buttonGroup">
          <button className="cancelButton" onClick={onClose}>Cancel</button>
          <button className="addButton" onClick={onAdd} disabled={isAdding}>
            {isAdding ? 'Adding...' : 'Add Contact'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

// --- EditModal Component ---
function EditModal({ formData, onInputChange, onFileChange, onSave, onDelete, onClose, isSaving }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Founder</h2>
        <div className="inputGroup">
          <label className="inputLabel">Name</label>
          <input type="text" name="name" value={formData.name} onChange={onInputChange} className="inputField" maxLength={fieldLimits.name} />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Position</label>
          <input type="text" name="position" value={formData.position} onChange={onInputChange} className="inputField" maxLength={fieldLimits.position} />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Summary</label>
          <textarea
            name="summary"
            value={formData.summary}
            onChange={onInputChange}
            className="inputField"
            maxLength={fieldLimits.summary}
            placeholder="Enter a brief summary (max 300 characters)"
            rows="3"
          />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">LinkedIn</label>
          <input type="text" name="linkedin" value={formData.linkedin} onChange={onInputChange} className="inputField" maxLength={fieldLimits.linkedin} />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Email</label>
          <input type="email" name="email" value={formData.email} onChange={onInputChange} className="inputField" maxLength={fieldLimits.email} />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">GitHub</label>
          <input type="text" name="github" value={formData.github} onChange={onInputChange} className="inputField" maxLength={fieldLimits.github} />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">X</label>
          <input type="text" name="x" value={formData.x} onChange={onInputChange} className="inputField" maxLength={fieldLimits.x} />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Other Website</label>
          <input type="text" name="otherWebsite" value={formData.otherWebsite} onChange={onInputChange} className="inputField" maxLength={fieldLimits.otherWebsite} />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Phone</label>
          <input type="text" name="phone" value={formData.phone} onChange={onInputChange} className="inputField" maxLength={fieldLimits.phone} />
        </div>
        <div className="inputGroup">
          <label className="inputLabel">Photo</label>
          <input type="file" name="photo" accept="image/*" onChange={onFileChange} className="inputField" />
        </div>
        <div className="buttonContainer">
          <div className="leftButtons">
            <button className="deleteButton" onClick={onDelete}>Delete</button>
          </div>
          <div className="rightButtons">
            <button className="cancelButton" onClick={onClose}>Cancel</button>
            <button className="saveButton" onClick={() => { onSave(); onClose(); }} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

// --- FounderCard Component ---
function FounderCard({ founder }) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: founder.name,
    position: founder.position,
    linkedin: founder.linkedin,
    phone: founder.phone,
    image: founder.image,
    email: founder.email,
    github: founder.github,
    x: founder.x,
    summary: founder.summary,
    otherWebsite: founder.otherWebsite, // new field
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (value.length > fieldLimits[name]) {
      e.target.classList.add('limit-hit');
      setTimeout(() => e.target.classList.remove('limit-hit'), 300);
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData((prev) => ({ ...prev, image: reader.result }));
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
    <div className="card">
      <div className="editIcon" onClick={() => setShowModal(true)}>
        &#9998;
      </div>
      <div className="card-header">
        <img src={formData.image} alt={formData.name} className="avatar" />
        <h2>{formData.name}</h2>
        <p className="position">{formData.position}</p>
      </div>
      <div className="card-body">
        <p className="summary">{formData.summary || "No summary provided."}</p>
      </div>
      <div className="card-footer">
        <div className="contactIcons">
          {formData.phone && (
            <a href={`tel:${formData.phone}`} title={formData.phone}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-phone">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.1 4.18 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.72 12.06 12.06 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.06 12.06 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </a>
          )}
          {formData.email && (
            <a href={`mailto:${formData.email}`} title="Email">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-mail">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          )}
          {formData.github && (
            <a href={formData.github} target="_blank" rel="noopener noreferrer" title="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="icon icon-github" viewBox="0 0 24 24">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.41 7.84 10.94.57.11.78-.25.78-.56 0-.28-.01-1.02-.01-2-3.19.69-3.87-1.54-3.87-1.54-.52-1.31-1.27-1.66-1.27-1.66-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.74 2.68 1.24 3.33.95.1-.74.4-1.24.73-1.52-2.55-.29-5.23-1.27-5.23-5.65 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.15 1.17.91-.25 1.88-.38 2.85-.38.97 0 1.94.13 2.85.38 2.19-1.48 3.15-1.17 3.15-1.17.62 1.59.23 2.77.11 3.06.73.8 1.18 1.82 1.18 3.07 0 4.39-2.69 5.35-5.24 5.65.41.35.77 1.04.77 2.1 0 1.52-.01 2.75-.01 3.12 0 .31.2.67.79.56A10.51 10.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/>
              </svg>
            </a>
          )}
          {formData.x && (
            <a href={formData.x} target="_blank" rel="noopener noreferrer" title="X">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="icon icon-x" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.43 1a9.09 9.09 0 0 1-2.88 1.1 4.52 4.52 0 0 0-7.7 4.13A12.8 12.8 0 0 1 1.67 2.16a4.51 4.51 0 0 0 1.4 6.04A4.41 4.41 0 0 1 .96 7.1v.05a4.52 4.52 0 0 0 3.62 4.42 4.52 4.52 0 0 1-2.04.08 4.53 4.53 0 0 0 4.23 3.14A9.07 9.07 0 0 1 .67 19.54a12.8 12.8 0 0 0 6.92 2.03c8.3 0 12.84-6.87 12.84-12.84 0-.2 0-.39-.02-.58A9.2 9.2 0 0 0 23 3z"/>
              </svg>
            </a>
          )}
          {formData.linkedin && (
            <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="icon icon-linkedin" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
          )}
          {formData.otherWebsite && (
            <a href={formData.otherWebsite} target="_blank" rel="noopener noreferrer" title="Other Website">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-link">
                <path d="M10 13a5 5 0 0 0 7 7l4-4a5 5 0 0 0-7-7"/>
                <path d="M14 11a5 5 0 0 0-7-7L3 8a5 5 0 0 0 7 7"/>
              </svg>
            </a>
          )}
        </div>
      </div>
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

// --- Main Home Component ---
export default function Home({ founders }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAutofillModal, setShowAutofillModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAutofilling, setIsAutofilling] = useState(false);
  const [autofillLinkedinUrl, setAutofillLinkedinUrl] = useState('');
  const [addFormData, setAddFormData] = useState({
    name: '',
    position: '',
    linkedin: '',
    phone: '',
    image: '',
    email: '',
    github: '',
    x: '',
    summary: '',
    otherWebsite: '', // new field
    photoAutoFilled: false,
  });

  // Handler for manual add modal input changes
  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    if (value.length > fieldLimits[name]) {
      e.target.classList.add('limit-hit');
      setTimeout(() => e.target.classList.remove('limit-hit'), 300);
      return;
    }
    setAddFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for file input in add modal
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAddFormData((prev) => ({ ...prev, image: reader.result, photoAutoFilled: false }));
      reader.readAsDataURL(file);
    }
  };

  // Function to add a contact after manual entry (or autofilled data)
  const addContact = async () => {
    if (!addFormData.name || !addFormData.position) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsAdding(true);
    const defaultImage =
      'https://scontent-lga3-2.xx.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s480x480&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_ohc=wOXUzZhUIhAQ7kNvgEi4RXI&_nc_oc=AdhzmH63wsQMW-Wpzz8fCzAXLHdrOkcmyzeCHZc66pjMfyRcEiuGVL-to2Q7J6PXgdU&_nc_zt=24&_nc_ht=scontent-lga3-2.xx&_nc_gid=FAEEVj02QwIqCAubc-hcBA&oh=00_AYFmBJEdinsFdRwORCX3w-zKykcOOjwXO0HfmOQgU18beQ&oe=67FC5CBA';
    
    const newContact = { ...addFormData, image: addFormData.image || defaultImage };
    try {
      const res = await fetch('/api/addFounder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newContact),
      });
      if (res.ok) {
        setShowAddModal(false);
        window.location.reload();
      } else {
        console.error('Error adding contact');
      }
    } catch (error) {
      console.error('Error adding contact', error);
    }
    setIsAdding(false);
  };

  // Handler for input change in the autofill modal
  const handleAutofillInputChange = (e) => {
    setAutofillLinkedinUrl(e.target.value);
  };

  // Updated handler for autofilling using the provided LinkedIn URL.
  const handleAutofill = async () => {
    if (!autofillLinkedinUrl) return;
    setIsAutofilling(true);
    try {
      const res = await fetch(
        `https://famous-resolved-ray.ngrok-free.app/linkedin_profile?linkedin_url=${encodeURIComponent(autofillLinkedinUrl)}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true"
          }
        }
      );
      if (res.ok) {
        const data = await res.json();
        let imageData = data.profile_picture_url || '';
        if (data.profile_picture_url) {
          try {
            const imageRes = await fetch(data.profile_picture_url);
            const blob = await imageRes.blob();
            imageData = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = () => reject('Error converting image');
              reader.readAsDataURL(blob);
            });
          } catch (imageError) {
            console.error('Error fetching/converting image:', imageError);
          }
        }
        setAddFormData({
          name: `${data.first_name} ${data.last_name}`,
          position: data.position || '',
          linkedin: autofillLinkedinUrl,
          phone: data.phone_number || '',
          image: imageData,
          email: data.email || '',
          github: data.github || '',
          x: data.X || '',
          summary: data.summary || '',
          otherWebsite: data.otherWebsite || '',
          photoAutoFilled: !!imageData,
        });
        setShowAutofillModal(false);
        setShowAddModal(true);
      } else {
        alert("Error autofilling from LinkedIn.");
      }
    } catch (error) {
      console.error("Error in autofill", error);
      alert("Error autofilling from LinkedIn.");
    }
    setIsAutofilling(false);
  };
  

  // When user clicks "Add Contact" button, show the autofill modal first
  const handleAddContactClick = () => {
    setAutofillLinkedinUrl('');
    setShowAutofillModal(true);
  };

  // If user opts to "fill manually" from the autofill modal, close the autofill modal and open the manual modal
  const handleFillManually = () => {
    setShowAutofillModal(false);
    setShowAddModal(true);
  };

  // New handler for closing the autofill modal (clicking outside)
  const handleAutofillClose = () => {
    setShowAutofillModal(false);
    setIsAutofilling(false);
  };

  const filteredFounders = founders.filter((founder) =>
    founder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    founder.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    founder.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (founder.email && founder.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (founder.github && founder.github.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (founder.x && founder.x.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <>
      <Head>
        <title>Telora Directory - Founders</title>
        <meta name="description" content="A directory of founders with their LinkedIn information." />
        <link rel="icon" href="https://i.ibb.co/1tYDGT4b/1686960057216.jpg" />
      </Head>
      <main className="container">
        <div className="banner">
          <img src="https://images.squarespace-cdn.com/content/v1/6462c44371c5e61841cb2b84/859405d1-03f7-43c2-adcb-3be4d781265a/telora_home.jpg?format=2500w" alt="Catalyst Banner" />
        </div>
        <header className="header">
          <h1>Telora Directory</h1>
          <p>Founders &amp; Their Contact Information</p>
        </header>
        <div className="search-container">
          <input type="text" placeholder="Search founders..." className="search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <section className="founders">
          {filteredFounders.map((founder) => (
            <FounderCard key={founder.id} founder={founder} />
          ))}
        </section>
        <br></br>
        <br></br>
      </main>
      <footer className="footer">
        <div className="footer-left">
          Brought to you by team Catalyst <span className="heart">&lt;3</span>
        </div>
        <div className="footer-right">
          <button className="addContactButton" onClick={handleAddContactClick}>Add Contact</button>
        </div>
      </footer>
      {showAutofillModal && (
        <AutofillLinkedinModal
          linkedinUrl={autofillLinkedinUrl}
          onInputChange={handleAutofillInputChange}
          onAutofill={handleAutofill}
          onFillManually={handleFillManually}
          onClose={handleAutofillClose}
          isAutofilling={isAutofilling}
        />
      )}
      {showAddModal && (
        <AddContactModal
          formData={addFormData}
          onInputChange={handleAddInputChange}
          onFileChange={handleFileChange}
          onAdd={addContact}
          onClose={() => setShowAddModal(false)}
          isAdding={isAdding}
        />
      )}

      {/* Global Styles */}
      <style jsx global>{`
        /* Global */
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
          background-color: #000;
          color: #f5f5f5;
        }
        * {
          box-sizing: border-box;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }
        /* Banner */
        .banner {
          width: 100%;
          margin-bottom: 2rem;
        }
        .banner img {
          width: 100%;
          max-height: 250px;
          object-fit: cover;
          border-radius: 8px;
        }
        /* Header */
        .header {
          text-align: center;
          margin-bottom: 2rem;
        }
        /* Search */
        .search-container {
          display: flex;
          justify-content: center;
          margin-bottom: 2rem;
        }
        .search-input {
          width: 100%;
          max-width: 400px;
          padding: 0.5rem;
          border: 1px solid #333;
          border-radius: 4px;
          background: #1e1e1e;
          color: #f5f5f5;
        }
        .search-input:focus {
          outline: none;
          border-color: #555;
        }
        .search-input::placeholder {
          color: #888;
        }
        /* Founders Grid */
        .founders {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        /* Responsive Grid for Mobile */
        @media (max-width: 768px) {
          .founders {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 480px) {
          .founders {
            grid-template-columns: 1fr;
          }
        }
        /* Footer */
        .footer {
          position: fixed;
          bottom: 10px;
          left: 10px;
          right: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.8rem;
          color: #888;
          background: rgba(0, 0, 0, 0.6);
          padding: 0.5rem 1rem;
          border-radius: 4px;
          z-index: 100;
        }
        .footer .heart {
          color: red;
        }
        .addContactButton {
          background: #4ea1d3;
          color: #fff;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .addContactButton:hover {
          background: #6fb9e0;
        }
        /* Modal */
        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s forwards;
        }
        .modal {
          background: #1e1e1e;
          border-radius: 8px;
          padding: 1.5rem;
          width: 90%;
          max-width: 400px;
          animation: slideIn 0.3s forwards;
        }
        .inputGroup {
          margin-bottom: 0.5rem;
        }
        .inputLabel {
          display: block;
          font-size: 0.8rem;
          color: #888;
          margin-bottom: 0.2rem;
        }
        .required {
          color: red;
        }
        .inputField {
          width: 100%;
          padding: 0.4rem;
          border: 1px solid #333;
          border-radius: 4px;
          background: #1e1e1e;
          color: #f5f5f5;
        }
        .inputField.limit-hit {
          border-color: red;
          animation: shake 0.3s ease;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-2px); }
          50% { transform: translateX(2px); }
          75% { transform: translateX(-2px); }
          100% { transform: translateX(0); }
        }
        .buttonGroup,
        .buttonContainer {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .leftButtons {
          flex: 1;
        }
        .rightButtons {
          display: flex;
          gap: 1rem;
        }
        .cancelButton {
          background: #555;
          color: #fff;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
        }
        .addButton,
        .saveButton {
          background: #4ea1d3;
          color: #fff;
          border: none;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .addButton:hover,
        .saveButton:hover {
          background: #6fb9e0;
        }
        .deleteButton {
          background: transparent;
          border: 1px solid red;
          color: red;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .deleteButton:hover {
          background: rgba(255, 0, 0, 0.1);
        }
        /* Fill Manually Button */
        .fillManuallyButton {
          background: transparent;
          border: 1px solid #4ea1d3;
          color: #4ea1d3;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s ease;
        }
        .fillManuallyButton:hover {
          background: rgba(78, 161, 211, 0.1);
        }
        /* Photo Indicator */
        .photoIndicator {
          margin-top: 0.3rem;
          font-size: 0.8rem;
          color: #4ea1d3;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { transform: translateY(-20px); }
          to { transform: translateY(0); }
        }
        /* Redesigned Card */
        .card {
          background: #2a2a2a;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
          padding: 1.5rem;
          transition: transform 0.3s ease;
          position: relative;
          display: flex;
          flex-direction: column;
          height: 400px;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .card-header {
          text-align: center;
          margin-bottom: 0.75rem;
        }
        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #000;
          margin-bottom: 0.75rem;
        }
        .card-header h2 {
          margin: 0.5rem 0 0.25rem;
          font-size: 1.5rem;
          color: #f5f5f5;
        }
        .card-header .position {
          font-size: 1rem;
          color: #ccc;
          margin: 0;
        }
        .card-body {
          flex-grow: 1;
          width: 100%;
          overflow: auto;
        }
        .card-body .summary {
          font-size: 0.9rem;
          color: #bbb;
          line-height: 1.4;
          margin: 0.75rem 0;
          max-height: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .card-footer {
          width: 100%;
          margin-top: auto;
        }
        .contactIcons {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-top: 1rem;
        }
        .contactIcons a {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #333;
          border-radius: 50%;
          transition: transform 0.3s ease, background-color 0.3s ease;
          color: #f5f5f5;
        }
        .contactIcons a:hover {
          transform: scale(1.1);
          background: #4ea1d3;
        }
        .editIcon {
          position: absolute;
          top: 8px;
          right: 8px;
          cursor: pointer;
          font-size: 1.2rem;
          color: #888;
        }
      `}</style>
    </>
  );
}

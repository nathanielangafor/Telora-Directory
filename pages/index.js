// pages/index.js
import Head from 'next/head';
import { useState } from 'react';
import FounderCard from '../components/FounderCard';
import AddContactModal from '../components/AddContactModal';
import clientPromise from '../lib/mongodb';

export async function getServerSideProps() {
  const placeholderImage =
    'https://scontent-lga3-2.xx.fbcdn.net/v/t1.30497-1/453178253_471506465671661_2781666950760530985_n.png?stp=dst-png_s480x480&_nc_cat=1&ccb=1-7&_nc_sid=136b72&_nc_ohc=wOXUzZhUIhAQ7kNvgEi4RXI&_nc_oc=AdhzmH63wsQMW-Wpzz8fCzAXLHdrOkcmyzeCHZc66pjMfyRcEiuGVL-to2Q7J6PXgdU&_nc_zt=24&_nc_ht=scontent-lga3-2.xx&_nc_gid=FAEEVj02QwIqCAubc-hcBA&oh=00_AYFmBJEdinsFdRwORCX3w-zKykcOOjwXO0HfmOQgU18beQ&oe=67FC5CBA';

  const dummyData = [
    {
      name: 'Zach Nguyen',
      position: 'CTO @ Talys',
      linkedin: 'https://www.linkedin.com/in/zach-nguyen/',
      cohort: 'S25 Finalist',
      phone: '+1(585) 710-8726',
      image: "https://media.licdn.com/dms/image/v2/D4E03AQEeAp7pQ_k_wg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1693024576612?e=1747267200&v=beta&t=-S2dtg8bOc67l41vfQ96bW2-B1skKTQyfjVKxQxoYXY"
    },
    {
      name: 'Nathaniel Angafor',
      position: 'CEO @ Talys',
      linkedin: 'https://www.linkedin.com/in/janesmith/',
      cohort: 'S25 Finalist',
      phone: '+1(240) 437-7557',
      image: "https://media.licdn.com/dms/image/v2/D4E03AQFgGIXbgMWvdw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1731897077437?e=1747267200&v=beta&t=oCl6Xe-NTc6na2a3STPhuKJiDaXzXf3xjjxFvjdHJt0"
    }
  ];

  const client = await clientPromise;
  const db = client.db();

  // Only insert dummy data if the "founders" collection is empty
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
    cohort: f.cohort,
    phone: f.phone,
    image: f.image
  }));

  return {
    props: { founders: formattedFounders }
  };
}

export default function Home({ founders }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  // Initialize addFormData with empty fields (image remains empty until file is chosen)
  const [addFormData, setAddFormData] = useState({
    name: '',
    position: '',
    cohort: '',
    linkedin: '',
    phone: '',
    image: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  const filteredFounders = founders.filter((founder) =>
    founder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    founder.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
    founder.cohort.toLowerCase().includes(searchQuery.toLowerCase()) ||
    founder.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddModalOpen = () => {
    setShowAddModal(true);
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Use FileReader to convert the file to a base64 string
      const reader = new FileReader();
      reader.onloadend = () => {
        setAddFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addContact = async () => {
    // Validate required fields: name, position, cohort
    if (!addFormData.name || !addFormData.position || !addFormData.cohort) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsAdding(true);

    // Set the default image URL if none was uploaded
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
        window.location.reload(); // Or update state to include the new contact
      } else {
        console.error('Error adding contact');
      }
    } catch (error) {
      console.error('Error adding contact', error);
    }
    setIsAdding(false);
  };

  return (
    <>
      <Head>
        <title>Telora Directory - Founders</title>
        <meta name="description" content="A directory of Telora founders and their contact information." />
      </Head>
      <main className="container">
        <div className="banner">
          <img
            src="https://images.squarespace-cdn.com/content/v1/6462c44371c5e61841cb2b84/859405d1-03f7-43c2-adcb-3be4d781265a/telora_home.jpg?format=2500w"
            alt="Telora Banner"
          />
        </div>
        <header className="header">
          <h1>Telora Directory</h1>
          <p>Founders &amp; Their Contact Information</p>
        </header>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search founders..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <section className="founders">
          {filteredFounders.map((founder) => (
            <FounderCard key={founder.id} founder={founder} />
          ))}
        </section>
      </main>
      <br>
      <br>
      <footer className="footer">
        <div className="footer-left">
          Brought to you by team Talys <span className="heart">&lt;3</span>
        </div>
        <div className="footer-right">
          <button className="addContactButton" onClick={handleAddModalOpen}>
            Add Contact
          </button>
        </div>
      </footer>
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
    </>
  );
}

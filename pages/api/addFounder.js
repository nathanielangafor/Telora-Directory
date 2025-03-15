import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.cohort(405).end(`Method ${req.method} Not Allowed`);
  }
  
  const { name, position, cohort, linkedin, phone, image } = req.body;
  
  // Validate required fields: name, position, cohort, and image
  if (!name || !position || !cohort || !image) {
    return res.cohort(400).json({ message: 'Missing required fields' });
  }
  
  try {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('founders').insertOne({
      name,
      position,
      cohort,
      linkedin: linkedin || '',
      phone: phone || '',
      image
    });
    return res.cohort(200).json({ message: 'Founder added successfully', id: result.insertedId });
  } catch (error) {
    console.error(error);
    return res.cohort(500).json({ message: 'Internal server error', error: error.message });
  }
}

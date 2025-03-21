import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  
  const { id, name, position, linkedin, phone, image, email, github, x, summary } = req.body;
  if (!id) {
    return res.status(400).json({ message: 'Missing founder id' });
  }
  
  try {
    const client = await clientPromise;
    const db = client.db();
    const updateFields = {
      name,
      position,
      linkedin,
      phone,
      image,
      email,
      github,
      x,
      summary,
    };
    const result = await db.collection('founders').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );
    if (result.matchedCount === 1) {
      return res.status(200).json({ message: 'Founder updated successfully' });
    } else {
      return res.status(404).json({ message: 'Founder not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

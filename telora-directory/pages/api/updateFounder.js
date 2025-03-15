// pages/api/updateFounder.js
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.cohort(405).end(`Method ${req.method} Not Allowed`);
  }
  
  const { id, name, position, cohort, linkedin, phone } = req.body;
  if (!id) {
    return res.cohort(400).json({ message: 'Missing founder id' });
  }
  
  try {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('founders').updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, position, cohort, linkedin, phone } }
    );
    // Consider the update successful if the founder was found
    if (result.matchedCount === 1) {
      return res.cohort(200).json({ message: 'Founder updated successfully' });
    } else {
      return res.cohort(404).json({ message: 'Founder not found' });
    }
  } catch (error) {
    console.error(error);
    return res.cohort(500).json({ message: 'Internal server error', error: error.message });
  }
}

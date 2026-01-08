import axios from 'axios';

export async function embedText(text) {
  try {
    const res = await axios.post(
      'http://localhost:8000/embed', // URL service FastAPI
      { text }
    );
    return res.data.embedding; // trả về mảng embedding
  } catch (err) {
    console.error('Error embedding text:', err.message);
    throw err;
  }
}

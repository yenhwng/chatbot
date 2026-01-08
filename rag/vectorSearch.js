import pool from '../db/pool.js';
import { validateInternalQuery } from '../db/queryGuard.js';

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) || 1);
}

export async function searchSimilar(queryEmbedding, topK = 5) {
  validateInternalQuery('document_chunks', ['content', 'embedding']);

  const [rows] = await pool.query(
    'SELECT content, embedding FROM document_chunks'
  );

  return rows
    .map(r => {
      const emb = JSON.parse(r.embedding);
      return {
        content: r.content,
        score: cosine(queryEmbedding, emb)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

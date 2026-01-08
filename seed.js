import crypto from 'crypto';
import pool from './db/pool.js';
import { splitTextIntoChunks } from './utils.js';
import { embedText } from './rag/embedder.js';
import { validateQuery, ALLOWED_TABLES } from './db/queryGuard.js';

function hashRow(row) {
  return crypto
    .createHash('sha256')
    .update(JSON.stringify(row))
    .digest('hex');
}

async function seed() {
  for (const table of Object.keys(ALLOWED_TABLES)) {
    const columns = ALLOWED_TABLES[table];
    validateQuery(table, columns);

    const [rows] = await pool.query(
      `SELECT ${columns.join(', ')} FROM ${table}`
    );

    for (const row of rows) {
      const rowHash = hashRow(row);

      // ===== IDENTITY DOCUMENT (ỔN ĐỊNH) =====
      const sourceRef = `${table}:${rowHash}`;

      const [existing] = await pool.query(
        `SELECT id FROM documents WHERE source_ref = ? LIMIT 1`,
        [sourceRef]
      );

      let documentId;

      if (existing.length) {
        documentId = existing[0].id;
      } else {
        const [docResult] = await pool.query(
          `
          INSERT INTO documents (title, source_type, source_ref)
          VALUES (?, 'internal', ?)
          `,
          [table, sourceRef]
        );
        documentId = docResult.insertId;
      }

      // ===== CONTENT CHO RAG =====
      const text = Object.entries(row)
        .filter(([, v]) => v !== null && v !== undefined)
        .map(([k, v]) => `${k}: ${v}`)
        .join('\n');

      const chunks = splitTextIntoChunks(text, 300);

      for (const chunk of chunks) {
        try {
          const embedding = await embedText(chunk);

          await pool.query(
            `
            INSERT INTO document_chunks (
              document_id,
              content,
              embedding
            ) VALUES (?, ?, ?)
            `,
            [
              documentId,
              chunk,
              JSON.stringify(embedding)
            ]
          );
        } catch (err) {
          console.error('[Embedding]', err.message);
        }
      }
    }
  }

  console.log('Seed hoàn tất');
  process.exit(0);
}

seed().catch(console.error);

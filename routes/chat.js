import express from 'express';
import pool from '../db/pool.js';

import { detectIntent } from '../nlp/detectIntent.js';
import { extractSubject, extractLecturer } from '../nlp/extractEntities.js';
import { INTENTS } from '../nlp/intentKeyword.js';

import { embedText } from '../rag/embedder.js';
import { searchSimilar } from '../rag/vectorSearch.js';
import { buildPrompt } from '../rag/promptBuilder.js';
import { callGemini } from '../llm/gemini.js';

const router = express.Router();

/* ===== Helper ===== */
function normalizeLecturers(raw) {
  if (!raw) return [];
  return raw
    .split(',')
    .map(s => s.trim())
    .map(s => s.replace(/^TH:\s*/i, ''))
    .filter(Boolean);
}

function normalizeInput(str) {
  if (!str) return '';
  return str.toLowerCase().trim().replace(/\s+/g, ' ');
}

/* ===== POST /chat ===== */
router.post('/', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.json({ answer: 'Vui lòng nhập câu hỏi.' });

    // Chào hỏi
    if (/\b(xin chào|chào|hello|hi)\b/i.test(question)) {
      return res.json({
        intent: 'FAQS',
        answer: 'Chào bạn! Mình có thể giúp gì cho bạn hôm nay?'
      });
    }

    const intentKey = detectIntent(question);
    const intent = INTENTS[intentKey];
    if (!intent) return res.json({ answer: 'Tôi không hiểu câu hỏi.' });

    /* ===== Structured SQL Query ===== */
    if (intent.type === 'STRUCTURED') {
      let rows = [];
      const subjectRaw = extractSubject(question);
      const lecturerRaw = extractLecturer(question);

      const subject = normalizeInput(subjectRaw);
      const lecturer = normalizeInput(lecturerRaw);

      // === CHATBOT_COURSES: Môn có ai dạy ===
      if (intentKey === 'CHATBOT_COURSES') {
        if (!subject) return res.json({ answer: 'Bạn vui lòng cho biết tên môn học.' });

        [rows] = await pool.query(
          `SELECT course_name, lecturers 
           FROM chatbot_courses 
           WHERE LOWER(course_name) LIKE ? COLLATE utf8mb4_general_ci`,
          [`%${subject}%`]
        );

        if (!rows.length)
          return res.json({ answer: `Không tìm thấy thông tin giảng viên cho môn ${subjectRaw}.` });

        const lecturersSet = new Set();
        rows.forEach(r => normalizeLecturers(r.lecturers).forEach(l => lecturersSet.add(l)));

        const answer = `Môn ${rows[0].course_name} do các giảng viên: ${[...lecturersSet].join(', ')} giảng dạy.`;
        return res.json({ intent: intentKey, answer });
      }

      // === TEACHING_BY_SUBJECT: Ai dạy môn gì ===
      if (intentKey === 'TEACHING_BY_SUBJECT' && subject) {
        [rows] = await pool.query(
          `SELECT ten_mon_hoc, ten_giang_vien 
           FROM lecturer_course_exam 
           WHERE LOWER(ten_mon_hoc) LIKE ? COLLATE utf8mb4_general_ci`,
          [`%${subject}%`]
        );

        if (!rows.length)
          return res.json({ answer: `Không tìm thấy thông tin môn ${subjectRaw}.` });

        const lecturers = [...new Set(rows.map(r => r.ten_giang_vien))];
        const answer = `Môn ${rows[0].ten_mon_hoc} do các giảng viên: ${lecturers.join(', ')} giảng dạy.`;
        return res.json({ intent: intentKey, answer });
      }

      // === SUBJECTS_BY_LECTURER: Thầy/cô dạy môn gì ===
      if (intentKey === 'SUBJECTS_BY_LECTURER' && lecturerRaw) {
        const lecturerQuery = lecturerRaw.trim();

        [rows] = await pool.query(
          `SELECT ten_giang_vien, ten_mon_hoc 
           FROM lecturer_course_exam 
           WHERE ten_giang_vien LIKE ?`,
          [`%${lecturerQuery}%`]
        );

        if (!rows.length)
          return res.json({ answer: `Không tìm thấy thông tin giảng viên ${lecturerQuery} giảng dạy.` });

        const subjects = [...new Set(rows.map(r => r.ten_mon_hoc))];
        const answer = `Giảng viên ${rows[0].ten_giang_vien} giảng dạy các môn: ${subjects.join(', ')}.`;
        return res.json({ intent: intentKey, answer });
      }

      // === Các bảng structured khác: Tin tức, Sự kiện, Tuyển dụng, FAQ, v.v. ===
      const filters = [];
      if (subject) filters.push(`LOWER(name) LIKE '%${subject}%'`);
      if (lecturer && intent.columns.includes('lecturers')) filters.push(`LOWER(lecturers) LIKE '%${lecturer}%'`);
      const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';

      [rows] = await pool.query(
        `SELECT ${intent.columns.join(', ')} FROM ${intent.table} ${whereClause}`
      );

      if (!rows.length) return res.json({ answer: 'Không tìm thấy thông tin phù hợp.' });

      const answer = rows
        .map(r => Object.entries(r).map(([k, v]) => `${k}: ${v}`).join(', '))
        .join('\n');
      return res.json({ intent: intentKey, answer });
    }

    /* ===== Unstructured → RAG (vector search) ===== */
    if (intent.type === 'RAG') {
      try {
        const embedding = await embedText(question);
        const chunks = await searchSimilar(embedding);

        if (!chunks.length) return res.json({ answer: 'Không có dữ liệu liên quan.' });

        const context = chunks.map(c => c.content).join('\n---\n');
        const prompt = buildPrompt(context, question);
        const answer = await callGemini(prompt);

        res.json({
          intent: intentKey,
          answer,
          sources: chunks.map(c => c.content)
        });
      } catch (err) {
        console.error('RAG error:', err.message);
        res.json({ intent: intentKey, answer: 'Không thể truy xuất thông tin lúc này.' });
      }
    }
  } catch (err) {
    console.error('Chat error:', err);
    res.status(500).json({ answer: 'Có lỗi xảy ra khi xử lý câu hỏi.' });
  }
});

export default router;

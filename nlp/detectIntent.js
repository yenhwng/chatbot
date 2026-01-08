import { INTENTS } from './intentKeyword.js';

/**
 * Chuẩn hóa câu hỏi: lowercase, xóa dấu câu thừa
 */
function normalizeQuestion(q) {
  return q
    .toLowerCase()
    .replace(/[?.,!;:]/g, '')
    .trim();
}

export function detectIntent(question) {
  const q = normalizeQuestion(question);

  // 1. Các intent RAG cụ thể
  if (/nghiên cứu|hướng nghiên cứu|đề tài khoa học/.test(q)) {
    return INTENTS.RESEARCH_BY_LECTURER.name;
  }
  if (/khoa|liên hệ khoa|thông tin khoa/.test(q)) {
    return INTENTS.FACULTY_INFO.name;
  }
  if (/tin tức|thông báo|bản tin/.test(q)) {
    return INTENTS.NEWS_INFO.name;
  }
  if (/sự kiện|hội thảo|seminar/.test(q)) {
    return INTENTS.EVENTS_INFO.name;
  }
  if (/tài liệu|biểu mẫu|quy định sinh viên/.test(q)) {
    return INTENTS.STUDENT_DOCUMENTS.name;
  }

  // 2. Các intent structured theo mô hình giảng viên – môn học
  if (/các giảng viên|những giảng viên/.test(q)) {
    return INTENTS.CHATBOT_COURSES.name;
  }
  if (/cô |thầy /.test(q)) {
    return INTENTS.SUBJECTS_BY_LECTURER.name;
  }
  if (/\b(thầy|cô|giảng viên)\s+[A-ZÀ-Ỹa-zà-ỹ]+\s*[A-ZÀ-Ỹa-zà-ỹ]*(\s*[A-ZÀ-Ỹa-zà-ỹ]*)?\s+(giảng dạy|dạy môn)/i.test(question)) {
    return INTENTS.SUBJECTS_BY_LECTURER.name;
  }
  if (/ai dạy|môn nào do ai dạy/.test(q)) {
    return INTENTS.TEACHING_BY_SUBJECT.name;
  }

  // 3. Các intent còn lại dựa trên keywords
  for (const key in INTENTS) {
    const intent = INTENTS[key];
    if (!intent.keywords) continue;
    if (intent.keywords.some(k => q.includes(k.toLowerCase()))) {
      return intent.name;
    }
  }

  return 'UNKNOWN';
}

/* ===== extractEntities.js ===== */

/* ===== Extract tên môn học ===== */
export function extractSubject(question) {
  const patterns = [
    /môn\s+["']?([A-Za-zÀ-ỹ0-9\s]+?)["']?(?:\?|$)/i,
    /môn\s+([A-Za-zÀ-ỹ0-9\s]+?)\s+có.*ai dạy/i
  ];

  for (const r of patterns) {
    const m = question.match(r);
    if (m) {
      return m[1].trim().replace(/\s+(có|ai|dạy|giảng dạy).*$/i, '').trim();
    }
  }
  return null;
}

/* ===== Extract tên giảng viên ===== */
export function extractLecturer(question) {
  // Match tên kiểu: thầy/cô + Họ + Tên (2-4 từ) trước từ khóa "giảng dạy" hoặc "dạy môn"
  const regexFull = /\b(?:cô|thầy|giảng viên)\s+([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹa-zà-ỹ]+){1,3})\s*(?=giảng dạy|dạy môn|giảng viên|$)/i;
  const m = question.match(regexFull);
  if (m) return m[1].trim();

  // Fallback: lấy đến hết câu hỏi sau "thầy/cô"
  const fallback = question.match(/\b(?:cô|thầy|giảng viên)\s+([^\?\.,]+)/i);
  if (fallback) return fallback[1].trim();

  return null;
}

import axios from 'axios';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent';
const MAX_RETRY = 3;

/** Sleep helper */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Gọi Gemini LLM
 * @param {string} prompt
 * @returns {Promise<string>}
 */
export async function callGemini(prompt) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('GEMINI_API_KEY is missing');

  let lastError;

  for (let attempt = 1; attempt <= MAX_RETRY; attempt++) {
    try {
      const res = await axios.post(
        `${GEMINI_URL}?key=${apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        { timeout: 20000 }
      );

      const text = res.data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return text;

      return 'AI không trả về nội dung.';
    } catch (err) {
      lastError = err;
      const status = err.response?.status;

      console.error(`[Gemini] attempt ${attempt} failed:`, status || err.message);

      // Retry nếu rate limit hoặc server busy
      if (status === 429 || status === 503) {
        await sleep(attempt * 1500); // backoff tăng dần
        continue;
      }

      break; // lỗi khác không retry
    }
  }

  throw new Error('Không thể gọi AI lúc này (Gemini rate limit). ' + (lastError?.message || ''));
}

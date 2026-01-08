export function buildPrompt(context, question) {
  return `
Bạn là trợ lý thông minh của Khoa CNTT.
Dựa trên thông tin dưới đây, trả lời câu hỏi của người dùng một cách tự nhiên, ngắn gọn, dễ đọc.

Thông tin:
${context}

Câu hỏi:
${question}
`;
}

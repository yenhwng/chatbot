export const ALLOWED_TABLES = {
    chatbot_courses: ['course_code', 'course_name', 'lecturers'],
    courses: ['name', 'code', 'category', 'semester'],
    departments: ['name', 'description'],
    enterprises: ['name', 'industry', 'description','website','address'],
    events: ['title', 'event_date', 'location', 'description'],
    faculty_information: ['name', 'phone', 'email', 'address'],
    lecturer_course_exam: ['ten_giang_vien', 'ma_mon_hoc', 'ten_mon_hoc', 'hoc_ky', 'nam_hoc', 'hinh_thuc_thi'],
    lecturers: ['name','email', 'academic_degree', 'academic_rank', 'research_direction'],
    majors: ['name', 'description','duration_years','degree'],
    news: ['title', 'summary', 'content', 'published_at'],
    recruitment_posts: ['company_name', 'title', 'position', 'job_description','contact_email','apply_link','deadline'],
    research_projects: ['title', 'research_period', 'publication_date', 'journal_name','lead_lecturer','co_authors','abstract'],
    student_documents: ['title', 'category', 'created_at', 'description','file_url'],
    faqs: ['question', 'answer'],
};

export function validateQuery(table, columns) {
  if (!ALLOWED_TABLES[table]) throw new Error('Table not allowed');
  for (const col of columns) {
    if (!ALLOWED_TABLES[table].includes(col)) throw new Error(`Column ${col} not allowed`);
  }
}

// Dành cho internal RAG storage
const INTERNAL_TABLES = {
  document_chunks: ['id','content','embedding'],
  documents: ['id','title','source_ref']
};

export function validateInternalQuery(table, columns) {
  if (!INTERNAL_TABLES[table]) throw new Error('Internal table not allowed');
  for (const col of columns) {
    if (!INTERNAL_TABLES[table].includes(col))
      throw new Error(`Column ${col} not allowed`);
  }
}

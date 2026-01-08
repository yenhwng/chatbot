export const INTENTS = {

  /* ================= GIẢNG VIÊN – MÔN HỌC ================= */
  /* ===== STRUCTURED (SQL) ===== */

  TEACHING_BY_SUBJECT: {
    name: 'TEACHING_BY_SUBJECT',
    type: 'STRUCTURED',
    table: 'lecturer_course_exam',
    columns: ['ten_giang_vien', 'ma_mon_hoc', 'ten_mon_hoc', 'hoc_ky', 'nam_hoc'],
    keywords: [
      'ai dạy',
      'giảng viên dạy',
      'dạy môn',
      'môn nào do ai dạy'
    ]
  },

  SUBJECTS_BY_LECTURER: {
  name: 'SUBJECTS_BY_LECTURER',
  type: 'STRUCTURED',
  table: 'lecturer_course_exam',
  columns: ['ten_mon_hoc', 'ma_mon_hoc', 'hoc_ky', 'nam_hoc', 'hinh_thuc_thi'],
  keywords: [
    'cô',
    'thầy',
    'dạy môn gì',
    'giảng dạy môn gì',
    'giảng dạy môn nào'
  ]
},

  LECTURER_PROFILE: {
    name: 'LECTURER_PROFILE',
    type: 'STRUCTURED',
    table: 'lecturers',
    columns: ['name', 'email', 'academic_degree', 'academic_rank', 'research_direction'],
    keywords: [
      'giảng viên',
      'thông tin giảng viên',
      'email giảng viên',
      'học hàm',
      'học vị'
    ]
  },

  /* ================= NGHIÊN CỨU ================= */
  /* ===== UNSTRUCTURED (RAG) ===== */

  RESEARCH_BY_LECTURER: {
    name: 'RESEARCH_BY_LECTURER',
    type: 'RAG',
    table: 'research_projects',
    columns: ['title', 'research_period', 'journal_name', 'lead_lecturer', 'abstract'],
    keywords: [
      'nghiên cứu',
      'hướng nghiên cứu',
      'đề tài khoa học'
    ]
  },

  /* ================= ĐÀO TẠO ================= */
  /* ===== STRUCTURED (SQL) ===== */

  COURSES_INFO: {
    name: 'COURSES_INFO',
    type: 'STRUCTURED',
    table: 'courses',
    columns: ['name', 'code', 'category', 'semester'],
    keywords: [
      'môn học',
      'học phần',
      'thông tin môn'
    ]
  },

  MAJORS_INFO: {
    name: 'MAJORS_INFO',
    type: 'STRUCTURED',
    table: 'majors',
    columns: ['name', 'description', 'duration_years', 'degree'],
    keywords: [
      'ngành học',
      'chuyên ngành',
      'đào tạo ngành'
    ]
  },

  DEPARTMENTS_INFO: {
    name: 'DEPARTMENTS_INFO',
    type: 'STRUCTURED',
    table: 'departments',
    columns: ['name', 'description'],
    keywords: [
      'bộ môn',
      'đơn vị trực thuộc',
      'khoa có bộ môn nào'
    ]
  },

  /* ================= TIN TỨC – SỰ KIỆN ================= */
  /* ===== UNSTRUCTURED (RAG) ===== */

  NEWS_INFO: {
    name: 'NEWS_INFO',
    type: 'RAG',
    table: 'news',
    columns: ['title', 'summary', 'published_at'],
    keywords: [
      'tin tức',
      'thông báo',
      'bản tin'
    ]
  },

  EVENTS_INFO: {
    name: 'EVENTS_INFO',
    type: 'RAG',
    table: 'events',
    columns: ['title', 'event_date', 'location', 'description'],
    keywords: [
      'sự kiện',
      'hội thảo',
      'seminar'
    ]
  },

  /* ================= DOANH NGHIỆP – TUYỂN DỤNG ================= */
  /* ===== STRUCTURED (SQL) ===== */

  ENTERPRISE_INFO: {
    name: 'ENTERPRISE_INFO',
    type: 'STRUCTURED',
    table: 'enterprises',
    columns: ['name', 'industry', 'website', 'address'],
    keywords: [
      'doanh nghiệp',
      'công ty đối tác'
    ]
  },

  RECRUITMENT_INFO: {
    name: 'RECRUITMENT_INFO',
    type: 'STRUCTURED',
    table: 'recruitment_posts',
    columns: ['company_name', 'title', 'position', 'deadline', 'apply_link'],
    keywords: [
      'tuyển dụng',
      'việc làm',
      'thực tập'
    ]
  },

  /* ================= TÀI LIỆU – SINH VIÊN ================= */
  /* ===== UNSTRUCTURED (RAG) ===== */

  STUDENT_DOCUMENTS: {
    name: 'STUDENT_DOCUMENTS',
    type: 'RAG',
    table: 'student_documents',
    columns: ['title', 'category', 'created_at', 'file_url'],
    keywords: [
      'tài liệu',
      'biểu mẫu',
      'quy định sinh viên'
    ]
  },

  /* ================= CHATBOT – HỌC PHẦN ================= */
  /* ===== STRUCTURED (SQL) ===== */

  CHATBOT_COURSES: {
    name: 'CHATBOT_COURSES',
    type: 'STRUCTURED',
    table: 'chatbot_courses',
    columns: ['course_code', 'course_name', 'lecturers'],
    keywords: [
      'các giảng viên',
      'những giảng viên',
      'các giảng viên dạy',
      'những giảng viên dạy',
      'môn nào có các giảng viên',
      'môn nào có những giảng viên',
      'những ai dạy',              // thêm
      'những ai giảng dạy',         // thêm
      'những giảng viên dạy môn' 
    ]
  },

  /* ================= THÔNG TIN KHOA ================= */
  /* ===== UNSTRUCTURED (RAG) ===== */

  FACULTY_INFO: {
    name: 'FACULTY_INFO',
    type: 'RAG',
    table: 'faculty_information',
    columns: ['name', 'phone', 'email', 'address'],
    keywords: [
      'khoa',
      'liên hệ khoa',
      'thông tin khoa'
    ]
  },
  
  FAQS: {
    name: 'FAQS',
    table: 'faqs',
    columns: ['question', 'answer'],
    keywords: ['xin chào','chào'],
  }

};

import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: '26.8.139.165',
  port: 3306,
  user: 'yenkyt',
  password: '123456',
  database: 'fit_portal',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export theo ES Module
export default pool;

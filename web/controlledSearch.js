
const ALLOWED_DOMAINS = [
  'https://daotao.ptit.edu.vn/chuong-trinh-dao-tao/nganh-cong-nghe-thong-tin/',
  'https://ptit.edu.vn/wp-signup.php?new=it'
];

function isAllowed(url) {
  return ALLOWED_DOMAINS.some(d => url.startsWith(d));
}

module.exports = { isAllowed };

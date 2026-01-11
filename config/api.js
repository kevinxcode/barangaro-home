const API_BASE_URL = 'http://192.168.1.39:8000';

export const API = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  
  // Bills
  BILLS: `${API_BASE_URL}/bills`,
  BILLS_SUMMARY: `${API_BASE_URL}/bills/summary`,
  
  // Payments
  PAYMENTS: `${API_BASE_URL}/payments`,
  PAYMENTS_CREATE: `${API_BASE_URL}/payments/create`,
  PAYMENTS_HISTORY: `${API_BASE_URL}/payments/history`,
  PAYMENTS_DETAIL: (id) => `${API_BASE_URL}/payments/detail/${id}`,
  
  // News
  NEWS: `${API_BASE_URL}/news`,
  NEWS_DETAIL: (id) => `${API_BASE_URL}/news/detail/${id}`,
  
  // Notifications
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  NOTIFICATIONS_READ: (id) => `${API_BASE_URL}/notifications/mark_read/${id}`,
  
  // Settings
  BANK_INFO: `${API_BASE_URL}/settings/bank_info`,
  PAYMENT_METHODS: `${API_BASE_URL}/settings/payment_methods`,
};

export default API;

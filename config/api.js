import AsyncStorage from '@react-native-async-storage/async-storage';

let API_BASE_URL = 'http://192.168.1.39:8000';

export const setApiBaseUrl = async (url) => {
  API_BASE_URL = url;
  await AsyncStorage.setItem('api_base_url', url);
  
  // Save to history
  const historyStr = await AsyncStorage.getItem('api_url_history');
  const history = historyStr ? JSON.parse(historyStr) : [];
  if (!history.includes(url)) {
    history.unshift(url);
    if (history.length > 5) history.pop();
    await AsyncStorage.setItem('api_url_history', JSON.stringify(history));
  }
};

export const getApiBaseUrl = async () => {
  const url = await AsyncStorage.getItem('api_base_url');
  if (url) API_BASE_URL = url;
  return API_BASE_URL;
};

export const getApiUrlHistory = async () => {
  const historyStr = await AsyncStorage.getItem('api_url_history');
  return historyStr ? JSON.parse(historyStr) : [];
};

export const clearApiUrlHistory = async () => {
  await AsyncStorage.removeItem('api_url_history');
};

export const getAPI = () => ({
  TEST_CONNECTION: `${API_BASE_URL}/auth/test_connection`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  BILLS: `${API_BASE_URL}/bills`,
  BILLS_SUMMARY: `${API_BASE_URL}/bills/summary`,
  PAYMENTS: `${API_BASE_URL}/payments`,
  PAYMENTS_CREATE: `${API_BASE_URL}/payments/create`,
  PAYMENTS_HISTORY: `${API_BASE_URL}/payments/history`,
  PAYMENTS_DETAIL: (id) => `${API_BASE_URL}/payments/detail/${id}`,
  NEWS: `${API_BASE_URL}/news`,
  NEWS_DETAIL: (id) => `${API_BASE_URL}/news/detail/${id}`,
  NOTIFICATIONS: `${API_BASE_URL}/notifications`,
  NOTIFICATIONS_READ: (id) => `${API_BASE_URL}/notifications/mark_read/${id}`,
  BANK_INFO: `${API_BASE_URL}/settings/bank_info`,
  PAYMENT_METHODS: `${API_BASE_URL}/settings/payment_methods`,
});

export default getAPI;

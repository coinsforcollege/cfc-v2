import apiClient from "../apiClient";

const AUTH_BASE_URL = '/auth/student';

export const studentApi = {
  // Multi-step registration
  studentRegisterStep1: (data) => apiClient.post(`${AUTH_BASE_URL}/register/step1`, data),
  studentRegisterStep2: (data) => apiClient.post(`${AUTH_BASE_URL}/register/step2`, data),
  studentRegisterStep3: (data) => apiClient.post(`${AUTH_BASE_URL}/register/step3`, data),
  studentRegisterStep4: (data) => apiClient.post(`${AUTH_BASE_URL}/register/step4`, data),
  studentResendCodes: (data) => apiClient.post(`${AUTH_BASE_URL}/resend-codes`, data),
}
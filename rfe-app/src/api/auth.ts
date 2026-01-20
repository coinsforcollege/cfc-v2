import config from '../config';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'college_admin' | 'platform_admin' | 'student';
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: User;
  token?: string;
}

export interface OTPResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    expiresIn: number;
    verificationToken?: string;
  };
  attemptsRemaining?: number;
  waitTime?: number;
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${config.apiUrl}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw { status: response.status, message: data.message || 'An error occurred', ...data };
  }

  return data;
}

export const authApi = {
  async login(email: string, password: string, recaptchaToken?: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        recaptchaToken,
        platform: config.platform,
      }),
    });
  },

  async getMe(token: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async logout(token: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async sendOTPForStudent(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<OTPResponse> {
    return apiRequest<OTPResponse>('/auth/otp/send/student', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async verifyOTP(email: string, otp: string, role: string): Promise<OTPResponse> {
    return apiRequest<OTPResponse>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp, role }),
    });
  },

  async resendOTP(email: string, role: string): Promise<OTPResponse> {
    return apiRequest<OTPResponse>('/auth/otp/resend', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  },

  async registerStudent(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    verificationToken: string;
  }): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/register/student', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async sendForgotPasswordOTP(email: string): Promise<OTPResponse> {
    return apiRequest<OTPResponse>('/auth/otp/send/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  async verifyForgotPasswordOTP(email: string, otp: string): Promise<OTPResponse> {
    return apiRequest<OTPResponse>('/auth/otp/verify/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  async resetPassword(email: string, newPassword: string, verificationToken: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword, verificationToken }),
    });
  },
};

export default authApi;

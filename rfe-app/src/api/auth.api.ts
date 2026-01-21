import config from '@/config';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'college_admin' | 'platform_admin' | 'student';
  college?: any;
  userProfile?: any;
  managedCollege?: any;
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

// API helper function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${config.apiUrl}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw {
      status: response.status,
      message: data.message || 'An error occurred',
      ...data,
    };
  }

  return data;
}

// Auth API functions
export const authApi = {
  // Login
  async login(
    email: string,
    password: string,
    recaptchaToken?: string
  ): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        recaptchaToken,
        platform: config.platform, // Send platform for reCAPTCHA handling
      }),
    });
  },

  // Get current user
  async getMe(token: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Logout
  async logout(token: string): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Send OTP for student registration
  async sendOTPForStudent(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    language?: string;
  }): Promise<OTPResponse> {
    return apiRequest<OTPResponse>('/auth/otp/send/student', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Verify OTP
  async verifyOTP(
    email: string,
    otp: string,
    role: 'student' | 'user' | 'college_admin'
  ): Promise<OTPResponse> {
    return apiRequest<OTPResponse>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, otp, role }),
    });
  },

  // Resend OTP
  async resendOTP(
    email: string,
    role: 'student' | 'user' | 'college_admin'
  ): Promise<OTPResponse> {
    return apiRequest<OTPResponse>('/auth/otp/resend', {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  },

  // Complete student registration
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

  // Send OTP for forgot password
  async sendForgotPasswordOTP(email: string): Promise<OTPResponse> {
    return apiRequest<OTPResponse>('/auth/otp/send/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Verify OTP for forgot password
  async verifyForgotPasswordOTP(
    email: string,
    otp: string
  ): Promise<OTPResponse> {
    return apiRequest<OTPResponse>('/auth/otp/verify/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
  },

  // Reset password
  async resetPassword(
    email: string,
    newPassword: string,
    verificationToken: string
  ): Promise<AuthResponse> {
    return apiRequest<AuthResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, newPassword, verificationToken }),
    });
  },
};

export default authApi;

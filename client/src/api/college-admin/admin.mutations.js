import { useMutation } from '@tanstack/react-query';
import { adminApi } from './admin.api';
import { authApi } from '../auth/auth.api';

// Admin registration step mutations
export const useAdminRegisterStep1 = () => {
  return useMutation({
    mutationFn: adminApi.adminRegisterStep1,
    onError: (error) => {
      console.error('Admin registration step 1 failed:', error);
    },
  });
};

export const useAdminRegisterStep2 = () => {
  return useMutation({
    mutationFn: adminApi.adminRegisterStep2,
    onError: (error) => {
      console.error('Admin registration step 2 failed:', error);
    },
  });
};

export const useAdminRegisterStep3 = () => {
  return useMutation({
    mutationFn: adminApi.adminRegisterStep3,
    onError: (error) => {
      console.error('Admin registration step 3 failed:', error);
    },
  });
};

export const useAdminRegisterStep4 = () => {
  return useMutation({
    mutationFn: adminApi.adminRegisterStep4,
    onSuccess: (data) => {
      // Store token and user data on successful registration
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
    },
    onError: (error) => {
      console.error('Admin registration step 4 failed:', error);
    },
  });
};

export const useAdminRegisterComplete = () => {
  return useMutation({
    mutationFn: adminApi.adminRegisterComplete,
    onSuccess: (data) => {
      // Store token and user data on successful registration completion
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
    },
    onError: (error) => {
      console.error('Admin registration completion failed:', error);
    },
  });
};

// Common auth mutations for admins (reuse from student mutations)
export const useLogin = () => {
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      // Store token and user data on successful login
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
};

export const useLogout = () => {
  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      // Clear stored data on logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    onError: (error) => {
      console.error('Logout failed:', error);
      // Clear stored data even on error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  });
};

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: authApi.forgotPassword,
    onError: (error) => {
      console.error('Forgot password failed:', error);
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: authApi.resetPassword,
    onSuccess: (data) => {
      // Store token and user data on successful password reset
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
      }
    },
    onError: (error) => {
      console.error('Reset password failed:', error);
    },
  });
};

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: authApi.updatePassword,
    onSuccess: (data) => {
      // Update token if provided
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
      }
    },
    onError: (error) => {
      console.error('Update password failed:', error);
    },
  });
};

export const useUpdateDetails = () => {
  return useMutation({
    mutationFn: authApi.updateDetails,
    onSuccess: (data) => {
      // Update user data in localStorage
      if (data.data) {
        localStorage.setItem('user', JSON.stringify(data.data));
      }
    },
    onError: (error) => {
      console.error('Update details failed:', error);
    },
  });
};

export const useVerifyPhone = () => {
  return useMutation({
    mutationFn: authApi.verifyPhone,
    onError: (error) => {
      console.error('Phone verification failed:', error);
    },
  });
};

export const useResendVerification = () => {
  return useMutation({
    mutationFn: authApi.resendVerification,
    onError: (error) => {
      console.error('Resend verification failed:', error);
    },
  });
};

export const useAdminVerifyEmail = () => {
  return useMutation({
    mutationFn: adminApi.adminVerifyEmail,
    onError: (error) => {
      console.error('Admin email verification failed:', error);
    },
  });
};

// Email verification mutations for Step 2
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: adminApi.verifyEmail,
    onError: (error) => {
      console.error('Email verification failed:', error);
    },
  });
};

export const useResendVerificationCode = () => {
  return useMutation({
    mutationFn: adminApi.resendVerificationCode,
    onError: (error) => {
      console.error('Resend verification code failed:', error);
    },
  });
};

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  ScrollView,
  Pressable,
  Platform,
  useColorScheme,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/src/contexts/AuthContext';
import { authApi } from '@/src/api/auth';
import {
  ChevronLeft,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
} from 'lucide-react-native';

const ICON_COLORS = {
  light: {
    primary: 'rgb(38, 38, 39)',
    secondary: 'rgb(115, 115, 115)',
    muted: 'rgb(163, 163, 163)',
  },
  dark: {
    primary: 'rgb(245, 245, 245)',
    secondary: 'rgb(212, 212, 212)',
    muted: 'rgb(140, 140, 140)',
  },
};

type Step = 'request' | 'verify' | 'newPassword';

export default function ChangePasswordScreen() {
  const { token, user } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const [step, setStep] = useState<Step>('request');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const otpInputRefs = useRef<(TextInput | null)[]>([]);
  const topPadding = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 24);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Send OTP
  const handleSendOTP = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await authApi.sendPasswordChangeOTP(token);
      if (response.success) {
        setStep('verify');
        setResendCooldown(60);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Resend OTP
  const handleResendOTP = useCallback(async () => {
    if (!token || resendCooldown > 0) return;

    setLoading(true);
    try {
      const response = await authApi.resendPasswordChangeOTP(token);
      if (response.success) {
        setResendCooldown(60);
        Alert.alert('Success', 'Verification code sent');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  }, [token, resendCooldown]);

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
    } else {
      const newOtp = [...otp];
      newOtp[index] = value.replace(/\D/g, '');
      setOtp(newOtp);

      if (value && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleOtpKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOTP = useCallback(async () => {
    if (!token) return;

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter the complete verification code');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.verifyPasswordChangeOTP(token, otpCode);
      if (response.success && response.data?.verificationToken) {
        setVerificationToken(response.data.verificationToken);
        setStep('newPassword');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  }, [token, otp]);

  // Change password
  const handleChangePassword = useCallback(async () => {
    if (!token || !verificationToken) return;

    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.changePasswordWithOTP(token, newPassword, verificationToken);
      if (response.success) {
        Alert.alert('Success', 'Password changed successfully', [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  }, [token, verificationToken, newPassword, confirmPassword]);

  const renderStep = () => {
    switch (step) {
      case 'request':
        return (
          <VStack className="flex-1 px-4 pt-8">
            <Box className="w-20 h-20 rounded-full bg-primary-100 items-center justify-center self-center mb-6">
              <Lock size={36} color="#6366f1" />
            </Box>
            <Text className="text-2xl font-inter-bold text-typography-900 text-center mb-2">
              Change Password
            </Text>
            <Text className="text-typography-500 text-base font-inter-regular text-center mb-8">
              We'll send a verification code to{'\n'}
              <Text className="font-inter-bold text-typography-700">{user?.email}</Text>
            </Text>

            <Pressable
              onPress={handleSendOTP}
              disabled={loading}
              style={({ pressed }) => ({ opacity: pressed || loading ? 0.7 : 1 })}
            >
              <Box className="bg-primary-500 py-4 rounded-xl items-center">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-typography-0 text-base font-inter-bold">
                    Send Verification Code
                  </Text>
                )}
              </Box>
            </Pressable>
          </VStack>
        );

      case 'verify':
        return (
          <VStack className="flex-1 px-4 pt-8">
            <Box className="w-20 h-20 rounded-full bg-success-100 items-center justify-center self-center mb-6">
              <ShieldCheck size={36} color="#10b981" />
            </Box>
            <Text className="text-2xl font-inter-bold text-typography-900 text-center mb-2">
              Verify Your Email
            </Text>
            <Text className="text-typography-500 text-base font-inter-regular text-center mb-8">
              Enter the 6-digit code sent to{'\n'}
              <Text className="font-inter-bold text-typography-700">{user?.email}</Text>
            </Text>

            {/* OTP Input */}
            <HStack className="justify-center mb-6" space="sm">
              {otp.map((digit, index) => (
                <Box
                  key={index}
                  className={`w-12 h-14 border-2 rounded-xl items-center justify-center ${
                    digit ? 'border-primary-500 bg-primary-50' : 'border-outline-200 bg-background-0'
                  }`}
                >
                  <TextInput
                    ref={(ref) => (otpInputRefs.current[index] = ref)}
                    value={digit}
                    onChangeText={(value) => handleOtpChange(index, value)}
                    onKeyPress={({ nativeEvent }) => handleOtpKeyPress(index, nativeEvent.key)}
                    keyboardType="number-pad"
                    maxLength={6}
                    style={{
                      fontSize: 24,
                      fontFamily: 'Inter-Bold',
                      color: isDark ? '#f5f5f5' : '#262627',
                      textAlign: 'center',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </Box>
              ))}
            </HStack>

            {/* Resend */}
            <HStack className="justify-center mb-6">
              {resendCooldown > 0 ? (
                <Text className="text-typography-400 text-sm font-inter-medium">
                  Resend code in {resendCooldown}s
                </Text>
              ) : (
                <Pressable onPress={handleResendOTP} disabled={loading}>
                  <Text className="text-primary-500 text-sm font-inter-bold">
                    Resend Code
                  </Text>
                </Pressable>
              )}
            </HStack>

            <Pressable
              onPress={handleVerifyOTP}
              disabled={loading || otp.join('').length !== 6}
              style={({ pressed }) => ({
                opacity: pressed || loading || otp.join('').length !== 6 ? 0.7 : 1,
              })}
            >
              <Box className="bg-primary-500 py-4 rounded-xl items-center">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-typography-0 text-base font-inter-bold">
                    Verify Code
                  </Text>
                )}
              </Box>
            </Pressable>
          </VStack>
        );

      case 'newPassword':
        return (
          <VStack className="flex-1 px-4 pt-8">
            <Box className="w-20 h-20 rounded-full bg-primary-100 items-center justify-center self-center mb-6">
              <Lock size={36} color="#6366f1" />
            </Box>
            <Text className="text-2xl font-inter-bold text-typography-900 text-center mb-2">
              Create New Password
            </Text>
            <Text className="text-typography-500 text-base font-inter-regular text-center mb-8">
              Your new password must be at least 6 characters
            </Text>

            {/* New Password */}
            <VStack className="mb-4">
              <Text className="text-sm font-inter-medium text-typography-500 mb-1.5 ml-1">
                New Password
              </Text>
              <HStack className="bg-background-0 border border-outline-200 rounded-xl px-4 items-center">
                <TextInput
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: 'Inter-Regular',
                    color: isDark ? '#f5f5f5' : '#262627',
                    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
                  }}
                />
                <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? (
                    <EyeOff size={20} color={iconColors.muted} />
                  ) : (
                    <Eye size={20} color={iconColors.muted} />
                  )}
                </Pressable>
              </HStack>
            </VStack>

            {/* Confirm Password */}
            <VStack className="mb-6">
              <Text className="text-sm font-inter-medium text-typography-500 mb-1.5 ml-1">
                Confirm Password
              </Text>
              <HStack className="bg-background-0 border border-outline-200 rounded-xl px-4 items-center">
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: 'Inter-Regular',
                    color: isDark ? '#f5f5f5' : '#262627',
                    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
                  }}
                />
                <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={iconColors.muted} />
                  ) : (
                    <Eye size={20} color={iconColors.muted} />
                  )}
                </Pressable>
              </HStack>
            </VStack>

            <Pressable
              onPress={handleChangePassword}
              disabled={loading || !newPassword || !confirmPassword}
              style={({ pressed }) => ({
                opacity: pressed || loading || !newPassword || !confirmPassword ? 0.7 : 1,
              })}
            >
              <Box className="bg-primary-500 py-4 rounded-xl items-center">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-typography-0 text-base font-inter-bold">
                    Change Password
                  </Text>
                )}
              </Box>
            </Pressable>
          </VStack>
        );
    }
  };

  return (
    <Box className="flex-1 bg-background-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <HStack
          className="px-4 py-3 items-center bg-background-50"
          style={{ paddingTop: topPadding }}
        >
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Box className="w-10 h-10 items-center justify-center">
              <ChevronLeft size={24} strokeWidth={2.5} color={iconColors.primary} />
            </Box>
          </Pressable>
          <Box className="flex-1" />
          <Box className="w-10 h-10" />
        </HStack>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: Math.max(insets.bottom, 40),
          }}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>
      </KeyboardAvoidingView>
    </Box>
  );
}

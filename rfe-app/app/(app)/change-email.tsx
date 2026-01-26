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
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
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

type Step = 'newEmail' | 'verify' | 'password';

export default function ChangeEmailScreen() {
  const { token, user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const [step, setStep] = useState<Step>('newEmail');
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

  // Validate email
  const isValidEmail = (email: string) => {
    return /^\S+@\S+\.\S+$/.test(email);
  };

  // Send OTP to new email
  const handleSendOTP = useCallback(async () => {
    if (!token) return;

    if (!newEmail.trim()) {
      Alert.alert('Error', 'Please enter a new email address');
      return;
    }

    if (!isValidEmail(newEmail)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (newEmail.toLowerCase() === user?.email?.toLowerCase()) {
      Alert.alert('Error', 'New email must be different from current email');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.sendEmailChangeOTP(token, newEmail);
      if (response.success) {
        setStep('verify');
        setResendCooldown(60);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  }, [token, newEmail, user?.email]);

  // Resend OTP
  const handleResendOTP = useCallback(async () => {
    if (!token || resendCooldown > 0) return;

    setLoading(true);
    try {
      const response = await authApi.sendEmailChangeOTP(token, newEmail);
      if (response.success) {
        setResendCooldown(60);
        Alert.alert('Success', 'Verification code sent');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend code');
    } finally {
      setLoading(false);
    }
  }, [token, newEmail, resendCooldown]);

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
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
      const response = await authApi.verifyEmailChangeOTP(token, otpCode, newEmail);
      if (response.success && response.data?.verificationToken) {
        setVerificationToken(response.data.verificationToken);
        setStep('password');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  }, [token, otp, newEmail]);

  // Change email
  const handleChangeEmail = useCallback(async () => {
    if (!token || !verificationToken) return;

    if (!password) {
      Alert.alert('Error', 'Please enter your password');
      return;
    }

    setLoading(true);
    try {
      const response = await authApi.changeEmail(token, newEmail, password, verificationToken);
      if (response.success) {
        Alert.alert(
          'Success',
          'Email changed successfully. Please log in again with your new email.',
          [{ text: 'OK', onPress: logout }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to change email');
    } finally {
      setLoading(false);
    }
  }, [token, verificationToken, newEmail, password, logout]);

  const renderStep = () => {
    switch (step) {
      case 'newEmail':
        return (
          <VStack className="flex-1 px-4 pt-8">
            <Box className="w-20 h-20 rounded-full bg-info-100 items-center justify-center self-center mb-6">
              <Mail size={36} color="#3b82f6" />
            </Box>
            <Text className="text-2xl font-inter-bold text-typography-900 text-center mb-2">
              Change Email
            </Text>
            <Text className="text-typography-500 text-base font-inter-regular text-center mb-2">
              Current email
            </Text>
            <Text className="text-typography-700 text-base font-inter-bold text-center mb-8">
              {user?.email}
            </Text>

            {/* New Email Input */}
            <VStack className="mb-6">
              <Text className="text-sm font-inter-medium text-typography-500 mb-1.5 ml-1">
                New Email Address
              </Text>
              <Box className="bg-background-0 border border-outline-200 rounded-xl px-4">
                <TextInput
                  value={newEmail}
                  onChangeText={setNewEmail}
                  placeholder="Enter new email"
                  placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    fontSize: 16,
                    fontFamily: 'Inter-Regular',
                    color: isDark ? '#f5f5f5' : '#262627',
                    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
                  }}
                />
              </Box>
            </VStack>

            <Pressable
              onPress={handleSendOTP}
              disabled={loading || !newEmail.trim()}
              style={({ pressed }) => ({
                opacity: pressed || loading || !newEmail.trim() ? 0.7 : 1,
              })}
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
              Verify New Email
            </Text>
            <Text className="text-typography-500 text-base font-inter-regular text-center mb-8">
              Enter the 6-digit code sent to{'\n'}
              <Text className="font-inter-bold text-typography-700">{newEmail}</Text>
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

      case 'password':
        return (
          <VStack className="flex-1 px-4 pt-8">
            <Box className="w-20 h-20 rounded-full bg-warning-100 items-center justify-center self-center mb-6">
              <Lock size={36} color="#f59e0b" />
            </Box>
            <Text className="text-2xl font-inter-bold text-typography-900 text-center mb-2">
              Confirm Password
            </Text>
            <Text className="text-typography-500 text-base font-inter-regular text-center mb-8">
              Enter your current password to confirm the email change
            </Text>

            {/* Password Input */}
            <VStack className="mb-6">
              <Text className="text-sm font-inter-medium text-typography-500 mb-1.5 ml-1">
                Current Password
              </Text>
              <HStack className="bg-background-0 border border-outline-200 rounded-xl px-4 items-center">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                  style={{
                    flex: 1,
                    fontSize: 16,
                    fontFamily: 'Inter-Regular',
                    color: isDark ? '#f5f5f5' : '#262627',
                    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
                  }}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={iconColors.muted} />
                  ) : (
                    <Eye size={20} color={iconColors.muted} />
                  )}
                </Pressable>
              </HStack>
            </VStack>

            <Pressable
              onPress={handleChangeEmail}
              disabled={loading || !password}
              style={({ pressed }) => ({
                opacity: pressed || loading || !password ? 0.7 : 1,
              })}
            >
              <Box className="bg-primary-500 py-4 rounded-xl items-center">
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-typography-0 text-base font-inter-bold">
                    Change Email
                  </Text>
                )}
              </Box>
            </Pressable>

            <Text className="text-typography-400 text-xs font-inter-regular text-center mt-4">
              You will be logged out after changing your email
            </Text>
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

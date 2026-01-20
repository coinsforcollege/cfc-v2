import { useState, useEffect, useRef } from 'react';
import { TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { authApi } from '@/src/api/auth';
import { useAuth } from '@/src/contexts/AuthContext';

export default function VerifyOTPScreen() {
  const params = useLocalSearchParams<{
    email: string;
    name?: string;
    phone?: string;
    password?: string;
    flow: 'registration' | 'forgot-password';
  }>();

  const { setAuthData } = useAuth();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(30);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleOtpChange = (value: string, index: number) => {
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError(null);

    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (params.flow === 'registration') {
        const verifyResult = await authApi.verifyOTP(params.email, otpString, 'student');

        if (verifyResult.success && verifyResult.data?.verificationToken) {
          const registerResult = await authApi.registerStudent({
            name: params.name!,
            email: params.email,
            phone: params.phone!,
            password: params.password!,
            verificationToken: verifyResult.data.verificationToken,
          });

          if (registerResult.success && registerResult.data && registerResult.token) {
            await setAuthData(registerResult.data, registerResult.token);
            router.replace('/(app)');
          } else {
            setError(registerResult.message);
          }
        } else {
          setError(verifyResult.message);
        }
      } else if (params.flow === 'forgot-password') {
        const verifyResult = await authApi.verifyForgotPasswordOTP(params.email, otpString);

        if (verifyResult.success && verifyResult.data?.verificationToken) {
          router.push({
            pathname: '/(auth)/reset-password',
            params: {
              email: params.email,
              verificationToken: verifyResult.data.verificationToken,
            },
          });
        } else {
          setError(verifyResult.message);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setError(null);
    setSuccess(null);
    setIsResending(true);

    try {
      let result;
      if (params.flow === 'registration') {
        result = await authApi.resendOTP(params.email, 'student');
      } else {
        result = await authApi.sendForgotPasswordOTP(params.email);
      }

      if (result.success) {
        setSuccess('New code sent to your email');
        setResendCooldown(30);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(result.message);
        if (result.waitTime) setResendCooldown(result.waitTime);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <Box className="flex-1 bg-background-0">
        {/* Top accent bar */}
        <Box className="h-2 bg-primary-600" />
        
        <Box className="flex-1 px-6 pt-12 pb-8">
          <VStack className="w-full max-w-[400px] self-center flex-1 justify-between">
            <VStack space="3xl">
              {/* Header - Swiss left-aligned */}
              <VStack space="lg">
                <HStack className="justify-between items-center">
                  <Text className="text-typography-500 text-sm font-medium tracking-widest uppercase">
                    Verification
                  </Text>
                  <Box className="bg-primary-100 px-3 py-1">
                    <Text className="text-primary-700 text-xs font-bold tracking-wide">
                      {params.flow === 'registration' ? 'Step 2/2' : 'Step 2'}
                    </Text>
                  </Box>
                </HStack>
                <Heading size="4xl" className="text-typography-950 font-bold">
                  Enter code
                </Heading>
                <VStack space="xs">
                  <Text className="text-typography-600 text-base">
                    We sent a 6-digit code to
                  </Text>
                  <Text className="text-typography-950 text-base font-semibold">
                    {params.email}
                  </Text>
                </VStack>
              </VStack>

              {/* Success */}
              {success && (
                <Box className="border-l-4 border-l-success-600 bg-success-50 p-4">
                  <Text className="text-typography-900 text-sm">{success}</Text>
                </Box>
              )}

              {/* Error */}
              {error && (
                <Box className="border-l-4 border-l-error-600 bg-error-50 p-4">
                  <Text className="text-typography-900 text-sm">{error}</Text>
                </Box>
              )}

              {/* OTP Input */}
              <VStack space="lg">
                <Text className="text-typography-900 text-sm font-semibold tracking-wide">
                  Verification code
                </Text>
                <HStack space="sm" className="justify-between">
                  {otp.map((digit, index) => (
                    <Input
                      key={index}
                      size="xl"
                      variant="outline"
                      className={`flex-1 max-w-[52px] h-14 border-2 rounded-none ${
                        digit ? 'border-primary-600 bg-primary-50' : 'border-outline-300 bg-background-0'
                      }`}
                    >
                      <InputField
                        ref={(ref: TextInput | null) => (inputRefs.current[index] = ref)}
                        value={digit}
                        onChangeText={(v) => handleOtpChange(v, index)}
                        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                        keyboardType="number-pad"
                        maxLength={1}
                        className="text-center text-typography-950 text-2xl font-bold"
                      />
                    </Input>
                  ))}
                </HStack>
              </VStack>

              {/* Verify Button */}
              <Button
                size="xl"
                action="primary"
                className="bg-typography-950 rounded-none h-14"
                onPress={handleVerify}
                disabled={isLoading || otp.join('').length !== 6}
              >
                {isLoading && <ButtonSpinner color="white" />}
                <ButtonText className="text-typography-0 font-semibold text-base tracking-wide">
                  {isLoading ? 'Verifying...' : 'Verify'}
                </ButtonText>
              </Button>

              {/* Resend */}
              <VStack space="md">
                <Text className="text-typography-600 text-sm">Didn't receive the code?</Text>
                {resendCooldown > 0 ? (
                  <HStack space="xs" className="items-center">
                    <Box className="w-6 h-6 bg-outline-200 items-center justify-center">
                      <Text className="text-typography-700 text-xs font-bold">{resendCooldown}</Text>
                    </Box>
                    <Text className="text-typography-500 text-sm">seconds to resend</Text>
                  </HStack>
                ) : (
                  <Pressable onPress={handleResend} disabled={isResending} className="self-start py-1">
                    <Text className="text-primary-600 font-semibold text-sm">
                      {isResending ? 'Sending...' : 'Resend code'}
                    </Text>
                  </Pressable>
                )}
              </VStack>
            </VStack>

            {/* Back */}
            <VStack space="lg" className="pt-8">
              <Box className="h-px bg-outline-200" />
              <Pressable onPress={() => router.back()} className="py-2">
                <Text className="text-typography-600 text-sm">Go back</Text>
              </Pressable>
            </VStack>
          </VStack>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
}

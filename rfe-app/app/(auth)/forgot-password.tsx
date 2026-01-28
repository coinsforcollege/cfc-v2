import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Linking, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { authApi } from '@/src/api/auth';
import config from '@/src/config';

export default function ForgotPasswordScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNonStudentInfo, setShowNonStudentInfo] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setShowNonStudentInfo(false);

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authApi.sendForgotPasswordOTP(email.trim().toLowerCase());

      if (result.success) {
        router.push({
          pathname: '/(auth)/verify-otp',
          params: {
            email: email.trim().toLowerCase(),
            flow: 'forgot-password',
          },
        });
      } else {
        if (result.message?.includes('not exist')) {
          setShowNonStudentInfo(true);
        }
        setError(result.message);
      }
    } catch (err: any) {
      if (err.message?.includes('not exist')) {
        setShowNonStudentInfo(true);
      }
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Box className="flex-1 bg-background-0" style={{ paddingTop: insets.top }}>
          {/* Top accent bar */}
          <Box className="h-2 bg-primary-600" />

          <Box className="flex-1 px-6 pt-6" style={{ paddingBottom: insets.bottom + 16 }}>
            <VStack className="w-full max-w-[400px] self-center flex-1 justify-between">
              <VStack space="3xl">
              {/* Branding */}
              <HStack space="md" className="items-center">
                <Image
                  source={require('@/assets/icon.png')}
                  style={{ width: 48, height: 48, borderRadius: 12 }}
                />
                <VStack>
                  <Text className="text-typography-950 text-lg font-bold">
                    Rewards For Education
                  </Text>
                  <Text className="text-typography-500 text-xs">
                    Student Portal
                  </Text>
                </VStack>
              </HStack>

              {/* Header */}
              <VStack space="sm">
                <HStack className="justify-between items-center">
                  <Heading size="4xl" className="text-typography-950 font-bold">
                    Reset password
                  </Heading>
                  <Box className="bg-primary-100 px-3 py-1">
                    <Text className="text-primary-700 text-xs font-bold tracking-wide">
                      Step 1
                    </Text>
                  </Box>
                </HStack>
                <Text className="text-typography-600 text-base">
                  Enter your email to receive a verification code.
                </Text>
              </VStack>

              {/* Error */}
              {error && (
                <Box className="border-l-4 border-l-error-600 bg-error-50 p-4">
                  <Text className="text-typography-900 text-sm">{error}</Text>
                </Box>
              )}

              {/* Non-student info */}
              {showNonStudentInfo && (
                <Box className="border-l-4 border-l-info-600 bg-info-50 p-4">
                  <VStack space="sm">
                    <Text className="text-typography-900 font-semibold">Account not found</Text>
                    <Text className="text-typography-700 text-sm">
                      This app is for student accounts only. For other account types, reset your password on the website.
                    </Text>
                    <Pressable onPress={() => Linking.openURL(config.mainWebsiteUrl)} className="self-start py-1">
                      <Text className="text-primary-600 font-semibold text-sm">Open Website</Text>
                    </Pressable>
                  </VStack>
                </Box>
              )}

              {/* Form */}
              <VStack space="2xl">
                <VStack space="sm">
                  <Text className="text-typography-900 text-sm font-semibold tracking-wide">
                    Email
                  </Text>
                  <Input size="xl" variant="outline" className="border-2 border-outline-300 bg-background-0 rounded-none">
                    <InputField
                      placeholder="you@example.com"
                      value={email}
                      onChangeText={(v) => {
                        setEmail(v);
                        setError(null);
                        setShowNonStudentInfo(false);
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="text-typography-900"
                    />
                  </Input>
                </VStack>

                <Button
                  size="xl"
                  action="primary"
                  className="bg-typography-950 rounded-none h-14"
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading && <ButtonSpinner color="white" />}
                  <ButtonText className="text-typography-0 font-semibold text-base tracking-wide">
                    {isLoading ? 'Sending...' : 'Send code'}
                  </ButtonText>
                </Button>
              </VStack>
              </VStack>

              {/* Bottom section */}
              <VStack space="lg" className="pt-8">
                <Box className="h-px bg-outline-200" />

                <HStack className="justify-between items-center">
                  <Text className="text-typography-600 text-sm">Remember your password?</Text>
                  <Pressable onPress={() => router.push('/(auth)/login')} className="py-2">
                    <Text className="text-primary-600 font-semibold text-sm">Sign in</Text>
                  </Pressable>
                </HStack>
              </VStack>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Linking, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Alert, AlertText } from '@/components/ui/alert';
import { Pressable } from '@/components/ui/pressable';
import { useAuth } from '@/src/contexts/AuthContext';
import { useRecaptcha } from '@/src/hooks/useRecaptcha';
import config from '@/src/config';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { login } = useAuth();
  const { executeRecaptcha, isLoaded, isRequired } = useRecaptcha();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNonStudentAlert, setShowNonStudentAlert] = useState(false);

  const handleLogin = async () => {
    setError(null);
    setShowNonStudentAlert(false);

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (isRequired && !isLoaded) {
      setError('Security verification loading. Please wait.');
      return;
    }

    setIsLoading(true);

    try {
      let recaptchaToken: string | undefined;
      if (isRequired) {
        const token = await executeRecaptcha('login');
        if (!token) {
          setError('Security verification failed. Please refresh and try again.');
          setIsLoading(false);
          return;
        }
        recaptchaToken = token;
      }

      const result = await login(email.trim().toLowerCase(), password, recaptchaToken);

      if (result.success) {
        router.replace('/(app)');
      } else if (result.isNonStudent) {
        setShowNonStudentAlert(true);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
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
                <Heading size="4xl" className="text-typography-950 font-bold">
                  Sign in
                </Heading>

                {/* Non-student alert */}
                {showNonStudentAlert && (
                  <Box className="border-l-4 border-l-info-600 bg-info-50 p-4">
                    <VStack space="sm">
                      <Text className="text-typography-900 font-semibold">Students only</Text>
                      <Text className="text-typography-700 text-sm">
                        This app is for student accounts. Visit the website for other account types.
                      </Text>
                      <Pressable onPress={() => Linking.openURL(config.mainWebsiteUrl)}>
                        <Text className="text-primary-600 font-semibold text-sm">Open Website</Text>
                      </Pressable>
                    </VStack>
                  </Box>
                )}

                {/* Error */}
                {error && (
                  <Box className="border-l-4 border-l-error-600 bg-error-50 p-4">
                    <Text className="text-typography-900 text-sm">{error}</Text>
                  </Box>
                )}

                {/* Form */}
                <VStack space="2xl">
                  {/* Email */}
                  <VStack space="sm">
                    <Text className="text-typography-900 text-sm font-semibold tracking-wide">
                      Email
                    </Text>
                    <Input size="xl" variant="outline" className="border-2 border-outline-300 bg-background-0 rounded-none">
                      <InputField
                        placeholder="you@example.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        className="text-typography-900"
                      />
                    </Input>
                  </VStack>

                  {/* Password */}
                  <VStack space="sm">
                    <Text className="text-typography-900 text-sm font-semibold tracking-wide">
                      Password
                    </Text>
                    <Input size="xl" variant="outline" className="border-2 border-outline-300 bg-background-0 rounded-none">
                      <InputField
                        placeholder="Enter password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        className="text-typography-900"
                      />
                      <InputSlot className="pr-4" onPress={() => setShowPassword(!showPassword)}>
                        <Text className="text-primary-600 text-sm font-semibold">
                          {showPassword ? 'Hide' : 'Show'}
                        </Text>
                      </InputSlot>
                    </Input>
                  </VStack>

                  {/* Forgot Password */}
                  <Pressable onPress={() => router.push('/(auth)/forgot-password')} className="self-start py-1">
                    <Text className="text-primary-600 font-semibold text-sm">
                      Forgot password?
                    </Text>
                  </Pressable>

                  {/* Login Button */}
                  <Button
                    size="xl"
                    action="primary"
                    className="bg-typography-950 rounded-none h-14"
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading && <ButtonSpinner color="white" />}
                    <ButtonText className="text-typography-0 font-semibold text-base tracking-wide">
                      {isLoading ? 'Signing in...' : 'Sign in'}
                    </ButtonText>
                  </Button>
                </VStack>
              </VStack>

              {/* Bottom section */}
              <VStack space="lg" className="pt-8">
                {/* Divider */}
                <Box className="h-px bg-outline-200" />
                
                {/* Sign up link */}
                <HStack className="justify-between items-center">
                  <Text className="text-typography-600 text-sm">No account yet?</Text>
                  <Pressable onPress={() => router.push('/(auth)/register')} className="py-2">
                    <Text className="text-primary-600 font-semibold text-sm">Create account</Text>
                  </Pressable>
                </HStack>

                {/* reCAPTCHA notice (web only) */}
                {Platform.OS === 'web' && (
                  <Text className="text-typography-400 text-xs">
                    Protected by reCAPTCHA
                  </Text>
                )}
              </VStack>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

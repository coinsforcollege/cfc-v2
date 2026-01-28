import { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { authApi } from '@/src/api/auth';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return false;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Phone number must have at least 10 digits');
      return false;
    }
    if (!password) {
      setError('Please enter a password');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setError(null);
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await authApi.sendOTPForStudent({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      if (result.success) {
        router.push({
          pathname: '/(auth)/verify-otp',
          params: {
            email: formData.email.trim().toLowerCase(),
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
            flow: 'registration',
          },
        });
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
                <HStack className="justify-between items-center">
                  <Heading size="4xl" className="text-typography-950 font-bold">
                    Register
                  </Heading>
                  <Box className="bg-primary-100 px-3 py-1">
                    <Text className="text-primary-700 text-xs font-bold tracking-wide">
                      Step 1/2
                    </Text>
                  </Box>
                </HStack>

                {/* Error */}
                {error && (
                  <Box className="border-l-4 border-l-error-600 bg-error-50 p-4">
                    <Text className="text-typography-900 text-sm">{error}</Text>
                  </Box>
                )}

                {/* Form */}
                <VStack space="2xl">
                {/* Name */}
                <VStack space="sm">
                  <Text className="text-typography-900 text-sm font-semibold tracking-wide">
                    Full name
                  </Text>
                  <Input size="xl" variant="outline" className="border-2 border-outline-300 bg-background-0 rounded-none">
                    <InputField
                      placeholder="John Doe"
                      value={formData.name}
                      onChangeText={(v) => updateField('name', v)}
                      autoCapitalize="words"
                      className="text-typography-900"
                    />
                  </Input>
                </VStack>

                {/* Email */}
                <VStack space="sm">
                  <Text className="text-typography-900 text-sm font-semibold tracking-wide">
                    Email
                  </Text>
                  <Input size="xl" variant="outline" className="border-2 border-outline-300 bg-background-0 rounded-none">
                    <InputField
                      placeholder="you@example.com"
                      value={formData.email}
                      onChangeText={(v) => updateField('email', v)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      className="text-typography-900"
                    />
                  </Input>
                </VStack>

                {/* Phone */}
                <VStack space="sm">
                  <Text className="text-typography-900 text-sm font-semibold tracking-wide">
                    Phone number
                  </Text>
                  <Input size="xl" variant="outline" className="border-2 border-outline-300 bg-background-0 rounded-none">
                    <InputField
                      placeholder="+1 234 567 8900"
                      value={formData.phone}
                      onChangeText={(v) => updateField('phone', v)}
                      keyboardType="phone-pad"
                      className="text-typography-900"
                    />
                  </Input>
                </VStack>

                {/* Divider */}
                <Box className="h-px bg-outline-200" />

                {/* Password fields in same row */}
                <HStack space="md">
                  {/* Password */}
                  <VStack space="sm" className="flex-1">
                    <Text className="text-typography-900 text-sm font-semibold tracking-wide">
                      Password
                    </Text>
                    <Input size="xl" variant="outline" className="border-2 border-outline-300 bg-background-0 rounded-none">
                      <InputField
                        placeholder="Min. 6 chars"
                        value={formData.password}
                        onChangeText={(v) => updateField('password', v)}
                        secureTextEntry={!showPassword}
                        className="text-typography-900"
                      />
                    </Input>
                  </VStack>

                  {/* Confirm Password */}
                  <VStack space="sm" className="flex-1">
                    <Text className="text-typography-900 text-sm font-semibold tracking-wide">
                      Confirm
                    </Text>
                    <Input size="xl" variant="outline" className="border-2 border-outline-300 bg-background-0 rounded-none">
                      <InputField
                        placeholder="Re-enter"
                        value={formData.confirmPassword}
                        onChangeText={(v) => updateField('confirmPassword', v)}
                        secureTextEntry={!showPassword}
                        className="text-typography-900"
                      />
                    </Input>
                  </VStack>
                </HStack>

                {/* Show/Hide password toggle */}
                <Pressable onPress={() => setShowPassword(!showPassword)} className="self-start">
                  <Text className="text-primary-600 text-sm font-semibold">
                    {showPassword ? 'Hide passwords' : 'Show passwords'}
                  </Text>
                </Pressable>

                {/* Register Button */}
                <Button
                  size="xl"
                  action="primary"
                  className="bg-typography-950 rounded-none h-14"
                  onPress={handleRegister}
                  disabled={isLoading}
                >
                  {isLoading && <ButtonSpinner color="white" />}
                  <ButtonText className="text-typography-0 font-semibold text-base tracking-wide">
                    {isLoading ? 'Sending code...' : 'Continue'}
                  </ButtonText>
                </Button>
                </VStack>
              </VStack>

              {/* Bottom section */}
              <VStack space="lg" className="pt-8">
                {/* Divider */}
                <Box className="h-px bg-outline-200" />
                
                {/* Sign in link */}
                <HStack className="justify-between items-center">
                  <Text className="text-typography-600 text-sm">Have an account?</Text>
                  <Pressable onPress={() => router.push('/(auth)/login')} className="py-2">
                    <Text className="text-primary-600 font-semibold text-sm">Sign in</Text>
                  </Pressable>
                </HStack>

                {/* Terms notice */}
                <Text className="text-typography-500 text-xs leading-relaxed">
                  By registering, you agree to our Terms of Service and Privacy Policy.
                </Text>
              </VStack>
            </VStack>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

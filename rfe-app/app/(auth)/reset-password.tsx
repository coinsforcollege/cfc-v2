import { useState } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { authApi } from '@/src/api/auth';

export default function ResetPasswordScreen() {
  const params = useLocalSearchParams<{
    email: string;
    verificationToken: string;
  }>();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);

    if (!password) {
      setError('Please enter a new password');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const result = await authApi.resetPassword(params.email, password, params.verificationToken);

      if (result.success) {
        setIsSuccess(true);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <Box className="flex-1 bg-background-0">
        {/* Top accent bar - success color */}
        <Box className="h-2 bg-success-600" />
        
        <Box className="flex-1 px-6 pt-16 pb-8">
          <VStack className="w-full max-w-[400px] self-center flex-1 justify-between">
            <VStack space="3xl">
              {/* Success indicator */}
              <Box className="w-16 h-16 bg-success-100 border-2 border-success-600 items-center justify-center">
                <Text className="text-success-700 text-3xl font-bold">+</Text>
              </Box>

              {/* Header */}
              <VStack space="lg">
                <Text className="text-typography-500 text-sm font-medium tracking-widest uppercase">
                  Complete
                </Text>
                <Heading size="4xl" className="text-typography-950 font-bold">
                  Password reset
                </Heading>
                <Text className="text-typography-600 text-base">
                  Your password has been updated. You can now sign in with your new password.
                </Text>
              </VStack>

              {/* Sign in button */}
              <Button
                size="xl"
                action="primary"
                className="bg-typography-950 rounded-none h-14"
                onPress={() => router.replace('/(auth)/login')}
              >
                <ButtonText className="text-typography-0 font-semibold text-base tracking-wide">
                  Sign in
                </ButtonText>
              </Button>
            </VStack>
          </VStack>
        </Box>
      </Box>
    );
  }

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
                    Account Recovery
                  </Text>
                  <Box className="bg-primary-100 px-3 py-1">
                    <Text className="text-primary-700 text-xs font-bold tracking-wide">
                      Final Step
                    </Text>
                  </Box>
                </HStack>
                <Heading size="4xl" className="text-typography-950 font-bold">
                  New password
                </Heading>
                <VStack space="xs">
                  <Text className="text-typography-600 text-base">
                    Create a new password for
                  </Text>
                  <Text className="text-typography-950 text-base font-semibold">
                    {params.email}
                  </Text>
                </VStack>
              </VStack>

              {/* Error */}
              {error && (
                <Box className="border-l-4 border-l-error-600 bg-error-50 p-4">
                  <Text className="text-typography-900 text-sm">{error}</Text>
                </Box>
              )}

              {/* Form */}
              <VStack space="2xl">
                <VStack space="sm">
                  <Text className="text-typography-900 text-sm font-semibold tracking-wide">
                    New password
                  </Text>
                  <Input size="xl" variant="outline" className="border-2 border-outline-300 bg-background-0 rounded-none">
                    <InputField
                      placeholder="Min. 6 characters"
                      value={password}
                      onChangeText={(v) => {
                        setPassword(v);
                        setError(null);
                      }}
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

                <VStack space="sm">
                  <Text className="text-typography-900 text-sm font-semibold tracking-wide">
                    Confirm password
                  </Text>
                  <Input size="xl" variant="outline" className="border-2 border-outline-300 bg-background-0 rounded-none">
                    <InputField
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChangeText={(v) => {
                        setConfirmPassword(v);
                        setError(null);
                      }}
                      secureTextEntry={!showPassword}
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
                    {isLoading ? 'Resetting...' : 'Reset password'}
                  </ButtonText>
                </Button>
              </VStack>
            </VStack>
          </VStack>
        </Box>
      </Box>
    </KeyboardAvoidingView>
  );
}

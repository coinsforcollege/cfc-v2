import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/src/contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
      <Box className="flex-1 bg-background-0 px-6 py-4">
        <VStack className="w-full max-w-[500px] self-center flex-1" space="xl">
          {/* Header */}
          <VStack space="xs">
            <Text className="text-typography-500">Welcome back,</Text>
            <Heading size="2xl" className="text-typography-900">
              {user?.name || 'Student'}
            </Heading>
          </VStack>

          {/* Content */}
          <VStack className="flex-1 justify-center" space="lg">
            <Card className="bg-primary-50 p-8 rounded-2xl items-center">
              <Text className="text-6xl mb-4">🎓</Text>
              <Heading size="lg" className="text-typography-900 text-center">
                Dashboard Coming Soon
              </Heading>
              <Text className="text-typography-500 text-center mt-2">
                We're building something great for students. Stay tuned for updates!
              </Text>
            </Card>

            {/* User info card */}
            <Card className="bg-background-50 p-4 rounded-xl">
              <VStack space="sm">
                <HStack className="justify-between py-2">
                  <Text className="text-typography-500">Email</Text>
                  <Text className="text-typography-700 font-medium">{user?.email}</Text>
                </HStack>
                <HStack className="justify-between py-2">
                  <Text className="text-typography-500">Phone</Text>
                  <Text className="text-typography-700 font-medium">{user?.phone}</Text>
                </HStack>
                <HStack className="justify-between py-2">
                  <Text className="text-typography-500">Role</Text>
                  <Text className="text-primary-600 font-medium capitalize">{user?.role}</Text>
                </HStack>
              </VStack>
            </Card>
          </VStack>

          {/* Logout */}
          <Button
            size="xl"
            action="negative"
            variant="outline"
            className="rounded-xl"
            onPress={logout}
          >
            <ButtonText>Sign Out</ButtonText>
          </Button>
        </VStack>
      </Box>
    </SafeAreaView>
  );
}

import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';
import { useAuth } from '@/src/contexts/AuthContext';
import { ScreenContainer } from '@/components/navigation';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  return (
    <ScreenContainer label="Account" heading="Profile">
      {/* Profile card - Swiss minimal */}
      <Box 
        className="
          bg-background-0 dark:bg-background-50
          border border-outline-100 dark:border-outline-200
          p-6
        "
      >
        <VStack space="lg">
          {/* Avatar */}
          <Box 
            className="
              w-16 h-16 
              bg-primary-700 dark:bg-primary-600
              items-center justify-center
            "
          >
            <Text className="text-typography-0 text-2xl font-semibold tracking-tight">
              {user?.name?.charAt(0).toUpperCase() || 'S'}
            </Text>
          </Box>

          {/* Info rows */}
          <VStack space="sm">
            <HStack className="justify-between py-3 border-b border-outline-100 dark:border-outline-200">
              <Text 
                className="
                  text-[11px] font-medium tracking-[0.1em] uppercase 
                  text-typography-400 dark:text-typography-500
                "
              >
                Name
              </Text>
              <Text className="text-typography-900 dark:text-typography-900 font-medium text-sm">
                {user?.name || '-'}
              </Text>
            </HStack>
            <HStack className="justify-between py-3 border-b border-outline-100 dark:border-outline-200">
              <Text 
                className="
                  text-[11px] font-medium tracking-[0.1em] uppercase 
                  text-typography-400 dark:text-typography-500
                "
              >
                Email
              </Text>
              <Text className="text-typography-900 dark:text-typography-900 font-medium text-sm">
                {user?.email || '-'}
              </Text>
            </HStack>
            <HStack className="justify-between py-3">
              <Text 
                className="
                  text-[11px] font-medium tracking-[0.1em] uppercase 
                  text-typography-400 dark:text-typography-500
                "
              >
                Phone
              </Text>
              <Text className="text-typography-900 dark:text-typography-900 font-medium text-sm">
                {user?.phone || '-'}
              </Text>
            </HStack>
          </VStack>
        </VStack>
      </Box>

      {/* Sign out button */}
      <Button 
        size="lg" 
        action="negative" 
        variant="outline" 
        onPress={logout}
        className="mt-4"
      >
        <ButtonText>Sign Out</ButtonText>
      </Button>
    </ScreenContainer>
  );
}

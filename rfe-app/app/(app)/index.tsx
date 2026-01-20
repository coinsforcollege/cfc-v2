import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { useAuth } from '@/src/contexts/AuthContext';
import { ScreenContainer } from '@/components/navigation';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScreenContainer label="Welcome back" heading={user?.name || 'Student'}>
      {/* Stats cards - Swiss minimal grid */}
      <HStack space="md" className="flex-wrap">
        <Box 
          className="
            flex-1 min-w-[140px]
            bg-background-0 dark:bg-background-50
            border border-outline-100 dark:border-outline-200
            p-5
          "
        >
          <Text 
            className="
              text-[10px] font-medium tracking-[0.15em] uppercase 
              text-typography-400 dark:text-typography-500
              mb-2
            "
          >
            Pending Tasks
          </Text>
          <Heading 
            size="2xl" 
            className="text-typography-900 dark:text-typography-900 font-semibold tracking-tight"
          >
            0
          </Heading>
        </Box>
        <Box 
          className="
            flex-1 min-w-[140px]
            bg-background-0 dark:bg-background-50
            border border-outline-100 dark:border-outline-200
            p-5
          "
        >
          <Text 
            className="
              text-[10px] font-medium tracking-[0.15em] uppercase 
              text-typography-400 dark:text-typography-500
              mb-2
            "
          >
            Total Coins
          </Text>
          <Heading 
            size="2xl" 
            className="text-primary-700 dark:text-primary-500 font-semibold tracking-tight"
          >
            0
          </Heading>
        </Box>
      </HStack>

      {/* Placeholder content */}
      <Box 
        className="
          border border-dashed border-outline-200 dark:border-outline-300 
          p-10 items-center justify-center
          min-h-[200px]
        "
      >
        <Text className="text-typography-400 dark:text-typography-500 text-center text-sm">
          Home content coming soon
        </Text>
      </Box>
    </ScreenContainer>
  );
}

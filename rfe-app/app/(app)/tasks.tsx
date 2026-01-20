import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { ScreenContainer } from '@/components/navigation';

export default function TasksScreen() {
  return (
    <ScreenContainer label="Earn Coins" heading="Tasks">
      <Box 
        className="
          border border-dashed border-outline-200 dark:border-outline-300 
          p-10 items-center justify-center
          min-h-[200px]
        "
      >
        <Text className="text-typography-400 dark:text-typography-500 text-center text-sm">
          Tasks content coming soon
        </Text>
      </Box>
    </ScreenContainer>
  );
}

import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { ScreenContainer } from '@/components/navigation';
import { FeaturedReelCarousel } from '@/components/colleges/FeaturedReelCarousel';

export default function CollegesScreen() {
  return (
    <ScreenContainer label="Explore" heading="Colleges">
      {/* Featured Reel Carousel */}
      <FeaturedReelCarousel />
      
      {/* Placeholder for rest of content */}
      <Box 
        className="
          mx-4 mt-4 border border-dashed border-outline-200 dark:border-outline-300 
          p-6 items-center justify-center
          min-h-[150px] rounded-xl
        "
      >
        <Text className="text-typography-400 dark:text-typography-500 text-center text-xs">
          College list and filters coming in Step 2
        </Text>
      </Box>
    </ScreenContainer>
  );
}

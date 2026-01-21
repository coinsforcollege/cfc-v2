import { useRef, useState, useEffect } from 'react';
import { Pressable, View, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { useAuth } from '@/src/contexts/AuthContext';
import { ScreenContainer } from '@/components/navigation';
import { ListTodo, GraduationCap, Award, FileText } from '@/components/navigation/icons';

// Banner images
const bannerSubjectLeft = require('@/assets/images/subject-on-left.jpg');
const bannerSubjectRight = require('@/assets/images/subject-on-right.webp');
const bannerCollegeCampus = require('@/assets/images/college-campus.jpg');

const navItems = [
  { name: 'Tasks', icon: ListTodo, href: '/(app)/tasks', bg: 'bg-primary-500', shadow: 'border-primary-700' },
  { name: 'Colleges', icon: GraduationCap, href: '/(app)/colleges', bg: 'bg-success-500', shadow: 'border-success-700' },
  { name: 'Offers', icon: Award, href: '/(app)/offers', bg: 'bg-warning-500', shadow: 'border-warning-700' },
  { name: 'Docs', icon: FileText, href: '/(app)/documents', bg: 'bg-info-500', shadow: 'border-info-700' },
];

const dummyTasks = [
  { 
    id: 1, 
    title: 'Complete your profile', 
    coins: 50, 
    difficulty: 'Easy', 
    completed: false,
    color: '#3b82f6',
    image: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100&h=100&fit=crop',
  },
  { 
    id: 2, 
    title: 'Take career assessment quiz', 
    coins: 100, 
    difficulty: 'Medium', 
    completed: false,
    color: '#8b5cf6',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=100&h=100&fit=crop',
  },
  { 
    id: 3, 
    title: 'Upload 10th marksheet', 
    coins: 75, 
    difficulty: 'Easy', 
    completed: true,
    color: '#10b981',
    image: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=100&h=100&fit=crop',
  },
  { 
    id: 4, 
    title: 'Watch college selection video', 
    coins: 25, 
    difficulty: 'Easy', 
    completed: false,
    color: '#f59e0b',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=100&h=100&fit=crop',
  },
  { 
    id: 5, 
    title: 'Add 3 colleges to wishlist', 
    coins: 60, 
    difficulty: 'Medium', 
    completed: false,
    color: '#ec4899',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=100&h=100&fit=crop',
  },
];

interface Task {
  id: number;
  title: string;
  coins: number;
  difficulty: string;
  completed: boolean;
  color: string;
  image: string;
}

function TaskCard({ task }: { task: Task }) {
  // Use semantic theme variables for colors
  const bgColor = task.completed 
    ? 'rgb(var(--color-background-50))' 
    : `${task.color}15`;
  const borderColor = task.completed 
    ? 'rgb(var(--color-outline-200))' 
    : `${task.color}40`;
  
  return (
    <Pressable
      onPress={() => router.push('/(app)/tasks')}
      style={({ pressed }) => ({ 
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <Box 
        className={`
          flex-row rounded-2xl overflow-hidden border-2
          ${task.completed 
            ? 'bg-background-50 border-outline-200' 
            : 'border-transparent'}
        `}
        style={!task.completed ? { 
          backgroundColor: `${task.color}15`,
          borderColor: `${task.color}40`,
        } : undefined}
      >
        {/* Image thumbnail */}
        <Image
          source={{ uri: task.image }}
          style={{
            width: 70,
            height: 70,
            margin: 12,
            borderRadius: 12,
            opacity: task.completed ? 0.5 : 1,
          }}
        />
        
        {/* Content */}
        <View style={{ flex: 1, paddingVertical: 12, paddingRight: 12, justifyContent: 'center' }}>
          <Text 
            className={`
              text-base font-bold mb-1.5
              ${task.completed 
                ? 'text-typography-400 line-through' 
                : 'text-typography-950'}
            `}
          >
            {task.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Box 
              className={`
                px-[10px] py-1 rounded-md
                ${task.completed ? 'bg-outline-200' : ''}
              `}
              style={!task.completed ? { backgroundColor: task.color } : undefined}
            >
              <Text 
                className="text-typography-0 text-xs font-extrabold tracking-wider uppercase"
              >
                {task.difficulty}
              </Text>
            </Box>
            <Box 
              className={`
                px-[10px] py-[4px] rounded-md flex-row items-center
                ${task.completed ? 'bg-outline-200' : 'bg-warning-400'}
              `}
            >
              <Text 
                className={`
                  text-xs font-extrabold
                  ${task.completed ? 'text-typography-500' : 'text-warning-950'}
                `}
              >
                +{task.coins} SP
              </Text>
            </Box>
          </View>
        </View>
        
        {/* Checkmark for completed */}
        {task.completed && (
          <Box 
            className="w-8 h-8 rounded-full bg-success-500 items-center justify-center self-center mr-3"
          >
            <Text className="text-typography-0 text-base font-bold">✓</Text>
          </Box>
        )}
      </Box>
    </Pressable>
  );
}

interface NavCardProps {
  name: string;
  icon: React.ComponentType<{ size: number; strokeWidth: number; color: string }>;
  href: string;
  bg: string;
  shadow: string;
}

function NavCard({ name, icon: Icon, href, bg, shadow }: NavCardProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Pressable
        onPress={() => router.push(href as any)}
        style={({ pressed }) => ({ 
          transform: [{ scale: pressed ? 0.95 : 1 }],
        })}
      >
        <Box
          className={`
            ${bg} ${shadow} 
            w-14 h-14 rounded-full 
            items-center justify-center 
            border-b-[3px]
          `}
        >
          <Icon size={24} strokeWidth={1.5} color="#ffffff" />
        </Box>
      </Pressable>
      <Text 
        className="text-xs font-semibold text-typography-600 text-center mt-1.5"
      >
        {name}
      </Text>
    </View>
  );
}

// Banner 1: Subject on left - text on right side, bold italic style
function Banner1({ width }: { width: number }) {
  return (
    <View style={{ width, height: 160, borderRadius: 16, overflow: 'hidden' }}>
      <Image
        source={bannerSubjectLeft}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        resizeMode="cover"
      />
      <View style={{ 
        position: 'absolute', 
        right: 16, 
        top: 0, 
        bottom: 0, 
        justifyContent: 'center',
        width: '55%',
      }}>
        <Text style={{
          fontSize: 28,
          fontWeight: '900',
          fontStyle: 'italic',
          color: '#ffffff',
          textShadowColor: 'rgba(0,0,0,0.8)',
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 4,
          textAlign: 'right',
        }}>
          EARN{'\n'}SCHOLARSHIP{'\n'}POINTS
        </Text>
        <Text style={{
          fontSize: 12,
          fontWeight: '600',
          color: '#fbbf24',
          textShadowColor: 'rgba(0,0,0,0.9)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
          textAlign: 'right',
          marginTop: 4,
          letterSpacing: 2,
        }}>
          COMPLETE DAILY TASKS
        </Text>
      </View>
    </View>
  );
}

// Banner 2: College campus - centered elegant style with overlay
function Banner2({ width }: { width: number }) {
  return (
    <View style={{ width, height: 160, borderRadius: 16, overflow: 'hidden' }}>
      <Image
        source={bannerCollegeCampus}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        resizeMode="cover"
      />
      {/* Dark overlay for text readability */}
      <View style={{ 
        position: 'absolute', 
        left: 0,
        right: 0,
        top: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(0,0,0,0.4)',
      }} />
      <View style={{ 
        position: 'absolute', 
        left: 0,
        right: 0,
        top: 0, 
        bottom: 0, 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '400',
          color: '#ffffff',
          textShadowColor: 'rgba(0,0,0,0.9)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 6,
          letterSpacing: 4,
          textTransform: 'uppercase',
        }}>
          Receive up to
        </Text>
        <Text style={{
          fontSize: 48,
          fontWeight: '900',
          color: '#ffffff',
          textShadowColor: 'rgba(0,0,0,0.9)',
          textShadowOffset: { width: 3, height: 3 },
          textShadowRadius: 8,
        }}>
          100%
        </Text>
        <Text style={{
          fontSize: 18,
          fontWeight: '700',
          color: '#fbbf24',
          textShadowColor: 'rgba(0,0,0,0.9)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 4,
          letterSpacing: 1,
        }}>
          SCHOLARSHIP
        </Text>
      </View>
    </View>
  );
}

// Banner 3: Subject on right - text on left, question style with gradient
function Banner3({ width }: { width: number }) {
  return (
    <View style={{ width, height: 160, borderRadius: 16, overflow: 'hidden' }}>
      <Image
        source={bannerSubjectRight}
        style={{ width: '100%', height: '100%', position: 'absolute' }}
        resizeMode="cover"
      />
      {/* Gradient: dark on left, transparent on right */}
      <LinearGradient
        colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)', 'transparent']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '70%',
        }}
      />
      <View style={{ 
        position: 'absolute', 
        left: 16, 
        top: 0, 
        bottom: 0, 
        justifyContent: 'center',
        width: '50%',
      }}>
        <Text style={{
          fontSize: 13,
          fontWeight: '500',
          color: '#ffffff',
          textShadowColor: 'rgba(0,0,0,0.5)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}>
          How ready
        </Text>
        <Text style={{
          fontSize: 13,
          fontWeight: '500',
          color: '#ffffff',
          textShadowColor: 'rgba(0,0,0,0.5)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 3,
          letterSpacing: 3,
          textTransform: 'uppercase',
        }}>
          are you for
        </Text>
        <Text style={{
          fontSize: 36,
          fontWeight: '900',
          color: '#10b981',
          textShadowColor: 'rgba(0,0,0,0.7)',
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 4,
          marginTop: 2,
        }}>
          COLLEGE?
        </Text>
        <Text style={{
          fontSize: 11,
          fontWeight: '600',
          color: '#ffffff',
          textShadowColor: 'rgba(0,0,0,0.5)',
          textShadowOffset: { width: 1, height: 1 },
          textShadowRadius: 2,
          marginTop: 6,
          letterSpacing: 1,
        }}>
          Take the readiness quiz
        </Text>
      </View>
    </View>
  );
}

// Banner Slider Component
function BannerSlider() {
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const totalBanners = 3;

  const gap = 12;
  const snapWidth = containerWidth + gap;

  useEffect(() => {
    if (containerWidth === 0) return;
    
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % totalBanners;
      scrollViewRef.current?.scrollTo({ x: nextIndex * snapWidth, animated: true });
      setActiveIndex(nextIndex);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [activeIndex, containerWidth, snapWidth]);

  const handleScroll = (event: any) => {
    if (containerWidth === 0) return;
    const contentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffset / snapWidth);
    if (index !== activeIndex && index >= 0 && index < totalBanners) {
      setActiveIndex(index);
    }
  };

  const handleLayout = (event: any) => {
    const { width } = event.nativeEvent.layout;
    setContainerWidth(width);
  };

  if (containerWidth === 0) {
    return (
      <View onLayout={handleLayout} style={{ width: '100%', height: 160 }} />
    );
  }

  return (
    <VStack space="sm">
      <View 
        onLayout={handleLayout}
        style={{ width: '100%', overflow: 'hidden' }}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          decelerationRate="fast"
          snapToInterval={snapWidth}
          snapToAlignment="start"
          disableIntervalMomentum={true}
        >
          <View style={{ width: containerWidth, marginRight: gap }}>
            <Banner1 width={containerWidth} />
          </View>
          <View style={{ width: containerWidth, marginRight: gap }}>
            <Banner2 width={containerWidth} />
          </View>
          <View style={{ width: containerWidth }}>
            <Banner3 width={containerWidth} />
          </View>
        </ScrollView>
      </View>
    </VStack>
  );
}

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <ScreenContainer label="Welcome back" heading={user?.name || 'Student'} showBackButton={false}>
      {/* Stats cards - Swiss minimal with colors */}
      <HStack space="sm" className="flex-wrap items-start">
        <Box 
          className="
            flex-1 min-w-[140px] bg-primary-500 
            px-3.5 py-2.5 
            border-l-[3px] border-primary-700
          "
        >
          <Text 
            className="text-xs font-semibold tracking-[0.15em] uppercase text-typography-0/80 mb-0.5"
          >
            Pending Tasks
          </Text>
          <Text 
            className="text-3xl font-extrabold text-typography-0 tracking-tighter"
          >
            0
          </Text>
        </Box>
        <Box 
          className="
            flex-1 min-w-[140px] bg-warning-400 
            px-3.5 py-2.5 
            border-l-[3px] border-warning-600
          "
        >
          <Text 
            className="text-xs font-semibold tracking-[0.15em] uppercase text-warning-950/60 mb-0.5"
          >
            Scholarship Points
          </Text>
          <Text 
            className="text-3xl font-extrabold text-warning-950 tracking-tighter"
          >
            0
          </Text>
        </Box>
      </HStack>

      {/* Navigation row - 4 items */}
      <HStack space="2xl" className="w-full">
        {navItems.map((item) => (
          <NavCard
            key={item.name}
            name={item.name}
            icon={item.icon}
            href={item.href}
            bg={item.bg}
            shadow={item.shadow}
          />
        ))}
      </HStack>

      {/* Banner slider */}
      <BannerSlider />

      {/* Tasks section */}
      <VStack space="md">
        <HStack className="justify-between items-center">
          <Text 
            className="text-sm font-medium tracking-[0.15em] uppercase text-typography-400"
          >
            Today's Tasks
          </Text>
          <Pressable onPress={() => router.push('/(app)/tasks')}>
            <Text className="text-sm font-medium text-primary-500">View all</Text>
          </Pressable>
        </HStack>

        {/* Task cards */}
        <VStack space="sm">
          {dummyTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </VStack>
      </VStack>
    </ScreenContainer>
  );
}

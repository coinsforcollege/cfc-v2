'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { Pressable, useColorScheme, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/src/contexts/AuthContext';
import {
  collegeReadinessApi,
  Checklist,
  ChecklistItem,
  ChecklistSection,
} from '@/src/api/collegeReadiness.api';
import {
  ChevronRight,
  Target,
  Globe,
  CheckCircle2,
  Circle,
  ExternalLink,
  Upload,
  Clock,
  Sparkles,
} from 'lucide-react-native';

const ICON_COLORS = {
  light: {
    primary: 'rgb(38, 38, 39)',
    secondary: 'rgb(115, 115, 115)',
    muted: 'rgb(163, 163, 163)',
  },
  dark: {
    primary: 'rgb(245, 245, 245)',
    secondary: 'rgb(212, 212, 212)',
    muted: 'rgb(140, 140, 140)',
  },
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  critical: { bg: 'bg-error-50', text: 'text-error-700', dot: '#ef4444' },
  high: { bg: 'bg-warning-50', text: 'text-warning-700', dot: '#f59e0b' },
  medium: { bg: 'bg-primary-50', text: 'text-primary-700', dot: '#8B5CF6' },
  low: { bg: 'bg-outline-50', text: 'text-typography-600', dot: '#9ca3af' },
};

const PRIORITY_ORDER = ['critical', 'high', 'medium', 'low'];

function SkeletonProgressCard() {
  return (
    <Box className="rounded-2xl overflow-hidden mb-3">
      <LinearGradient
        colors={['#1e1b4b', '#312e81']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 16 }}
      >
        <HStack className="items-center justify-between mb-3">
          <VStack>
            <Skeleton width={80} height={12} borderRadius={4} style={{ marginBottom: 6 }} />
            <Skeleton width={60} height={28} borderRadius={6} />
          </VStack>
          <Skeleton width={48} height={48} borderRadius={24} />
        </HStack>
        <Skeleton width="100%" height={8} borderRadius={4} style={{ marginBottom: 8 }} />
        <Skeleton width={120} height={12} borderRadius={4} />
      </LinearGradient>
    </Box>
  );
}

function SkeletonActionCard() {
  return (
    <Box className="bg-background-0 rounded-xl p-3 mb-2 border border-outline-100">
      <HStack className="items-center">
        <Skeleton width={24} height={24} borderRadius={12} />
        <VStack className="flex-1 ml-3">
          <Skeleton width={160} height={14} borderRadius={4} style={{ marginBottom: 4 }} />
          <Skeleton width={100} height={10} borderRadius={4} />
        </VStack>
        <Skeleton width={6} height={6} borderRadius={3} />
      </HStack>
    </Box>
  );
}

interface CompactProgressCardProps {
  checklist: Checklist;
}

function CompactProgressCard({ checklist }: CompactProgressCardProps) {
  const progressPercent = checklist.progress.percentage;

  return (
    <Pressable
      onPress={() => router.push('/(app)/college-prep')}
      style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}
    >
      <Box
        className="rounded-2xl overflow-hidden mb-3"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        <LinearGradient
          colors={['#1e1b4b', '#312e81', '#3730a3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 16 }}
        >
          <HStack className="items-center justify-between mb-3">
            <VStack>
              <Text className="text-indigo-300 text-2xs font-inter-medium uppercase tracking-widest mb-1">
                Your Progress
              </Text>
              <HStack className="items-baseline" space="xs">
                <Text className="text-white text-2xl font-inter-bold">
                  {progressPercent}%
                </Text>
                <Text className="text-indigo-300 text-xs font-inter-medium">complete</Text>
              </HStack>
            </VStack>

            <Box className="w-12 h-12 rounded-full bg-white/10 items-center justify-center">
              <Globe size={22} color="#fbbf24" />
            </Box>
          </HStack>

          {/* Progress Bar */}
          <Box className="h-2 bg-white/20 rounded-full overflow-hidden mb-2">
            <Box
              className="h-full rounded-full bg-amber-400"
              style={{ width: `${progressPercent}%` }}
            />
          </Box>

          <HStack className="items-center justify-between">
            <Text className="text-indigo-200 text-xs font-inter-regular">
              {checklist.progress.completedItems} of {checklist.progress.totalItems} tasks
            </Text>
            <HStack className="items-center">
              <Text className="text-indigo-300 text-xs font-inter-bold mr-1">
                View All
              </Text>
              <ChevronRight size={14} color="#a5b4fc" />
            </HStack>
          </HStack>
        </LinearGradient>
      </Box>
    </Pressable>
  );
}

interface ActionItemCardProps {
  item: ChecklistItem;
  sectionId: string;
  isDark: boolean;
}

function ActionItemCard({ item, sectionId, isDark }: ActionItemCardProps) {
  const priorityStyle = PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.medium;
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const handlePress = () => {
    router.push('/(app)/college-prep');
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
    >
      <Box className="bg-background-0 rounded-xl p-3 mb-2 border border-outline-100">
        <HStack className="items-center">
          {/* Circle indicator */}
          <Box
            className="w-6 h-6 rounded-full border-2 items-center justify-center"
            style={{ borderColor: isDark ? '#52525b' : '#d4d4d8' }}
          >
            <Circle size={12} color={isDark ? '#71717a' : '#a1a1aa'} />
          </Box>

          {/* Content */}
          <VStack className="flex-1 ml-3 mr-2">
            <Text
              className="text-typography-900 font-inter-medium text-sm"
              numberOfLines={1}
            >
              {item.title}
            </Text>

            {/* Action type indicator */}
            <HStack className="items-center mt-1">
              {item.actionType === 'link' && item.externalLink && (
                <HStack className="items-center">
                  <ExternalLink size={10} color={isDark ? '#60a5fa' : '#3b82f6'} />
                  <Text className="text-primary-500 text-2xs font-inter-medium ml-1">
                    Open Link
                  </Text>
                </HStack>
              )}
              {item.actionType === 'file_upload' && (
                <HStack className="items-center">
                  <Upload size={10} color={isDark ? '#a78bfa' : '#7c3aed'} />
                  <Text className="text-purple-600 text-2xs font-inter-medium ml-1">
                    Upload Required
                  </Text>
                </HStack>
              )}
              {item.deadline && (
                <HStack className="items-center ml-2">
                  <Clock size={10} color={iconColors.muted} />
                  <Text className="text-typography-400 text-2xs font-inter-medium ml-1">
                    {item.deadline}
                  </Text>
                </HStack>
              )}
            </HStack>
          </VStack>

          {/* Priority dot */}
          <Box
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: priorityStyle.dot }}
          />
        </HStack>
      </Box>
    </Pressable>
  );
}

function GenerateChecklistCTA() {
  return (
    <Pressable
      onPress={() => router.push('/(app)/college-prep')}
      style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1, transform: [{ scale: pressed ? 0.99 : 1 }] })}
    >
      <Box
        className="rounded-2xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        <LinearGradient
          colors={['#4f46e5', '#7c3aed']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 20 }}
        >
          <HStack className="items-center">
            <VStack className="flex-1 mr-4">
              <HStack className="items-center mb-2">
                <Sparkles size={18} color="#fbbf24" />
                <Text className="text-amber-300 text-xs font-inter-bold uppercase tracking-wider ml-2">
                  AI-Powered
                </Text>
              </HStack>
              <Text className="text-white text-lg font-inter-bold mb-1">
                Create Your Checklist
              </Text>
              <Text className="text-white/80 text-sm font-inter-regular">
                Get a personalized roadmap for your college journey
              </Text>
            </VStack>

            <Box className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
              <Target size={24} color="white" />
            </Box>
          </HStack>
        </LinearGradient>
      </Box>
    </Pressable>
  );
}

export function CollegeReadinessSection() {
  const { token } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(true);
  const [hasChecklist, setHasChecklist] = useState(false);
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [nextActions, setNextActions] = useState<{ item: ChecklistItem; sectionId: string }[]>([]);

  useEffect(() => {
    fetchChecklistData();
  }, [token]);

  const fetchChecklistData = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // First check if user has a checklist
      const checkResponse = await collegeReadinessApi.checkBasicData(token);

      if (checkResponse.success && checkResponse.data.hasActiveChecklist) {
        // Fetch the full checklist
        const checklistResponse = await collegeReadinessApi.getChecklist(token);

        if (checklistResponse.success && checklistResponse.data.checklist) {
          const checklistData = checklistResponse.data.checklist;
          setChecklist(checklistData);
          setHasChecklist(true);

          // Find next 2 incomplete items across all sections, sorted by priority
          const allIncompleteItems: { item: ChecklistItem; sectionId: string; priorityIndex: number }[] = [];

          for (const section of checklistData.sections) {
            for (const item of section.items) {
              if (!item.isCompleted) {
                const priorityIndex = PRIORITY_ORDER.indexOf(item.priority);
                allIncompleteItems.push({
                  item,
                  sectionId: section.sectionId,
                  priorityIndex: priorityIndex >= 0 ? priorityIndex : PRIORITY_ORDER.length,
                });
              }
            }
          }

          // Sort by priority and take first 2
          allIncompleteItems.sort((a, b) => a.priorityIndex - b.priorityIndex);
          setNextActions(allIncompleteItems.slice(0, 2).map(({ item, sectionId }) => ({ item, sectionId })));
        }
      } else {
        setHasChecklist(false);
      }
    } catch (err: any) {
      console.error('Error fetching checklist data:', err);
      setHasChecklist(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box className="mb-6 px-4">
        <HStack className="mb-3 items-center justify-between">
          <Skeleton width={150} height={22} borderRadius={4} />
          <Skeleton width={70} height={16} borderRadius={4} />
        </HStack>
        <SkeletonProgressCard />
        <SkeletonActionCard />
        <SkeletonActionCard />
      </Box>
    );
  }

  return (
    <Box className="mb-6 px-4">
      {/* Section Header */}
      <HStack className="mb-3 items-center justify-between">
        <Text className="text-typography-900 font-inter-regular text-lg tracking-tight">
          College Readiness
        </Text>
        <Pressable
          onPress={() => router.push('/(app)/college-prep')}
          hitSlop={10}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <HStack className="items-center">
            <Text className="text-sm font-inter-bold uppercase tracking-wider text-primary-600">
              View All
            </Text>
            <ChevronRight size={16} color="#4f46e5" />
          </HStack>
        </Pressable>
      </HStack>

      {hasChecklist && checklist ? (
        <>
          {/* Compact Progress Card */}
          <CompactProgressCard checklist={checklist} />

          {/* Next Action Items */}
          {nextActions.length > 0 && (
            <VStack>
              {nextActions.map(({ item, sectionId }) => (
                <ActionItemCard
                  key={item.itemId}
                  item={item}
                  sectionId={sectionId}
                  isDark={isDark}
                />
              ))}
            </VStack>
          )}
        </>
      ) : (
        <GenerateChecklistCTA />
      )}
    </Box>
  );
}

export default CollegeReadinessSection;

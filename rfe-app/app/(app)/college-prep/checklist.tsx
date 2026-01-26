import React, { useState, useCallback } from 'react';
import {
  ScrollView,
  Pressable,
  Platform,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/src/contexts/AuthContext';
import {
  collegeReadinessApi,
  Checklist,
  ChecklistSection,
  ChecklistItem,
} from '@/src/api/collegeReadiness.api';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  ExternalLink,
  Upload,
  Calculator,
  Info,
  Passport,
  Languages,
  GraduationCap,
  Wallet,
  Home,
  AlertCircle,
  Clock,
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

const SECTION_ICONS: Record<string, any> = {
  immigration: Passport,
  language: Languages,
  academics: GraduationCap,
  finance: Wallet,
  living: Home,
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  critical: { bg: 'bg-error-50', text: 'text-error-700', border: 'border-error-200' },
  high: { bg: 'bg-warning-50', text: 'text-warning-700', border: 'border-warning-200' },
  medium: { bg: 'bg-primary-50', text: 'text-primary-700', border: 'border-primary-200' },
  low: { bg: 'bg-outline-50', text: 'text-typography-600', border: 'border-outline-200' },
};

export default function ChecklistScreen() {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  const topPadding = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 24);

  const loadChecklist = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await collegeReadinessApi.getChecklist(token);
      if (response.success && response.data.checklist) {
        setChecklist(response.data.checklist);
        // Expand first section by default
        if (response.data.checklist.sections.length > 0) {
          setExpandedSections(new Set([response.data.checklist.sections[0].sectionId]));
        }
      } else {
        Alert.alert('Error', 'No checklist found');
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load checklist');
      router.back();
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      loadChecklist();
    }, [loadChecklist])
  );

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const handleToggleItem = async (section: ChecklistSection, item: ChecklistItem) => {
    if (!token || !checklist || updatingItem) return;

    // Don't allow toggling file_upload items directly (need to link document)
    if (item.actionType === 'file_upload' && !item.isCompleted) {
      Alert.alert(
        'Upload Required',
        'Please upload or link a document to complete this item.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Go to Documents',
            onPress: () => router.push('/(app)/documents'),
          },
        ]
      );
      return;
    }

    setUpdatingItem(item.itemId);
    try {
      const response = await collegeReadinessApi.updateItem(
        token,
        checklist._id,
        section.sectionId,
        item.itemId,
        { isCompleted: !item.isCompleted }
      );

      if (response.success) {
        // Update local state
        setChecklist(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            progress: response.data.progress,
            sections: prev.sections.map(s => {
              if (s.sectionId !== section.sectionId) return s;
              return {
                ...s,
                items: s.items.map(i => {
                  if (i.itemId !== item.itemId) return i;
                  return {
                    ...i,
                    isCompleted: !i.isCompleted,
                    completedAt: !i.isCompleted ? new Date().toISOString() : null,
                  };
                }),
              };
            }),
          };
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update item');
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleOpenLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open link');
    });
  };

  const getSectionIcon = (sectionId: string) => {
    const IconComponent = SECTION_ICONS[sectionId] || CheckCircle2;
    return IconComponent;
  };

  const getSectionProgress = (section: ChecklistSection) => {
    const total = section.items.length;
    const completed = section.items.filter(i => i.isCompleted).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const renderActionIcon = (item: ChecklistItem) => {
    switch (item.actionType) {
      case 'file_upload':
        return <Upload size={16} color="#8B5CF6" />;
      case 'link':
        return <ExternalLink size={16} color="#3B82F6" />;
      case 'calculation':
        return <Calculator size={16} color="#F59E0B" />;
      case 'info':
        return <Info size={16} color="#6B7280" />;
      default:
        return null;
    }
  };

  const renderItem = (section: ChecklistSection, item: ChecklistItem) => {
    const isUpdating = updatingItem === item.itemId;
    const priorityStyle = PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.medium;

    return (
      <Pressable
        key={item.itemId}
        onPress={() => handleToggleItem(section, item)}
        disabled={isUpdating}
      >
        <Box
          className={`p-4 border-b border-outline-100 ${
            item.isCompleted ? 'bg-success-50/30' : ''
          }`}
        >
          <HStack className="items-start" space="md">
            {/* Checkbox */}
            <Box className="pt-0.5">
              {isUpdating ? (
                <ActivityIndicator size="small" color="#8B5CF6" />
              ) : item.isCompleted ? (
                <CheckCircle2 size={22} color="#16a34a" />
              ) : (
                <Circle size={22} color={iconColors.muted} />
              )}
            </Box>

            {/* Content */}
            <VStack className="flex-1">
              <HStack className="items-center justify-between mb-1">
                <Text
                  className={`text-base font-inter-medium flex-1 ${
                    item.isCompleted
                      ? 'text-typography-400 line-through'
                      : 'text-typography-900'
                  }`}
                >
                  {item.title}
                </Text>
                {renderActionIcon(item)}
              </HStack>

              {item.description && (
                <Text
                  className={`text-sm font-inter-regular mb-2 ${
                    item.isCompleted ? 'text-typography-300' : 'text-typography-500'
                  }`}
                >
                  {item.description}
                </Text>
              )}

              {/* Meta info row */}
              <HStack className="items-center flex-wrap" style={{ gap: 8 }}>
                {/* Priority badge */}
                <Box className={`px-2 py-0.5 rounded-full ${priorityStyle.bg}`}>
                  <Text className={`text-xs font-inter-medium ${priorityStyle.text}`}>
                    {item.priority}
                  </Text>
                </Box>

                {/* Deadline */}
                {item.deadline && (
                  <HStack className="items-center" space="xs">
                    <Clock size={12} color={iconColors.muted} />
                    <Text className="text-xs text-typography-500 font-inter-regular">
                      {item.deadline}
                    </Text>
                  </HStack>
                )}

                {/* Action button for links */}
                {item.actionType === 'link' && item.externalLink && !item.isCompleted && (
                  <Pressable
                    onPress={() => handleOpenLink(item.externalLink!)}
                    className="ml-auto"
                  >
                    <HStack className="items-center bg-primary-100 px-2 py-1 rounded" space="xs">
                      <Text className="text-xs font-inter-medium text-primary-700">
                        Open Link
                      </Text>
                      <ExternalLink size={12} color="#7c3aed" />
                    </HStack>
                  </Pressable>
                )}

                {/* File upload indicator */}
                {item.actionType === 'file_upload' && !item.isCompleted && (
                  <Pressable
                    onPress={() => router.push('/(app)/documents')}
                    className="ml-auto"
                  >
                    <HStack className="items-center bg-secondary-100 px-2 py-1 rounded" space="xs">
                      <Text className="text-xs font-inter-medium text-secondary-700">
                        Upload
                      </Text>
                      <Upload size={12} color="#7c3aed" />
                    </HStack>
                  </Pressable>
                )}

                {/* Linked document */}
                {item.linkedDocument && (
                  <HStack className="items-center bg-success-100 px-2 py-1 rounded" space="xs">
                    <CheckCircle2 size={12} color="#16a34a" />
                    <Text className="text-xs font-inter-medium text-success-700">
                      {item.linkedDocument.name}
                    </Text>
                  </HStack>
                )}
              </HStack>

              {/* Calculation data for finance items */}
              {item.actionType === 'calculation' && item.calculationData && (
                <Box className="mt-3 p-3 bg-warning-50 rounded-xl">
                  <Text className="text-sm font-inter-bold text-warning-800 mb-2">
                    Scholarship Points Target
                  </Text>
                  <HStack className="justify-between">
                    <VStack>
                      <Text className="text-xs text-warning-600">Current Points</Text>
                      <Text className="text-lg font-inter-bold text-warning-800">
                        {item.calculationData.currentPoints}
                      </Text>
                    </VStack>
                    <VStack className="items-center">
                      <Text className="text-xs text-warning-600">Weeks Left</Text>
                      <Text className="text-lg font-inter-bold text-warning-800">
                        {item.calculationData.weeksRemaining || '?'}
                      </Text>
                    </VStack>
                    <VStack className="items-end">
                      <Text className="text-xs text-warning-600">Target Rate</Text>
                      <Text className="text-lg font-inter-bold text-warning-800">
                        {item.calculationData.suggestedTier === 'ivy' ? '300' :
                         item.calculationData.suggestedTier === 'tier1' ? '200' :
                         item.calculationData.suggestedTier === 'tier2' ? '100' : '50'} SP/wk
                      </Text>
                    </VStack>
                  </HStack>
                </Box>
              )}

              {/* Notes */}
              {item.notes && (
                <Box className="mt-2 p-2 bg-outline-50 rounded-lg">
                  <Text className="text-xs text-typography-500 font-inter-regular">
                    {item.notes}
                  </Text>
                </Box>
              )}
            </VStack>
          </HStack>
        </Box>
      </Pressable>
    );
  };

  const renderSection = (section: ChecklistSection) => {
    const isExpanded = expandedSections.has(section.sectionId);
    const progress = getSectionProgress(section);
    const IconComponent = getSectionIcon(section.sectionId);

    return (
      <Box key={section.sectionId} className="mb-4">
        {/* Section Header */}
        <Pressable onPress={() => toggleSection(section.sectionId)}>
          <HStack
            className="bg-background-0 border border-outline-200 rounded-xl p-4 items-center"
          >
            <Box className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
              <IconComponent size={20} color="#8B5CF6" />
            </Box>

            <VStack className="flex-1">
              <Text className="text-base font-inter-bold text-typography-900">
                {section.name}
              </Text>
              <HStack className="items-center" space="sm">
                <Box className="flex-1 h-1.5 bg-outline-200 rounded-full overflow-hidden">
                  <Box
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </Box>
                <Text className="text-xs font-inter-medium text-typography-500">
                  {progress.completed}/{progress.total}
                </Text>
              </HStack>
            </VStack>

            {isExpanded ? (
              <ChevronUp size={20} color={iconColors.secondary} />
            ) : (
              <ChevronDown size={20} color={iconColors.secondary} />
            )}
          </HStack>
        </Pressable>

        {/* Section Items */}
        {isExpanded && (
          <Box className="mt-2 bg-background-0 border border-outline-200 rounded-xl overflow-hidden">
            {section.items.map(item => renderItem(section, item))}
          </Box>
        )}
      </Box>
    );
  };

  if (loading) {
    return (
      <Box className="flex-1 bg-background-50 items-center justify-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-typography-500 mt-4 font-inter-medium">Loading checklist...</Text>
      </Box>
    );
  }

  if (!checklist) {
    return (
      <Box className="flex-1 bg-background-50 items-center justify-center px-8">
        <AlertCircle size={48} color="#ef4444" />
        <Text className="text-typography-900 text-lg font-inter-bold mt-4 text-center">
          No Checklist Found
        </Text>
        <Pressable
          onPress={() => router.replace('/(app)/college-prep')}
          className="mt-4"
        >
          <Box className="bg-primary-500 px-6 py-3 rounded-xl">
            <Text className="text-white font-inter-bold">Create Checklist</Text>
          </Box>
        </Pressable>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-50">
      {/* Header */}
      <HStack
        className="px-4 py-3 items-center bg-background-50 border-b border-outline-100"
        style={{ paddingTop: topPadding }}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
        >
          <Box className="w-10 h-10 items-center justify-center">
            <ChevronLeft size={24} strokeWidth={2.5} color={iconColors.primary} />
          </Box>
        </Pressable>
        <Text className="flex-1 text-lg font-inter-bold text-typography-900 text-center">
          Your Checklist
        </Text>
        <Box className="w-10 h-10" />
      </HStack>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: Math.max(insets.bottom, 40),
        }}
      >
        {/* Progress Overview */}
        <Box className="bg-primary-500 rounded-2xl p-5 mb-6">
          <HStack className="items-center justify-between mb-3">
            <Text className="text-white/80 font-inter-medium">Overall Progress</Text>
            <Text className="text-white text-2xl font-inter-bold">
              {checklist.progress.percentage}%
            </Text>
          </HStack>
          <Box className="h-3 bg-white/30 rounded-full overflow-hidden">
            <Box
              className="h-full bg-white rounded-full"
              style={{ width: `${checklist.progress.percentage}%` }}
            />
          </Box>
          <Text className="text-white/70 text-sm font-inter-regular mt-2">
            {checklist.progress.completedItems} of {checklist.progress.totalItems} items completed
          </Text>
        </Box>

        {/* Profile Summary */}
        <Box className="bg-background-0 border border-outline-200 rounded-xl p-4 mb-6">
          <Text className="text-sm font-inter-medium text-typography-500 uppercase tracking-wider mb-3">
            Your Profile
          </Text>
          <HStack className="flex-wrap" style={{ gap: 8 }}>
            <Box className="bg-primary-50 px-3 py-1.5 rounded-full">
              <Text className="text-sm font-inter-medium text-primary-700">
                {checklist.formData.fieldOfStudy}
              </Text>
            </Box>
            <Box className="bg-secondary-50 px-3 py-1.5 rounded-full">
              <Text className="text-sm font-inter-medium text-secondary-700">
                {checklist.formData.targetTier.toUpperCase()}
              </Text>
            </Box>
            <Box className="bg-success-50 px-3 py-1.5 rounded-full">
              <Text className="text-sm font-inter-medium text-success-700">
                Grade {checklist.profileSnapshot.gradeLevel}
              </Text>
            </Box>
          </HStack>
          <Text className="text-sm text-typography-500 font-inter-regular mt-2">
            Destinations: {checklist.profileSnapshot.desiredCollegeCountries.join(', ')}
          </Text>
        </Box>

        {/* Sections */}
        {checklist.sections
          .sort((a, b) => a.order - b.order)
          .map(section => renderSection(section))}
      </ScrollView>
    </Box>
  );
}

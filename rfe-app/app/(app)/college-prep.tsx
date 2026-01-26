import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  Pressable,
  Platform,
  useColorScheme,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/Skeleton';
import { UserAvatar } from '@/components/navigation/UserAvatar';
import { useAuth } from '@/src/contexts/AuthContext';
import { studentApi } from '@/src/api/student.api';
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
  Plus,
  Globe,
  Sparkles,
  X,
  ExternalLink,
  Upload,
  Calculator,
  Info,
  Passport,
  Languages,
  GraduationCap,
  Wallet,
  Home,
  Clock,
  RefreshCw,
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

const GRADE_LEVELS = ['K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

const COMMON_COUNTRIES = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Netherlands',
  'Singapore',
  'Japan',
  'South Korea',
  'India',
  'China',
];

const SECTION_ICONS: Record<string, any> = {
  immigration: Passport,
  language: Languages,
  academics: GraduationCap,
  finance: Wallet,
  living: Home,
};

const PRIORITY_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  critical: { bg: 'bg-error-50', text: 'text-error-700', dot: '#ef4444' },
  high: { bg: 'bg-warning-50', text: 'text-warning-700', dot: '#f59e0b' },
  medium: { bg: 'bg-primary-50', text: 'text-primary-700', dot: '#8B5CF6' },
  low: { bg: 'bg-outline-50', text: 'text-typography-600', dot: '#9ca3af' },
};

const SECTION_COLORS: Record<string, { bgLight: string; bgDark: string; icon: string; text: string }> = {
  immigration: { bgLight: '#dbeafe', bgDark: '#1e3a5f', icon: '#3b82f6', text: '#1e40af' },
  language: { bgLight: '#fce7f3', bgDark: '#4a1942', icon: '#ec4899', text: '#9d174d' },
  academics: { bgLight: '#d1fae5', bgDark: '#14412a', icon: '#10b981', text: '#047857' },
  finance: { bgLight: '#fef3c7', bgDark: '#4a3728', icon: '#f59e0b', text: '#b45309' },
  living: { bgLight: '#e0e7ff', bgDark: '#2e2a5a', icon: '#6366f1', text: '#4338ca' },
};

type PageState = 'loading' | 'basic-data' | 'ready' | 'has-checklist';

export default function CollegePrepScreen() {
  const { token, user } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const [pageState, setPageState] = useState<PageState>('loading');
  const [loading, setLoading] = useState(true);
  const [checklist, setChecklist] = useState<Checklist | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);

  // Basic data sheet state
  const [showBasicDataSheet, setShowBasicDataSheet] = useState(false);
  const [basicDataLoading, setBasicDataLoading] = useState(false);
  const [gradeLevel, setGradeLevel] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [desiredCountries, setDesiredCountries] = useState<string[]>([]);
  const [showGradePicker, setShowGradePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showDestinationPicker, setShowDestinationPicker] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const topPadding = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 24);

  // Fetch profile picture
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!token) return;
      try {
        const response = await studentApi.getProfile(token);
        if (response.success) {
          setProfilePicture(response.data.profilePicture || null);
        }
      } catch (error) {
        // Silently fail - avatar will show initials
      }
    };
    fetchProfilePicture();
  }, [token]);

  const checkInitialState = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await collegeReadinessApi.checkBasicData(token);

      if (response.success) {
        const { hasBasicData, hasActiveChecklist, activeChecklistId, currentData } = response.data;

        // Pre-fill current data
        if (currentData.gradeLevel) setGradeLevel(currentData.gradeLevel);
        if (currentData.country) setCountry(currentData.country);
        if (currentData.desiredCollegeCountries?.length > 0) {
          setDesiredCountries(currentData.desiredCollegeCountries);
        }

        if (hasActiveChecklist && activeChecklistId) {
          // User has a checklist - fetch it
          try {
            const checklistResponse = await collegeReadinessApi.getChecklist(token);
            if (checklistResponse.success && checklistResponse.data.checklist) {
              setChecklist(checklistResponse.data.checklist);
              // Expand first section by default
              if (checklistResponse.data.checklist.sections.length > 0) {
                setExpandedSections(new Set([checklistResponse.data.checklist.sections[0].sectionId]));
              }
              setPageState('has-checklist');
            } else {
              setPageState(hasBasicData ? 'ready' : 'basic-data');
            }
          } catch (e) {
            setPageState(hasBasicData ? 'ready' : 'basic-data');
          }
        } else if (hasBasicData) {
          setPageState('ready');
        } else {
          setPageState('basic-data');
          setShowBasicDataSheet(true);
        }
      }
    } catch (error: any) {
      console.error('Error checking initial state:', error);
      Alert.alert('Error', error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      checkInitialState();
    }, [checkInitialState])
  );

  const handleSaveBasicData = async () => {
    if (!token) return;

    if (!gradeLevel || !country || desiredCountries.length === 0) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setBasicDataLoading(true);
    try {
      await collegeReadinessApi.updateBasicData(token, {
        gradeLevel,
        country,
        desiredCollegeCountries: desiredCountries,
      });

      setShowBasicDataSheet(false);
      setPageState('ready');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save data');
    } finally {
      setBasicDataLoading(false);
    }
  };

  const handleStartForm = () => {
    router.push('/(app)/college-prep/form');
  };

  const toggleDestinationCountry = (c: string) => {
    if (desiredCountries.includes(c)) {
      setDesiredCountries(desiredCountries.filter(dc => dc !== c));
    } else {
      setDesiredCountries([...desiredCountries, c]);
    }
  };

  // Checklist functions
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

    // Don't allow toggling file_upload items directly
    if (item.actionType === 'file_upload' && !item.isCompleted) {
      Alert.alert(
        'Upload Required',
        'Please upload or link a document to complete this item.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Go to Documents', onPress: () => router.push('/(app)/documents') },
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
    return SECTION_ICONS[sectionId] || CheckCircle2;
  };

  const getSectionProgress = (section: ChecklistSection) => {
    const total = section.items.length;
    const completed = section.items.filter(i => i.isCompleted).length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  const renderItem = (section: ChecklistSection, item: ChecklistItem, isLast: boolean) => {
    const isUpdating = updatingItem === item.itemId;
    const priorityStyle = PRIORITY_COLORS[item.priority] || PRIORITY_COLORS.medium;

    return (
      <Box
        key={item.itemId}
        className={`px-4 py-4 ${!isLast ? 'border-b border-outline-100' : ''}`}
        style={item.isCompleted ? { backgroundColor: isDark ? 'rgba(34, 197, 94, 0.1)' : 'rgba(34, 197, 94, 0.08)' } : {}}
      >
        <HStack className="items-start">
          {/* Checkbox */}
          <Pressable
            onPress={() => handleToggleItem(section, item)}
            disabled={isUpdating}
            className="mr-3 mt-0.5"
          >
            <Box className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
              item.isCompleted ? 'bg-success-500 border-success-500' : 'border-outline-300'
            }`}>
              {isUpdating ? (
                <ActivityIndicator size="small" color={item.isCompleted ? '#fff' : '#8B5CF6'} />
              ) : item.isCompleted ? (
                <CheckCircle2 size={16} color="#fff" fill="#16a34a" />
              ) : null}
            </Box>
          </Pressable>

          {/* Content */}
          <VStack className="flex-1">
            <HStack className="items-start justify-between">
              <VStack className="flex-1 mr-2">
                <Text
                  className={`text-base font-inter-medium ${
                    item.isCompleted ? 'text-typography-400 line-through' : 'text-typography-900'
                  }`}
                >
                  {item.title}
                </Text>

                {item.description && !item.isCompleted && (
                  <Text className="text-sm font-inter-regular text-typography-500 mt-1" numberOfLines={3}>
                    {item.description}
                  </Text>
                )}
              </VStack>

              {/* Priority dot */}
              <Box
                className="w-2 h-2 rounded-full mt-2"
                style={{ backgroundColor: priorityStyle.dot }}
              />
            </HStack>

            {/* Meta info row */}
            {!item.isCompleted && (
              <HStack className="items-center mt-3 flex-wrap" style={{ gap: 8 }}>
                {item.deadline && (
                  <HStack className="items-center bg-outline-100 px-2 py-1 rounded-md" space="xs">
                    <Clock size={12} color={iconColors.secondary} />
                    <Text className="text-xs font-inter-medium text-typography-600">{item.deadline}</Text>
                  </HStack>
                )}
              </HStack>
            )}

            {/* Action Buttons - Prominent and Easy to Click */}
            {!item.isCompleted && (
              <VStack className="mt-3" space="sm">
                {item.actionType === 'link' && item.externalLink && (
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      handleOpenLink(item.externalLink!);
                    }}
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    <HStack
                      className="rounded-xl px-4 py-3 items-center justify-center"
                      style={{
                        backgroundColor: isDark ? '#1e3a5f' : '#dbeafe',
                        borderWidth: 1,
                        borderColor: isDark ? '#3b82f6' : '#93c5fd',
                      }}
                      space="sm"
                    >
                      <ExternalLink size={18} color={isDark ? '#60a5fa' : '#2563eb'} />
                      <Text style={{ color: isDark ? '#93c5fd' : '#1d4ed8' }} className="text-sm font-inter-bold">
                        Open Link
                      </Text>
                    </HStack>
                  </Pressable>
                )}

                {item.actionType === 'file_upload' && (
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      router.push('/(app)/documents');
                    }}
                    style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                  >
                    <HStack
                      className="rounded-xl px-4 py-3 items-center justify-center"
                      style={{
                        backgroundColor: isDark ? '#2e1a47' : '#f3e8ff',
                        borderWidth: 1,
                        borderColor: isDark ? '#8b5cf6' : '#c4b5fd',
                      }}
                      space="sm"
                    >
                      <Upload size={18} color={isDark ? '#a78bfa' : '#7c3aed'} />
                      <Text style={{ color: isDark ? '#c4b5fd' : '#6b21a8' }} className="text-sm font-inter-bold">
                        Upload Document
                      </Text>
                    </HStack>
                  </Pressable>
                )}

                {item.actionType === 'calculation' && item.calculationData && (
                  <Box
                    className="rounded-xl p-4"
                    style={{
                      backgroundColor: isDark ? '#3d2e1a' : '#fef3c7',
                      borderWidth: 1,
                      borderColor: isDark ? '#d97706' : '#fcd34d',
                    }}
                  >
                    <HStack className="items-center mb-3" space="sm">
                      <Calculator size={18} color={isDark ? '#fbbf24' : '#d97706'} />
                      <Text style={{ color: isDark ? '#fcd34d' : '#92400e' }} className="text-sm font-inter-bold">
                        Scholarship Points Target
                      </Text>
                    </HStack>
                    <HStack className="justify-between">
                      <VStack className="items-center flex-1">
                        <Text style={{ color: isDark ? '#fcd34d' : '#b45309' }} className="text-xs mb-1">Current</Text>
                        <Text style={{ color: isDark ? '#fbbf24' : '#78350f' }} className="text-xl font-inter-bold">
                          {item.calculationData.currentPoints}
                        </Text>
                        <Text style={{ color: isDark ? '#fcd34d' : '#b45309' }} className="text-xs">points</Text>
                      </VStack>
                      <Box style={{ backgroundColor: isDark ? '#d97706' : '#fcd34d' }} className="w-px mx-4" />
                      <VStack className="items-center flex-1">
                        <Text style={{ color: isDark ? '#fcd34d' : '#b45309' }} className="text-xs mb-1">Weekly Target</Text>
                        <Text style={{ color: isDark ? '#fbbf24' : '#78350f' }} className="text-xl font-inter-bold">
                          {item.calculationData.suggestedTier === 'ivy' ? '300' :
                           item.calculationData.suggestedTier === 'tier1' ? '200' :
                           item.calculationData.suggestedTier === 'tier2' ? '100' : '50'}
                        </Text>
                        <Text style={{ color: isDark ? '#fcd34d' : '#b45309' }} className="text-xs">SP/week</Text>
                      </VStack>
                    </HStack>
                  </Box>
                )}
              </VStack>
            )}
          </VStack>
        </HStack>
      </Box>
    );
  };

  const renderSection = (section: ChecklistSection) => {
    const isExpanded = expandedSections.has(section.sectionId);
    const progress = getSectionProgress(section);
    const IconComponent = getSectionIcon(section.sectionId);
    const sectionColor = SECTION_COLORS[section.sectionId] || SECTION_COLORS.academics;
    const headerBg = isDark ? sectionColor.bgDark : sectionColor.bgLight;

    return (
      <Box
        key={section.sectionId}
        className="mb-4 rounded-2xl overflow-hidden"
        style={{
          backgroundColor: isDark ? '#1f1f23' : '#ffffff',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 8,
          elevation: 3,
        }}
      >
        {/* Section Header */}
        <Pressable onPress={() => toggleSection(section.sectionId)}>
          <Box className="p-4" style={{ backgroundColor: headerBg }}>
            <HStack className="items-center">
              <Box
                className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : sectionColor.icon + '20' }}
              >
                <IconComponent size={24} color={isDark ? '#ffffff' : sectionColor.icon} />
              </Box>

              <VStack className="flex-1">
                <HStack className="items-center justify-between mb-2">
                  <Text
                    className="text-lg font-inter-bold"
                    style={{ color: isDark ? '#ffffff' : sectionColor.text }}
                  >
                    {section.name}
                  </Text>
                  <HStack className="items-center" space="xs">
                    <Text
                      className="text-sm font-inter-bold"
                      style={{ color: isDark ? 'rgba(255,255,255,0.8)' : sectionColor.icon }}
                    >
                      {progress.completed}/{progress.total}
                    </Text>
                    {isExpanded ? (
                      <ChevronUp size={20} color={isDark ? '#ffffff' : sectionColor.icon} />
                    ) : (
                      <ChevronDown size={20} color={isDark ? '#ffffff' : sectionColor.icon} />
                    )}
                  </HStack>
                </HStack>

                {/* Progress Bar */}
                <Box
                  className="h-2 rounded-full overflow-hidden"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)' }}
                >
                  <Box
                    className="h-full rounded-full"
                    style={{
                      width: `${progress.percentage}%`,
                      backgroundColor: isDark ? '#ffffff' : sectionColor.icon,
                    }}
                  />
                </Box>
              </VStack>
            </HStack>
          </Box>
        </Pressable>

        {/* Section Items - In Same Card */}
        {isExpanded && (
          <Box style={{ backgroundColor: isDark ? '#1f1f23' : '#ffffff' }}>
            {section.items.map((item, index) =>
              renderItem(section, item, index === section.items.length - 1)
            )}
          </Box>
        )}
      </Box>
    );
  };

  const renderBasicDataSheet = () => (
    <Modal
      visible={showBasicDataSheet}
      transparent
      animationType="slide"
      onRequestClose={() => {
        if (pageState !== 'basic-data') setShowBasicDataSheet(false);
      }}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <Box className="flex-1 bg-black/50 justify-end">
          <Box className="bg-background-0 rounded-t-3xl" style={{ paddingBottom: Math.max(insets.bottom, 20) }}>
            <Box className="items-center py-3">
              <Box className="w-10 h-1 bg-outline-300 rounded-full" />
            </Box>

            <HStack className="px-5 pb-4 items-center justify-between">
              <Text className="text-xl font-inter-bold text-typography-900">Complete Your Profile</Text>
              {pageState !== 'basic-data' && (
                <Pressable onPress={() => setShowBasicDataSheet(false)}>
                  <X size={24} color={iconColors.secondary} />
                </Pressable>
              )}
            </HStack>

            <ScrollView className="px-5" style={{ maxHeight: 450 }}>
              <Text className="text-typography-500 text-sm font-inter-regular mb-6">
                We need some information to create your personalized college readiness checklist.
              </Text>

              {/* Grade Level */}
              <VStack className="mb-4">
                <Text className="text-sm font-inter-medium text-typography-500 mb-1.5 ml-1">Current Grade Level</Text>
                <Pressable onPress={() => setShowGradePicker(true)}>
                  <HStack className="bg-background-0 border border-outline-200 rounded-xl px-4 py-3.5 items-center justify-between">
                    <Text className={`text-base font-inter-regular ${gradeLevel ? 'text-typography-900' : 'text-typography-400'}`}>
                      {gradeLevel ? `Grade ${gradeLevel}` : 'Select grade level'}
                    </Text>
                    <ChevronDown size={20} color={iconColors.muted} />
                  </HStack>
                </Pressable>
              </VStack>

              {/* Country */}
              <VStack className="mb-4">
                <Text className="text-sm font-inter-medium text-typography-500 mb-1.5 ml-1">Country of Residence</Text>
                <Pressable onPress={() => setShowCountryPicker(true)}>
                  <HStack className="bg-background-0 border border-outline-200 rounded-xl px-4 py-3.5 items-center justify-between">
                    <Text className={`text-base font-inter-regular ${country ? 'text-typography-900' : 'text-typography-400'}`}>
                      {country || 'Select country'}
                    </Text>
                    <ChevronDown size={20} color={iconColors.muted} />
                  </HStack>
                </Pressable>
              </VStack>

              {/* Destinations */}
              <VStack className="mb-6">
                <Text className="text-sm font-inter-medium text-typography-500 mb-1.5 ml-1">Desired College Destinations</Text>
                <Pressable onPress={() => setShowDestinationPicker(true)}>
                  <HStack className="bg-background-0 border border-outline-200 rounded-xl px-4 py-3.5 items-center justify-between">
                    <Text
                      className={`text-base font-inter-regular flex-1 ${desiredCountries.length > 0 ? 'text-typography-900' : 'text-typography-400'}`}
                      numberOfLines={1}
                    >
                      {desiredCountries.length > 0 ? desiredCountries.join(', ') : 'Select destination countries'}
                    </Text>
                    <ChevronDown size={20} color={iconColors.muted} />
                  </HStack>
                </Pressable>
              </VStack>

              <Pressable
                onPress={handleSaveBasicData}
                disabled={basicDataLoading}
                style={({ pressed }) => ({ opacity: pressed || basicDataLoading ? 0.7 : 1 })}
              >
                <Box className="bg-primary-500 py-4 rounded-xl items-center mb-4">
                  {basicDataLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-typography-0 text-base font-inter-bold">Continue</Text>
                  )}
                </Box>
              </Pressable>
            </ScrollView>
          </Box>
        </Box>
      </KeyboardAvoidingView>

      {/* Grade Picker */}
      <Modal visible={showGradePicker} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/50 justify-center items-center px-6" onPress={() => setShowGradePicker(false)}>
          <Box className="bg-background-0 rounded-2xl w-full max-h-96">
            <Text className="text-lg font-inter-bold text-typography-900 p-4 border-b border-outline-100">Select Grade Level</Text>
            <ScrollView>
              {GRADE_LEVELS.map((g) => (
                <Pressable
                  key={g}
                  onPress={() => { setGradeLevel(g); setShowGradePicker(false); }}
                  className="px-4 py-3 border-b border-outline-50"
                >
                  <HStack className="items-center justify-between">
                    <Text className="text-base font-inter-regular text-typography-900">Grade {g}</Text>
                    {gradeLevel === g && <CheckCircle2 size={20} color="#8B5CF6" />}
                  </HStack>
                </Pressable>
              ))}
            </ScrollView>
          </Box>
        </Pressable>
      </Modal>

      {/* Country Picker */}
      <Modal visible={showCountryPicker} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/50 justify-center items-center px-6" onPress={() => setShowCountryPicker(false)}>
          <Box className="bg-background-0 rounded-2xl w-full max-h-96">
            <Text className="text-lg font-inter-bold text-typography-900 p-4 border-b border-outline-100">Select Country</Text>
            <ScrollView>
              {COMMON_COUNTRIES.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => { setCountry(c); setShowCountryPicker(false); }}
                  className="px-4 py-3 border-b border-outline-50"
                >
                  <HStack className="items-center justify-between">
                    <Text className="text-base font-inter-regular text-typography-900">{c}</Text>
                    {country === c && <CheckCircle2 size={20} color="#8B5CF6" />}
                  </HStack>
                </Pressable>
              ))}
            </ScrollView>
          </Box>
        </Pressable>
      </Modal>

      {/* Destination Picker */}
      <Modal visible={showDestinationPicker} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/50 justify-center items-center px-6" onPress={() => setShowDestinationPicker(false)}>
          <Box className="bg-background-0 rounded-2xl w-full max-h-96">
            <HStack className="p-4 border-b border-outline-100 items-center justify-between">
              <Text className="text-lg font-inter-bold text-typography-900">Select Destinations</Text>
              <Pressable onPress={() => setShowDestinationPicker(false)}>
                <Text className="text-primary-500 font-inter-bold">Done</Text>
              </Pressable>
            </HStack>
            <ScrollView>
              {COMMON_COUNTRIES.map((c) => (
                <Pressable key={c} onPress={() => toggleDestinationCountry(c)} className="px-4 py-3 border-b border-outline-50">
                  <HStack className="items-center justify-between">
                    <Text className="text-base font-inter-regular text-typography-900">{c}</Text>
                    {desiredCountries.includes(c) && <CheckCircle2 size={20} color="#8B5CF6" />}
                  </HStack>
                </Pressable>
              ))}
            </ScrollView>
          </Box>
        </Pressable>
      </Modal>
    </Modal>
  );

  const renderChecklist = () => {
    const progressPercent = checklist!.progress.percentage;

    return (
      <VStack className="flex-1 px-4">
        {/* Progress Hero Card - Homepage Style */}
        <Box
          className="rounded-2xl overflow-hidden mb-5"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 5,
          }}
        >
          <LinearGradient
            colors={['#1e1b4b', '#312e81', '#3730a3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 20 }}
          >
            <HStack className="items-center justify-between mb-4">
              <VStack>
                <Text className="text-indigo-300 text-xs font-inter-medium uppercase tracking-widest mb-1">
                  Your Progress
                </Text>
                <HStack className="items-baseline" space="xs">
                  <Text className="text-white text-4xl font-inter-bold">
                    {progressPercent}%
                  </Text>
                  <Text className="text-indigo-300 text-sm font-inter-medium">complete</Text>
                </HStack>
              </VStack>

              <Box className="w-16 h-16 rounded-full bg-white/10 items-center justify-center">
                <Globe size={28} color="#fbbf24" />
              </Box>
            </HStack>

            {/* Progress Bar */}
            <Box className="h-3 bg-white/20 rounded-full overflow-hidden mb-3">
              <Box
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${progressPercent}%` }}
              />
            </Box>

            <Text className="text-indigo-200 text-sm font-inter-regular">
              {checklist!.progress.completedItems} of {checklist!.progress.totalItems} tasks completed
            </Text>

            {/* Profile Tags */}
            <HStack className="flex-wrap mt-4" style={{ gap: 8 }}>
              <Box className="bg-white/15 px-3 py-1.5 rounded-full">
                <Text className="text-white text-xs font-inter-bold">{checklist!.formData.fieldOfStudy}</Text>
              </Box>
              <Box className="bg-white/15 px-3 py-1.5 rounded-full">
                <Text className="text-amber-300 text-xs font-inter-bold">{checklist!.formData.targetTier.toUpperCase()}</Text>
              </Box>
              <Box className="bg-white/15 px-3 py-1.5 rounded-full">
                <Text className="text-emerald-300 text-xs font-inter-bold">Grade {checklist!.profileSnapshot.gradeLevel}</Text>
              </Box>
            </HStack>
          </LinearGradient>
        </Box>

        {/* Sections */}
        {checklist!.sections.sort((a, b) => a.order - b.order).map(section => renderSection(section))}

        {/* Regenerate Button */}
        <Pressable
          onPress={handleStartForm}
          className="mt-4 mb-2"
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <HStack
            className="items-center justify-center py-4 rounded-xl"
            style={{ backgroundColor: isDark ? '#2d2d35' : '#f3f4f6' }}
            space="sm"
          >
            <RefreshCw size={18} color={isDark ? '#a78bfa' : '#7c3aed'} />
            <Text style={{ color: isDark ? '#a78bfa' : '#7c3aed' }} className="font-inter-bold text-sm">
              Regenerate Checklist
            </Text>
          </HStack>
        </Pressable>
      </VStack>
    );
  };

  const renderReadyState = () => (
    <VStack className="flex-1 px-5 pt-6">
      <Box className="items-center mb-8">
        <Box
          className="w-24 h-24 rounded-full items-center justify-center mb-4"
          style={{ backgroundColor: isDark ? '#312e81' : '#e0e7ff' }}
        >
          <Globe size={40} color={isDark ? '#fbbf24' : '#4f46e5'} />
        </Box>
        <Text className="text-2xl font-inter-bold text-typography-900 text-center mb-2">College Readiness</Text>
        <Text className="text-typography-500 text-base font-inter-regular text-center px-4">
          Get a personalized checklist to prepare for your college journey
        </Text>
      </Box>

      <Pressable onPress={handleStartForm}>
        <Box className="bg-primary-500 rounded-2xl p-6 mb-4">
          <HStack className="items-center justify-between">
            <VStack className="flex-1 mr-4">
              <Text className="text-xl font-inter-bold text-white mb-2">Create Your Checklist</Text>
              <Text className="text-white/80 text-sm font-inter-regular">
                Answer a few questions and our AI will create a personalized roadmap for you
              </Text>
            </VStack>
            <Box className="w-12 h-12 rounded-full bg-white/20 items-center justify-center">
              <Plus size={24} color="white" />
            </Box>
          </HStack>
        </Box>
      </Pressable>

      <Text className="text-sm font-inter-medium text-typography-500 uppercase tracking-wider mb-3">What you'll get</Text>

      <VStack space="sm">
        {[
          { title: 'Visa Requirements', desc: 'Country-specific immigration guidance' },
          { title: 'Language Tests', desc: 'TOEFL, IELTS scores you need' },
          { title: 'Documents Checklist', desc: 'Transcripts, essays, recommendations' },
          { title: 'Financial Planning', desc: 'Tuition estimates and scholarship tracking' },
        ].map((item, index) => (
          <HStack key={index} className="bg-background-0 border border-outline-200 rounded-xl p-4 items-center" space="md">
            <Box className="w-8 h-8 rounded-full bg-success-100 items-center justify-center">
              <CheckCircle2 size={16} color="#16a34a" />
            </Box>
            <VStack className="flex-1">
              <Text className="text-base font-inter-medium text-typography-900">{item.title}</Text>
              <Text className="text-sm font-inter-regular text-typography-500">{item.desc}</Text>
            </VStack>
          </HStack>
        ))}
      </VStack>

      <Pressable onPress={() => setShowBasicDataSheet(true)} className="mt-6">
        <Text className="text-center text-primary-500 font-inter-medium">Edit Profile Information</Text>
      </Pressable>
    </VStack>
  );

  const renderSkeletonLoading = () => {
    const sectionBgColors = isDark
      ? ['#1e3a5f', '#4a1942', '#14412a', '#4a3728']
      : ['#dbeafe', '#fce7f3', '#d1fae5', '#fef3c7'];

    return (
      <VStack className="flex-1 px-4">
        {/* Progress Hero Card Skeleton - Gradient style */}
        <Box className="rounded-2xl overflow-hidden mb-5">
          <LinearGradient
            colors={['#1e1b4b', '#312e81', '#3730a3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ padding: 20 }}
          >
            <HStack className="items-center justify-between mb-4">
              <VStack>
                <Skeleton width={80} height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                <Skeleton width={100} height={40} borderRadius={8} />
              </VStack>
              <Skeleton width={64} height={64} borderRadius={32} />
            </HStack>
            <Skeleton width="100%" height={12} borderRadius={6} style={{ marginBottom: 12 }} />
            <Skeleton width={180} height={14} borderRadius={4} style={{ marginBottom: 16 }} />
            <HStack style={{ gap: 8 }}>
              <Skeleton width={90} height={28} borderRadius={14} />
              <Skeleton width={70} height={28} borderRadius={14} />
              <Skeleton width={80} height={28} borderRadius={14} />
            </HStack>
          </LinearGradient>
        </Box>

        {/* Section skeletons - Unified card style */}
        {[0, 1, 2, 3].map((i) => (
          <Box
            key={i}
            className="mb-4 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: isDark ? '#1f1f23' : '#ffffff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.3 : 0.08,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            {/* Section header skeleton */}
            <Box className="p-4" style={{ backgroundColor: sectionBgColors[i] }}>
              <HStack className="items-center">
                <Skeleton width={48} height={48} borderRadius={12} style={{ marginRight: 16 }} />
                <VStack className="flex-1">
                  <HStack className="items-center justify-between mb-2">
                    <Skeleton width={140} height={18} borderRadius={4} />
                    <Skeleton width={50} height={16} borderRadius={4} />
                  </HStack>
                  <Skeleton width="100%" height={8} borderRadius={4} />
                </VStack>
              </HStack>
            </Box>
          </Box>
        ))}
      </VStack>
    );
  };

  const renderContent = () => {
    if (loading) {
      return renderSkeletonLoading();
    }

    if (pageState === 'has-checklist' && checklist) {
      return renderChecklist();
    }

    return renderReadyState();
  };

  return (
    <Box className="flex-1 bg-background-50">
      {/* Header */}
      <Box
        className="bg-background-50 border-b border-outline-100"
        style={{ paddingTop: topPadding }}
      >
        <HStack className="px-4 py-3 items-center justify-between">
          {/* Left: Back + Title */}
          <HStack className="items-center">
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Box className="w-9 h-9 items-center justify-center mr-1">
                <ChevronLeft size={22} strokeWidth={2.5} color={iconColors.primary} />
              </Box>
            </Pressable>
            <Text className="text-lg font-inter-bold text-typography-900">
              College Prep
            </Text>
            {pageState === 'has-checklist' && checklist && (
              <Box className="bg-primary-100 px-2 py-0.5 rounded-full ml-2">
                <Text className="text-xs font-inter-bold text-primary-700">
                  {checklist.progress.percentage}%
                </Text>
              </Box>
            )}
          </HStack>

          {/* Right: Avatar */}
          <UserAvatar
            name={user?.name || 'User'}
            profilePicture={profilePicture}
            size={36}
          />
        </HStack>
      </Box>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: Math.max(insets.bottom, 40), paddingTop: 16 }}
      >
        {renderContent()}
      </ScrollView>

      {renderBasicDataSheet()}
    </Box>
  );
}

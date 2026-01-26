import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  Pressable,
  Platform,
  useColorScheme,
  ActivityIndicator,
  Alert,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/src/contexts/AuthContext';
import {
  collegeReadinessApi,
  TierConfig,
  CollegeSearchResult,
  PreferredCollege,
} from '@/src/api/collegeReadiness.api';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  Search,
  Plus,
  GraduationCap,
  Target,
  Languages,
  Building2,
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

type FormStep = 'field' | 'tier' | 'languages' | 'colleges';

// Extended type to store college name for display
interface PreferredCollegeWithName extends PreferredCollege {
  name?: string;
}

const STEPS: { key: FormStep; title: string; icon: any }[] = [
  { key: 'field', title: 'Field of Study', icon: GraduationCap },
  { key: 'tier', title: 'Target Tier', icon: Target },
  { key: 'languages', title: 'Languages', icon: Languages },
  { key: 'colleges', title: 'Colleges', icon: Building2 },
];

export default function CollegePrepFormScreen() {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<FormStep>('field');

  // Form options from API
  const [fieldsOfStudy, setFieldsOfStudy] = useState<string[]>([]);
  const [tiers, setTiers] = useState<TierConfig[]>([]);
  const [commonLanguages, setCommonLanguages] = useState<string[]>([]);

  // Form data
  const [selectedField, setSelectedField] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('tier2');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [languageInput, setLanguageInput] = useState('');
  const [preferredColleges, setPreferredColleges] = useState<PreferredCollegeWithName[]>([]);
  const [collegeSearch, setCollegeSearch] = useState('');
  const [collegeResults, setCollegeResults] = useState<CollegeSearchResult[]>([]);
  const [searchingColleges, setSearchingColleges] = useState(false);

  const topPadding = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 24);
  const currentStepIndex = STEPS.findIndex(s => s.key === step);

  useEffect(() => {
    loadFormOptions();
  }, []);

  const loadFormOptions = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await collegeReadinessApi.getFormOptions(token);
      if (response.success) {
        setFieldsOfStudy(response.data.fieldsOfStudy);
        setTiers(response.data.tiers);
        setCommonLanguages(response.data.commonLanguages);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load form options');
    } finally {
      setLoading(false);
    }
  };

  const searchColleges = async (query: string) => {
    if (!token || query.length < 2) {
      setCollegeResults([]);
      return;
    }

    setSearchingColleges(true);
    try {
      const response = await collegeReadinessApi.searchColleges(token, query);
      if (response.success) {
        setCollegeResults(response.data.colleges);
      }
    } catch (error) {
      console.error('Error searching colleges:', error);
    } finally {
      setSearchingColleges(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (collegeSearch) {
        searchColleges(collegeSearch);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [collegeSearch]);

  const handleNext = () => {
    if (step === 'field' && !selectedField) {
      Alert.alert('Required', 'Please select a field of study');
      return;
    }

    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setStep(STEPS[nextIndex].key);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(STEPS[prevIndex].key);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    if (!token) return;

    if (!selectedField) {
      Alert.alert('Required', 'Please select a field of study');
      setStep('field');
      return;
    }

    setSubmitting(true);
    try {
      const response = await collegeReadinessApi.generateChecklist(token, {
        fieldOfStudy: selectedField,
        targetTier: selectedTier as any,
        languagesKnown: selectedLanguages,
        preferredColleges,
      });

      if (response.success) {
        // Navigate back to college-prep to show the checklist
        router.replace('/(app)/college-prep');
      }
    } catch (error: any) {
      if (error.status === 429) {
        let message = 'You can only generate a checklist once per week.';
        if (error.data?.nextAvailableAt) {
          const nextDate = new Date(error.data.nextAvailableAt);
          const formattedDate = nextDate.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          });
          const formattedTime = nextDate.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });
          message = `You can regenerate your checklist on ${formattedDate} at ${formattedTime}.`;
        } else if (error.data?.daysRemaining) {
          const days = error.data.daysRemaining;
          message = `You can regenerate your checklist in ${days} ${days === 1 ? 'day' : 'days'}.`;
        }
        Alert.alert('Limit Reached', message);
      } else {
        Alert.alert('Error', error.message || 'Failed to generate checklist');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const addLanguage = (lang: string) => {
    const trimmed = lang.trim();
    if (trimmed && !selectedLanguages.includes(trimmed)) {
      setSelectedLanguages([...selectedLanguages, trimmed]);
    }
    setLanguageInput('');
  };

  const removeLanguage = (lang: string) => {
    setSelectedLanguages(selectedLanguages.filter(l => l !== lang));
  };

  const addCollege = (college: CollegeSearchResult) => {
    if (!preferredColleges.find(c => c.collegeId === college._id)) {
      setPreferredColleges([...preferredColleges, { collegeId: college._id, name: college.name }]);
    }
    setCollegeSearch('');
    setCollegeResults([]);
  };

  const addManualCollege = () => {
    const trimmed = collegeSearch.trim();
    if (trimmed && !preferredColleges.find(c => c.manualEntry === trimmed)) {
      setPreferredColleges([...preferredColleges, { manualEntry: trimmed }]);
    }
    setCollegeSearch('');
    setCollegeResults([]);
  };

  const removeCollege = (index: number) => {
    setPreferredColleges(preferredColleges.filter((_, i) => i !== index));
  };

  const renderStepIndicator = () => (
    <HStack className="px-5 py-4 items-center justify-center" space="xs">
      {STEPS.map((s, index) => (
        <React.Fragment key={s.key}>
          <Box
            className={`w-8 h-8 rounded-full items-center justify-center ${
              index <= currentStepIndex ? 'bg-primary-500' : 'bg-outline-200'
            }`}
          >
            {index < currentStepIndex ? (
              <CheckCircle2 size={16} color="white" />
            ) : (
              <Text
                className={`text-sm font-inter-bold ${
                  index <= currentStepIndex ? 'text-white' : 'text-typography-500'
                }`}
              >
                {index + 1}
              </Text>
            )}
          </Box>
          {index < STEPS.length - 1 && (
            <Box
              className={`w-8 h-0.5 ${
                index < currentStepIndex ? 'bg-primary-500' : 'bg-outline-200'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </HStack>
  );

  const renderFieldStep = () => (
    <VStack className="flex-1 px-5">
      <Text className="text-2xl font-inter-bold text-typography-900 mb-2">
        What do you want to study?
      </Text>
      <Text className="text-typography-500 text-base font-inter-regular mb-6">
        Select your primary field of interest
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack space="sm">
          {fieldsOfStudy.map((field) => (
            <Pressable
              key={field}
              onPress={() => setSelectedField(field)}
            >
              <HStack
                className={`p-4 rounded-xl border ${
                  selectedField === field
                    ? 'bg-primary-50 border-primary-500'
                    : 'bg-background-0 border-outline-200'
                }`}
              >
                <Box
                  className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                    selectedField === field
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-outline-300'
                  }`}
                >
                  {selectedField === field && (
                    <CheckCircle2 size={14} color="white" />
                  )}
                </Box>
                <Text
                  className={`text-base font-inter-medium ${
                    selectedField === field ? 'text-primary-700' : 'text-typography-900'
                  }`}
                >
                  {field}
                </Text>
              </HStack>
            </Pressable>
          ))}
        </VStack>
      </ScrollView>
    </VStack>
  );

  const renderTierStep = () => (
    <VStack className="flex-1 px-5">
      <Text className="text-2xl font-inter-bold text-typography-900 mb-2">
        Target University Tier
      </Text>
      <Text className="text-typography-500 text-base font-inter-regular mb-6">
        This helps us estimate costs and scholarship requirements
      </Text>

      <VStack space="md">
        {tiers.map((tier) => (
          <Pressable
            key={tier.id}
            onPress={() => setSelectedTier(tier.id)}
          >
            <Box
              className={`p-4 rounded-xl border ${
                selectedTier === tier.id
                  ? 'border-2 border-primary-500'
                  : 'border-outline-200'
              }`}
              style={selectedTier === tier.id ? { backgroundColor: `${tier.color}15` } : {}}
            >
              <HStack className="items-center justify-between mb-2">
                <HStack className="items-center" space="sm">
                  <Box
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: tier.color }}
                  />
                  <Text className="text-lg font-inter-bold text-typography-900">
                    {tier.name}
                  </Text>
                </HStack>
                {selectedTier === tier.id && (
                  <CheckCircle2 size={20} color="#8B5CF6" />
                )}
              </HStack>
              <Text className="text-sm text-typography-500 font-inter-regular mb-2">
                {tier.description}
              </Text>
              <HStack className="items-center" space="xs">
                <Text className="text-sm font-inter-medium text-typography-700">
                  Target:
                </Text>
                <Text className="text-sm font-inter-bold" style={{ color: tier.color }}>
                  {tier.weeklyRate} SP/week
                </Text>
              </HStack>
            </Box>
          </Pressable>
        ))}
      </VStack>
    </VStack>
  );

  const renderLanguagesStep = () => (
    <VStack className="flex-1 px-5">
      <Text className="text-2xl font-inter-bold text-typography-900 mb-2">
        Languages You Know
      </Text>
      <Text className="text-typography-500 text-base font-inter-regular mb-6">
        Add languages you speak or are learning
      </Text>

      {/* Input */}
      <HStack className="bg-background-0 border border-outline-200 rounded-xl px-4 items-center mb-4">
        <TextInput
          value={languageInput}
          onChangeText={setLanguageInput}
          placeholder="Type a language..."
          placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
          onSubmitEditing={() => addLanguage(languageInput)}
          style={{
            flex: 1,
            height: 48,
            fontSize: 16,
            fontFamily: 'Inter-Regular',
            color: isDark ? '#f5f5f5' : '#262627',
          }}
        />
        <Pressable
          onPress={() => addLanguage(languageInput)}
          disabled={!languageInput.trim()}
        >
          <Plus size={24} color={languageInput.trim() ? '#8B5CF6' : iconColors.muted} />
        </Pressable>
      </HStack>

      {/* Selected Languages */}
      {selectedLanguages.length > 0 && (
        <VStack className="mb-4">
          <Text className="text-sm font-inter-medium text-typography-500 mb-2">
            Selected ({selectedLanguages.length})
          </Text>
          <HStack className="flex-wrap" style={{ gap: 8 }}>
            {selectedLanguages.map((lang) => (
              <HStack
                key={lang}
                className="bg-primary-100 rounded-full px-3 py-1.5 items-center"
                space="xs"
              >
                <Text className="text-sm font-inter-medium text-primary-700">{lang}</Text>
                <Pressable onPress={() => removeLanguage(lang)}>
                  <X size={14} color="#7c3aed" />
                </Pressable>
              </HStack>
            ))}
          </HStack>
        </VStack>
      )}

      {/* Common Languages */}
      <Text className="text-sm font-inter-medium text-typography-500 mb-2">
        Common Languages
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HStack className="flex-wrap" style={{ gap: 8 }}>
          {commonLanguages
            .filter(l => !selectedLanguages.includes(l))
            .map((lang) => (
              <Pressable key={lang} onPress={() => addLanguage(lang)}>
                <Box className="bg-background-0 border border-outline-200 rounded-full px-3 py-1.5">
                  <Text className="text-sm font-inter-regular text-typography-700">{lang}</Text>
                </Box>
              </Pressable>
            ))}
        </HStack>
      </ScrollView>
    </VStack>
  );

  const renderCollegesStep = () => (
    <VStack className="flex-1 px-5">
      <Text className="text-2xl font-inter-bold text-typography-900 mb-2">
        Preferred Colleges
      </Text>
      <Text className="text-typography-500 text-base font-inter-regular mb-6">
        Optional: Add specific colleges you're interested in
      </Text>

      {/* Search Input */}
      <HStack className="bg-background-0 border border-outline-200 rounded-xl px-4 items-center mb-4">
        <Search size={20} color={iconColors.muted} />
        <TextInput
          value={collegeSearch}
          onChangeText={setCollegeSearch}
          placeholder="Search colleges..."
          placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
          style={{
            flex: 1,
            height: 48,
            fontSize: 16,
            fontFamily: 'Inter-Regular',
            color: isDark ? '#f5f5f5' : '#262627',
            marginLeft: 8,
          }}
        />
        {searchingColleges && <ActivityIndicator size="small" color="#8B5CF6" />}
      </HStack>

      {/* Search Results */}
      {collegeSearch.length >= 2 && (
        <Box className="mb-4">
          {collegeResults.length > 0 ? (
            <VStack className="bg-background-0 border border-outline-200 rounded-xl overflow-hidden">
              {collegeResults.slice(0, 5).map((college) => (
                <Pressable
                  key={college._id}
                  onPress={() => addCollege(college)}
                  className="px-4 py-3 border-b border-outline-50"
                >
                  <Text className="text-base font-inter-medium text-typography-900">
                    {college.name}
                  </Text>
                  <Text className="text-sm text-typography-500">{college.country}</Text>
                </Pressable>
              ))}
            </VStack>
          ) : !searchingColleges ? (
            <Pressable onPress={addManualCollege}>
              <HStack className="bg-primary-50 border border-primary-200 rounded-xl p-4 items-center" space="sm">
                <Plus size={20} color="#8B5CF6" />
                <Text className="text-base font-inter-medium text-primary-700">
                  Add "{collegeSearch}" manually
                </Text>
              </HStack>
            </Pressable>
          ) : null}
        </Box>
      )}

      {/* Selected Colleges */}
      {preferredColleges.length > 0 && (
        <VStack>
          <Text className="text-sm font-inter-medium text-typography-500 mb-2">
            Selected ({preferredColleges.length})
          </Text>
          <VStack space="sm">
            {preferredColleges.map((college, index) => (
              <HStack
                key={index}
                className="bg-background-0 border border-outline-200 rounded-xl p-3 items-center justify-between"
              >
                <Text className="text-base font-inter-medium text-typography-900 flex-1">
                  {college.manualEntry || college.name || 'College'}
                </Text>
                <Pressable onPress={() => removeCollege(index)}>
                  <X size={20} color={iconColors.secondary} />
                </Pressable>
              </HStack>
            ))}
          </VStack>
        </VStack>
      )}

      {preferredColleges.length === 0 && collegeSearch.length < 2 && (
        <Box className="flex-1 items-center justify-center">
          <Text className="text-typography-400 text-center font-inter-regular">
            This is optional. You can skip to generate your checklist.
          </Text>
        </Box>
      )}
    </VStack>
  );

  const renderStep = () => {
    switch (step) {
      case 'field':
        return renderFieldStep();
      case 'tier':
        return renderTierStep();
      case 'languages':
        return renderLanguagesStep();
      case 'colleges':
        return renderCollegesStep();
    }
  };

  if (loading) {
    return (
      <Box className="flex-1 bg-background-50 items-center justify-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Header */}
        <HStack
          className="px-4 py-3 items-center bg-background-50 border-b border-outline-100"
          style={{ paddingTop: topPadding }}
        >
          <Pressable
            onPress={handleBack}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
          >
            <Box className="w-10 h-10 items-center justify-center">
              <ChevronLeft size={24} strokeWidth={2.5} color={iconColors.primary} />
            </Box>
          </Pressable>
          <Text className="flex-1 text-lg font-inter-bold text-typography-900 text-center">
            {STEPS[currentStepIndex].title}
          </Text>
          <Box className="w-10 h-10" />
        </HStack>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <Box className="flex-1">
          {renderStep()}
        </Box>

        {/* Bottom Buttons */}
        <Box
          className="px-5 py-4 bg-background-50 border-t border-outline-100"
          style={{ paddingBottom: Math.max(insets.bottom, 16) }}
        >
          {step === 'colleges' ? (
            <Pressable
              onPress={handleSubmit}
              disabled={submitting}
              style={({ pressed }) => ({ opacity: pressed || submitting ? 0.7 : 1 })}
            >
              <Box className="bg-primary-500 py-4 rounded-xl items-center">
                {submitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <HStack className="items-center" space="sm">
                    <Text className="text-typography-0 text-base font-inter-bold">
                      Generate Checklist
                    </Text>
                    <ChevronRight size={20} color="white" />
                  </HStack>
                )}
              </Box>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleNext}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Box className="bg-primary-500 py-4 rounded-xl items-center">
                <HStack className="items-center" space="sm">
                  <Text className="text-typography-0 text-base font-inter-bold">
                    Continue
                  </Text>
                  <ChevronRight size={20} color="white" />
                </HStack>
              </Box>
            </Pressable>
          )}
        </Box>
      </KeyboardAvoidingView>
    </Box>
  );
}

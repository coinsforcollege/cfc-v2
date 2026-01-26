import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  Pressable,
  Platform,
  useColorScheme,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/src/contexts/AuthContext';
import { studentApi } from '@/src/api/student.api';
import {
  ChevronLeft,
  Check,
  ChevronDown,
  X,
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

// Input Field Component
function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <VStack className="mb-4">
      <Text className="text-sm font-inter-medium text-typography-500 mb-1.5 ml-1">
        {label}
      </Text>
      <Box
        className={`bg-background-0 border border-outline-200 rounded-xl px-4 ${
          multiline ? 'py-3' : 'py-0'
        }`}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
          multiline={multiline}
          style={{
            fontSize: 16,
            fontFamily: 'Inter-Regular',
            color: isDark ? '#f5f5f5' : '#262627',
            paddingVertical: multiline ? 0 : Platform.OS === 'ios' ? 14 : 10,
            minHeight: multiline ? 80 : undefined,
            textAlignVertical: multiline ? 'top' : 'center',
          }}
        />
      </Box>
    </VStack>
  );
}

// Picker Field Component
function PickerField({
  label,
  value,
  placeholder,
  onPress,
}: {
  label: string;
  value: string | null;
  placeholder: string;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  return (
    <VStack className="mb-4">
      <Text className="text-sm font-inter-medium text-typography-500 mb-1.5 ml-1">
        {label}
      </Text>
      <Pressable onPress={onPress}>
        <HStack className="bg-background-0 border border-outline-200 rounded-xl px-4 py-3.5 items-center justify-between">
          <Text
            className={`text-base font-inter-regular ${
              value ? 'text-typography-900' : 'text-typography-400'
            }`}
          >
            {value || placeholder}
          </Text>
          <ChevronDown size={20} color={iconColors.muted} />
        </HStack>
      </Pressable>
    </VStack>
  );
}

// Multi-Select Chips Display
function MultiSelectField({
  label,
  values,
  placeholder,
  onPress,
  onRemove,
}: {
  label: string;
  values: string[];
  placeholder: string;
  onPress: () => void;
  onRemove: (value: string) => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  return (
    <VStack className="mb-4">
      <Text className="text-sm font-inter-medium text-typography-500 mb-1.5 ml-1">
        {label}
      </Text>
      <Pressable onPress={onPress}>
        <Box className="bg-background-0 border border-outline-200 rounded-xl px-4 py-3 min-h-[52px]">
          {values.length > 0 ? (
            <HStack className="flex-wrap" style={{ gap: 8 }}>
              {values.map((value) => (
                <HStack
                  key={value}
                  className="bg-primary-100 px-3 py-1.5 rounded-full items-center"
                  space="xs"
                >
                  <Text className="text-primary-700 text-sm font-inter-medium">
                    {value}
                  </Text>
                  <Pressable
                    onPress={(e) => {
                      e.stopPropagation();
                      onRemove(value);
                    }}
                    hitSlop={8}
                  >
                    <X size={14} color="#6366f1" />
                  </Pressable>
                </HStack>
              ))}
              <HStack className="items-center py-1.5">
                <ChevronDown size={18} color={iconColors.muted} />
              </HStack>
            </HStack>
          ) : (
            <HStack className="items-center justify-between">
              <Text className="text-typography-400 text-base font-inter-regular">
                {placeholder}
              </Text>
              <ChevronDown size={20} color={iconColors.muted} />
            </HStack>
          )}
        </Box>
      </Pressable>
    </VStack>
  );
}

// Selection Modal with proper slide animation
function SelectionModal({
  visible,
  title,
  options,
  selectedValue,
  onSelect,
  onClose,
  multiSelect = false,
  selectedValues = [],
}: {
  visible: boolean;
  title: string;
  options: string[];
  selectedValue?: string | null;
  onSelect: (value: string) => void;
  onClose: () => void;
  multiSelect?: boolean;
  selectedValues?: string[];
}) {
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = options.filter((option) =>
    option.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset search when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Box className="flex-1 justify-end bg-black/50">
          <Pressable onPress={onClose} style={{ flex: 1 }} />
          <Box
            className={`rounded-t-3xl ${isDark ? 'bg-background-50' : 'bg-white'}`}
            style={{
              maxHeight: '80%',
              paddingBottom: insets.bottom,
            }}
          >
              {/* Handle bar */}
              <Box className="items-center pt-3 pb-2">
                <Box
                  className="w-10 h-1 rounded-full"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}
                />
              </Box>

              {/* Header */}
              <HStack className="px-4 py-3 items-center justify-between border-b border-outline-100">
                <Pressable onPress={onClose} hitSlop={10}>
                  <Text className="text-primary-500 text-base font-inter-medium">Cancel</Text>
                </Pressable>
                <Text className="text-typography-900 text-lg font-inter-bold">{title}</Text>
                {multiSelect ? (
                  <Pressable onPress={onClose} hitSlop={10}>
                    <Text className="text-primary-500 text-base font-inter-medium">Done</Text>
                  </Pressable>
                ) : (
                  <Box className="w-12" />
                )}
              </HStack>

              {/* Search */}
              {options.length > 10 && (
                <Box className="px-4 py-3 border-b border-outline-100">
                  <Box className="bg-background-50 rounded-xl px-4 py-2.5">
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder="Search..."
                      placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                      style={{
                        fontSize: 16,
                        fontFamily: 'Inter-Regular',
                        color: isDark ? '#f5f5f5' : '#262627',
                      }}
                    />
                  </Box>
                </Box>
              )}

              {/* Options */}
              <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
                {filteredOptions.map((option) => {
                  const isSelected = multiSelect
                    ? selectedValues.includes(option)
                    : selectedValue === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() => onSelect(option)}
                      style={({ pressed }) => ({
                        backgroundColor: pressed
                          ? isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'
                          : 'transparent',
                      })}
                    >
                      <HStack className="px-4 py-3.5 border-b border-outline-50 items-center justify-between">
                        <Text
                          className={`text-base font-inter-regular ${
                            isSelected ? 'text-primary-500 font-inter-medium' : 'text-typography-900'
                          }`}
                        >
                          {option}
                        </Text>
                        {isSelected && (
                          <Check size={20} color="#6366f1" strokeWidth={2.5} />
                        )}
                      </HStack>
                    </Pressable>
                  );
                })}
              </ScrollView>
          </Box>
        </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function EditProfileScreen() {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [gradeLevel, setGradeLevel] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [country, setCountry] = useState<string | null>(null);
  const [desiredCountries, setDesiredCountries] = useState<string[]>([]);

  // Options
  const [countries, setCountries] = useState<string[]>([]);
  const [gradeLevels, setGradeLevels] = useState<string[]>([]);

  // Modal state
  const [showGradePicker, setShowGradePicker] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [showDesiredCountriesPicker, setShowDesiredCountriesPicker] = useState(false);

  const topPadding = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 24);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        const [countriesRes, gradesRes, profileRes] = await Promise.all([
          studentApi.getCountries(),
          studentApi.getGradeLevels(),
          studentApi.getProfile(token),
        ]);

        if (countriesRes.success) {
          setCountries(countriesRes.data);
        }
        if (gradesRes.success) {
          setGradeLevels(gradesRes.data);
        }
        if (profileRes.success) {
          const profile = profileRes.data;
          setName(profile.name || '');
          setGradeLevel(profile.gradeLevel);
          setSchoolName(profile.school?.name || '');
          setSchoolAddress(profile.school?.address || '');
          setCountry(profile.country);
          setDesiredCountries(profile.desiredCollegeCountries || []);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Save profile
  const handleSave = useCallback(async () => {
    if (!token) return;

    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty');
      return;
    }

    setSaving(true);
    try {
      const response = await studentApi.updateProfile(token, {
        name: name.trim(),
        gradeLevel,
        school: {
          name: schoolName.trim() || null,
          address: schoolAddress.trim() || null,
        },
        country,
        desiredCollegeCountries: desiredCountries.length > 0 ? desiredCountries : null,
      });

      if (response.success) {
        router.back();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  }, [token, name, gradeLevel, schoolName, schoolAddress, country, desiredCountries]);

  // Handle grade selection
  const handleGradeSelect = (value: string) => {
    setGradeLevel(value);
    setShowGradePicker(false);
  };

  // Handle country selection
  const handleCountrySelect = (value: string) => {
    setCountry(value);
    setShowCountryPicker(false);
  };

  // Handle desired countries selection
  const handleDesiredCountrySelect = (value: string) => {
    setDesiredCountries((prev) => {
      if (prev.includes(value)) {
        return prev.filter((c) => c !== value);
      }
      return [...prev, value];
    });
  };

  // Remove desired country
  const handleRemoveDesiredCountry = (value: string) => {
    setDesiredCountries((prev) => prev.filter((c) => c !== value));
  };

  if (loading) {
    return (
      <Box className="flex-1 bg-background-50 items-center justify-center">
        <ActivityIndicator size="large" color="#6366f1" />
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-background-50">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* Sticky Header */}
        <Box
          className="bg-background-50 border-b border-outline-100"
          style={{ paddingTop: topPadding, zIndex: 10 }}
        >
          <HStack className="px-4 py-3 items-center">
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
            >
              <Box className="w-10 h-10 items-center justify-center">
                <ChevronLeft size={24} strokeWidth={2.5} color={iconColors.primary} />
              </Box>
            </Pressable>
            <Text className="flex-1 text-center text-lg font-inter-bold text-typography-900">
              Edit Profile
            </Text>
            <Pressable
              onPress={handleSave}
              disabled={saving}
              style={({ pressed }) => ({ opacity: pressed || saving ? 0.6 : 1 })}
            >
              <Box className="w-10 h-10 items-center justify-center">
                {saving ? (
                  <ActivityIndicator size="small" color="#6366f1" />
                ) : (
                  <Check size={24} strokeWidth={2.5} color="#6366f1" />
                )}
              </Box>
            </Pressable>
          </HStack>
        </Box>

        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            padding: 16,
            paddingBottom: Math.max(insets.bottom, 40),
          }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Name */}
          <InputField
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
          />

          {/* Grade Level */}
          <PickerField
            label="Grade Level"
            value={gradeLevel ? `Grade ${gradeLevel}` : null}
            placeholder="Select grade level"
            onPress={() => setShowGradePicker(true)}
          />

          {/* School Name */}
          <InputField
            label="School Name"
            value={schoolName}
            onChangeText={setSchoolName}
            placeholder="Enter school name"
          />

          {/* School Address */}
          <InputField
            label="School Address"
            value={schoolAddress}
            onChangeText={setSchoolAddress}
            placeholder="Enter school address"
            multiline
          />

          {/* Country */}
          <PickerField
            label="Country of Residence"
            value={country}
            placeholder="Select country"
            onPress={() => setShowCountryPicker(true)}
          />

          {/* Desired College Countries */}
          <MultiSelectField
            label="Desired College Countries"
            values={desiredCountries}
            placeholder="Select countries"
            onPress={() => setShowDesiredCountriesPicker(true)}
            onRemove={handleRemoveDesiredCountry}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Grade Level Picker */}
      <SelectionModal
        visible={showGradePicker}
        title="Select Grade"
        options={gradeLevels.map((g) => (g === 'K' ? 'Kindergarten (K)' : `Grade ${g}`))}
        selectedValue={gradeLevel ? (gradeLevel === 'K' ? 'Kindergarten (K)' : `Grade ${gradeLevel}`) : null}
        onSelect={(value) => {
          const grade = value === 'Kindergarten (K)' ? 'K' : value.replace('Grade ', '');
          handleGradeSelect(grade);
        }}
        onClose={() => setShowGradePicker(false)}
      />

      {/* Country Picker */}
      <SelectionModal
        visible={showCountryPicker}
        title="Select Country"
        options={countries}
        selectedValue={country}
        onSelect={handleCountrySelect}
        onClose={() => setShowCountryPicker(false)}
      />

      {/* Desired Countries Picker */}
      <SelectionModal
        visible={showDesiredCountriesPicker}
        title="Select Countries"
        options={countries}
        selectedValues={desiredCountries}
        onSelect={handleDesiredCountrySelect}
        onClose={() => setShowDesiredCountriesPicker(false)}
        multiSelect
      />
    </Box>
  );
}

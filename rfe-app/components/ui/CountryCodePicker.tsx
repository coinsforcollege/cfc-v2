import React, { useState } from 'react';
import { FlatList, TouchableOpacity, Modal, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Input, InputField } from '@/components/ui/input';
import { Pressable } from '@/components/ui/pressable';
import { COUNTRY_CODES, CountryCode, formatCountryCodeDisplay } from '@/src/constants/countryCodes';

interface CountryCodePickerProps {
  selectedCountry: CountryCode;
  onSelect: (country: CountryCode) => void;
}

export function CountryCodePicker({ selectedCountry, onSelect }: CountryCodePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const insets = useSafeAreaInsets();

  const filteredCountries = searchQuery
    ? COUNTRY_CODES.filter(
        (country) =>
          country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          country.dialCode.includes(searchQuery)
      )
    : COUNTRY_CODES;

  const handleSelect = (country: CountryCode) => {
    onSelect(country);
    setIsOpen(false);
    setSearchQuery('');
  };

  const renderCountryItem = ({ item }: { item: CountryCode }) => (
    <TouchableOpacity
      onPress={() => handleSelect(item)}
      activeOpacity={0.7}
    >
      <HStack
        className={`px-4 py-3 border-b border-outline-100 ${
          item.code === selectedCountry.code ? 'bg-primary-50' : ''
        }`}
        space="md"
      >
        <Text className="text-typography-900 font-semibold w-12">
          {item.dialCode}
        </Text>
        <Text className="text-typography-600 w-10">
          {item.code}
        </Text>
        <Text className="text-typography-900 flex-1" numberOfLines={1}>
          {item.name}
        </Text>
        {item.code === selectedCountry.code && (
          <Text className="text-primary-600">*</Text>
        )}
      </HStack>
    </TouchableOpacity>
  );

  return (
    <>
      {/* Trigger Button */}
      <Pressable
        onPress={() => setIsOpen(true)}
        className="border-2 border-outline-300 bg-background-0 h-12 justify-center px-3"
      >
        <Text className="text-typography-900 font-medium">
          {formatCountryCodeDisplay(selectedCountry)}
        </Text>
      </Pressable>

      {/* Modal Picker */}
      <Modal
        visible={isOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsOpen(false)}
      >
        <Box
          className="flex-1 bg-background-0"
          style={{ paddingTop: insets.top }}
        >
          {/* Header */}
          <HStack className="px-4 py-3 border-b border-outline-200 justify-between items-center">
            <Text className="text-typography-950 text-lg font-bold">
              Select Country Code
            </Text>
            <Pressable onPress={() => setIsOpen(false)} className="p-2">
              <Text className="text-primary-600 font-semibold">Done</Text>
            </Pressable>
          </HStack>

          {/* Search */}
          <Box className="px-4 py-3 border-b border-outline-200">
            <Input size="lg" variant="outline" className="border border-outline-300 bg-background-50 rounded-lg">
              <InputField
                placeholder="Search country or code..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
                className="text-typography-900"
              />
            </Input>
          </Box>

          {/* Country List */}
          <FlatList
            data={filteredCountries}
            keyExtractor={(item) => item.code}
            renderItem={renderCountryItem}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: insets.bottom }}
          />
        </Box>
      </Modal>
    </>
  );
}

export default CountryCodePicker;

'use client';
import React, { useCallback, useMemo, useState } from 'react';
import { Image, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { LinearGradient } from 'expo-linear-gradient';
import { College } from '@/src/api/colleges.api';

// List of departments to show when backend doesn't provide them
const DEPARTMENT_LIST = [
  'Humanities',
  'Arts',
  'Science',
  'Technology',
  'Engineering',
  'Social Science',
  'Business',
  'Medicine',
  'Law',
  'Education',
];

// Fallback images
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=400&h=300&fit=crop',
  'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=400&h=300&fit=crop',
];

// Get acronym from college name (skip common words)
function getAcronym(name: string, shortName?: string): string {
  if (shortName && shortName.length <= 6) return shortName.toUpperCase();

  const skipWords = ['of', 'the', 'and', 'for', 'at', 'in', 'a', 'an'];
  const words = name.split(/[\s,]+/).filter(w => !skipWords.includes(w.toLowerCase()));
  const acronym = words.map(w => w.charAt(0)).join('').toUpperCase();
  return acronym.slice(0, 4);
}

// Get departments - real ones first, then fill with random
function getDepartments(college: College, collegeId: string): string[] {
  if (college.departments && college.departments.length > 0) {
    return college.departments.slice(0, 5);
  }

  const hash = collegeId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const shuffled = [...DEPARTMENT_LIST].sort((a, b) => {
    const aHash = (hash + a.charCodeAt(0)) % 100;
    const bHash = (hash + b.charCodeAt(0)) % 100;
    return aHash - bHash;
  });
  return shuffled.slice(0, 5);
}

interface CollegeCardProps {
  college: College;
  index: number;
}

export function CollegeCard({ college, index }: CollegeCardProps) {
  const [coverError, setCoverError] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const departments = useMemo(
    () => getDepartments(college, college._id),
    [college._id, college.departments]
  );

  const handlePress = useCallback(() => {
    router.push(`/(app)/colleges/${college._id}`);
  }, [college._id]);

  const coverImage = college.coverImage && college.coverImage.length > 10
    ? college.coverImage
    : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  const showCoverGradient = coverError;
  const showLogoFallback = !college.logo || college.logo.length <= 5 || logoError;

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.95 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
        flex: 1,
      })}
    >
      <Box
        className="bg-background-0 rounded-2xl overflow-hidden border border-outline-100 shadow-hard-5"
        style={{ height: 230 }}
      >
        {/* Thumbnail Image - 50% */}
        <Box className="relative" style={{ height: 115 }}>
          {showCoverGradient ? (
            <LinearGradient
              colors={['#3b82f6', '#1e40af']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}
            >
              <Text className="text-white/80 font-inter-black text-2xl tracking-wider">
                {getAcronym(college.name, college.shortName)}
              </Text>
            </LinearGradient>
          ) : (
            <Image
              source={{ uri: coverImage }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="cover"
              onError={() => setCoverError(true)}
            />
          )}

          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.6)']}
            locations={[0.3, 1]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 50,
            }}
          />

          {/* Country Badge */}
          <Box className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-primary-500">
            <Text className="text-typography-0 text-2xs font-inter-bold uppercase">
              {college.country.length > 10
                ? college.country.substring(0, 3)
                : college.country}
            </Text>
          </Box>

          {/* Logo Overlay */}
          {showLogoFallback ? (
            <Box
              className="absolute rounded-full overflow-hidden items-center justify-center"
              style={{ bottom: 8, left: 8, width: 28, height: 28 }}
            >
              <LinearGradient
                colors={['#3b82f6', '#1e40af']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
              />
              <Text className="text-typography-0 font-inter-bold text-xs">
                {college.name.charAt(0)}
              </Text>
            </Box>
          ) : (
            <Box
              className="absolute rounded-full bg-background-0 p-0.5"
              style={{ bottom: 8, left: 8, width: 28, height: 28 }}
            >
              <Image
                source={{ uri: college.logo! }}
                style={{ width: '100%', height: '100%', borderRadius: 12 }}
                resizeMode="cover"
                onError={() => setLogoError(true)}
              />
            </Box>
          )}
        </Box>

        {/* Content - 50% */}
        <Box className="px-2.5 pt-2.5 pb-1.5 flex-1">
          {/* College Name - always 2 lines */}
          <Text
            className="text-typography-900 font-inter-bold text-base leading-tight"
            numberOfLines={2}
            style={{ minHeight: 40 }}
          >
            {college.name}
          </Text>

          {/* City */}
          <Text
            className="text-typography-500 text-xs mt-0.5"
            numberOfLines={1}
          >
            {college.city || college.country}
          </Text>

          {/* Department Chips - fills remaining space, clips overflow */}
          <Box className="flex-row flex-wrap gap-1 mt-auto pt-1.5 flex-1" style={{ overflow: 'hidden' }}>
            {departments.map((dept) => (
              <Box
                key={dept}
                className="px-1.5 py-0.5 rounded bg-background-100 self-start"
              >
                <Text
                  className="text-2xs font-inter-medium text-typography-600"
                  numberOfLines={1}
                >
                  {dept}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Pressable>
  );
}

export default CollegeCard;

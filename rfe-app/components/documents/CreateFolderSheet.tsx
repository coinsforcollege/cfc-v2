'use client';
import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  Pressable,
  useColorScheme,
  TextInput,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { X } from '@/components/navigation/icons';
import { documentsApi } from '@/src/api/documents.api';
import { useAuth } from '@/src/contexts/AuthContext';

interface CreateFolderSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  currentFolderId: string | null;
}

export function CreateFolderSheet({
  visible,
  onClose,
  onSuccess,
  currentFolderId,
}: CreateFolderSheetProps) {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setFolderName('');
    }
  }, [visible]);

  const handleCreate = useCallback(async () => {
    if (!token) {
      Alert.alert('Error', 'Please log in to create folders');
      return;
    }

    const trimmedName = folderName.trim();
    if (!trimmedName) {
      Alert.alert('Error', 'Please enter a folder name');
      return;
    }

    try {
      setLoading(true);
      await documentsApi.createFolder(token, {
        name: trimmedName,
        parentId: currentFolderId || undefined,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create folder');
    } finally {
      setLoading(false);
    }
  }, [token, folderName, currentFolderId, onSuccess, onClose]);

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
        <Pressable
          className="flex-1 justify-end"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          onPress={onClose}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Box
              className={`rounded-t-3xl ${isDark ? 'bg-background-50' : 'bg-white'}`}
              style={{ paddingBottom: insets.bottom + 16 }}
            >
              {/* Handle bar */}
              <Box className="items-center pt-3 pb-2">
                <Box
                  className="w-10 h-1 rounded-full"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}
                />
              </Box>

              {/* Header */}
              <HStack className="items-center justify-between px-5 pb-4">
                <VStack>
                  <Text className="text-xl font-inter-bold text-typography-900">
                    New Folder
                  </Text>
                  <Text className="text-sm text-typography-500 mt-0.5">
                    Create a folder to organize your files
                  </Text>
                </VStack>
                <Pressable
                  onPress={onClose}
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                >
                  <X size={18} color={isDark ? '#a1a1aa' : '#71717a'} />
                </Pressable>
              </HStack>

              {/* Divider */}
              <Box
                className="h-px mx-5"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
              />

              <VStack className="px-5 pt-5" space="lg">
                {/* Folder Name Input */}
                <VStack space="sm">
                  <Text className="text-sm font-inter-medium text-typography-700">
                    Folder Name
                  </Text>
                  <Box
                    className="rounded-xl px-4 py-3.5 border"
                    style={{
                      backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                    }}
                  >
                    <TextInput
                      placeholder="Enter folder name..."
                      placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                      value={folderName}
                      onChangeText={setFolderName}
                      autoFocus
                      style={{
                        color: isDark ? '#f5f5f5' : '#171717',
                        fontFamily: 'Inter-Regular',
                        fontSize: 16,
                      }}
                    />
                  </Box>
                </VStack>

                {/* Create Button */}
                <Pressable
                  onPress={handleCreate}
                  disabled={loading || !folderName.trim()}
                  style={({ pressed }) => ({
                    opacity: loading || !folderName.trim() ? 0.5 : pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }],
                  })}
                >
                  <Box
                    className="rounded-xl py-4 items-center justify-center"
                    style={{ backgroundColor: '#3b82f6' }}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white font-inter-semibold text-base">
                        Create Folder
                      </Text>
                    )}
                  </Box>
                </Pressable>
              </VStack>
            </Box>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default CreateFolderSheet;

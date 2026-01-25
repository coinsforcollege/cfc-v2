'use client';
import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  Pressable,
  useColorScheme,
  ActivityIndicator,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { X, Home, CheckCircle } from '@/components/navigation/icons';
import { documentsApi, Folder, Document } from '@/src/api/documents.api';
import { useAuth } from '@/src/contexts/AuthContext';

interface MoveToSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  items: (Document | Folder)[];
  itemType: 'document' | 'folder';
  currentFolderId: string | null;
}

// Folder icon component
function FolderIcon({ size, color }: { size: number; color: string }) {
  return (
    <Box style={{ width: size, height: size * 0.8, position: 'relative' }}>
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: size * 0.4,
          height: size * 0.2,
          backgroundColor: color,
          borderTopLeftRadius: 2,
          borderTopRightRadius: 2,
        }}
      />
      <Box
        style={{
          position: 'absolute',
          top: size * 0.15,
          left: 0,
          width: size,
          height: size * 0.65,
          backgroundColor: color,
          borderRadius: 3,
        }}
      />
    </Box>
  );
}

export function MoveToSheet({
  visible,
  onClose,
  onSuccess,
  items,
  itemType,
  currentFolderId,
}: MoveToSheetProps) {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [moving, setMoving] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  // Fetch folders when modal opens
  useEffect(() => {
    if (visible && token) {
      fetchFolders();
      setSelectedFolderId(currentFolderId ? null : null);
    }
  }, [visible, token, currentFolderId]);

  const fetchFolders = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await documentsApi.getFolders(token);
      setFolders(response.data);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load folders');
    } finally {
      setLoading(false);
    }
  };

  const handleMove = useCallback(async () => {
    if (!token) return;

    if (selectedFolderId === currentFolderId) {
      Alert.alert('Error', 'Items are already in this location');
      return;
    }

    const itemIds = items.map(i => i._id);
    if (itemType === 'folder' && selectedFolderId && itemIds.includes(selectedFolderId)) {
      Alert.alert('Error', 'Cannot move folder into itself');
      return;
    }

    try {
      setMoving(true);
      if (itemType === 'document') {
        await documentsApi.moveDocuments(
          token,
          items.map(i => i._id),
          selectedFolderId
        );
      } else {
        if (items.length === 1) {
          Alert.alert('Not Supported', 'Moving folders is not yet supported');
          return;
        }
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to move items');
    } finally {
      setMoving(false);
    }
  }, [token, items, itemType, selectedFolderId, currentFolderId, onSuccess, onClose]);

  const itemIds = items.map(i => i._id);
  const availableFolders = folders.filter(f => !itemIds.includes(f._id));
  const rootFolders = availableFolders.filter(f => !f.parent);
  const getChildFolders = (parentId: string) =>
    availableFolders.filter(f => f.parent === parentId);

  const renderFolder = (folder: Folder, level: number = 0) => {
    const isSelected = selectedFolderId === folder._id;
    const isDisabled = folder._id === currentFolderId;
    const children = getChildFolders(folder._id);

    return (
      <VStack key={folder._id}>
        <Pressable
          onPress={() => !isDisabled && setSelectedFolderId(folder._id)}
          disabled={isDisabled}
          style={({ pressed }) => ({
            opacity: isDisabled ? 0.4 : 1,
            backgroundColor: pressed && !isDisabled
              ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)')
              : isSelected
                ? (isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)')
                : 'transparent',
          })}
        >
          <HStack
            className="px-5 py-3.5 items-center"
            style={{ paddingLeft: 20 + level * 24 }}
          >
            <Box
              className="w-9 h-9 rounded-lg items-center justify-center mr-3"
              style={{
                backgroundColor: isSelected
                  ? 'rgba(59, 130, 246, 0.15)'
                  : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'),
              }}
            >
              <FolderIcon size={18} color={isSelected ? '#3b82f6' : (isDark ? '#60a5fa' : '#3b82f6')} />
            </Box>
            <Text
              className={`font-inter-medium flex-1 ${
                isSelected ? 'text-blue-500' : 'text-typography-900'
              }`}
              numberOfLines={1}
            >
              {folder.name}
            </Text>
            {isSelected && (
              <CheckCircle size={20} color="#3b82f6" />
            )}
            {isDisabled && (
              <Box
                className="px-2 py-1 rounded-full"
                style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
              >
                <Text className="text-typography-400 text-xs">Current</Text>
              </Box>
            )}
          </HStack>
        </Pressable>
        {children.map(child => renderFolder(child, level + 1))}
      </VStack>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        onPress={onClose}
      >
        <Pressable onPress={(e) => e.stopPropagation()}>
          <Box
            className={`rounded-t-3xl ${isDark ? 'bg-background-50' : 'bg-white'}`}
            style={{ paddingBottom: insets.bottom + 16, maxHeight: '75%' }}
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
                  Move to
                </Text>
                <Text className="text-sm text-typography-500 mt-0.5">
                  {items.length} {items.length === 1 ? 'item' : 'items'} selected
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

            {loading ? (
              <Box className="py-12 items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
              </Box>
            ) : (
              <ScrollView style={{ maxHeight: 320 }} showsVerticalScrollIndicator={false}>
                <VStack className="pt-2 pb-2">
                  {/* Root option */}
                  <Pressable
                    onPress={() => setSelectedFolderId(null)}
                    disabled={currentFolderId === null}
                    style={({ pressed }) => ({
                      opacity: currentFolderId === null ? 0.4 : 1,
                      backgroundColor: pressed && currentFolderId !== null
                        ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)')
                        : selectedFolderId === null
                          ? (isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(59, 130, 246, 0.08)')
                          : 'transparent',
                    })}
                  >
                    <HStack className="px-5 py-3.5 items-center">
                      <Box
                        className="w-9 h-9 rounded-lg items-center justify-center mr-3"
                        style={{
                          backgroundColor: selectedFolderId === null
                            ? 'rgba(59, 130, 246, 0.15)'
                            : (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'),
                        }}
                      >
                        <Home size={18} color={selectedFolderId === null ? '#3b82f6' : (isDark ? '#a1a1aa' : '#6b7280')} />
                      </Box>
                      <Text
                        className={`font-inter-medium flex-1 ${
                          selectedFolderId === null ? 'text-blue-500' : 'text-typography-900'
                        }`}
                      >
                        My Documents (Root)
                      </Text>
                      {selectedFolderId === null && (
                        <CheckCircle size={20} color="#3b82f6" />
                      )}
                      {currentFolderId === null && (
                        <Box
                          className="px-2 py-1 rounded-full"
                          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                        >
                          <Text className="text-typography-400 text-xs">Current</Text>
                        </Box>
                      )}
                    </HStack>
                  </Pressable>

                  {/* Folder list */}
                  {rootFolders.map(folder => renderFolder(folder))}

                  {availableFolders.length === 0 && (
                    <Box className="py-8 items-center">
                      <Text className="text-typography-500 text-sm">
                        No other folders available
                      </Text>
                    </Box>
                  )}
                </VStack>
              </ScrollView>
            )}

            {/* Move Button */}
            <Box className="px-5 pt-4">
              <Pressable
                onPress={handleMove}
                disabled={moving || selectedFolderId === currentFolderId}
                style={({ pressed }) => ({
                  opacity: moving || selectedFolderId === currentFolderId ? 0.5 : pressed ? 0.9 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                })}
              >
                <Box
                  className="rounded-xl py-4 items-center justify-center"
                  style={{ backgroundColor: '#3b82f6' }}
                >
                  {moving ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-inter-semibold text-base">
                      Move Here
                    </Text>
                  )}
                </Box>
              </Pressable>
            </Box>
          </Box>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default MoveToSheet;

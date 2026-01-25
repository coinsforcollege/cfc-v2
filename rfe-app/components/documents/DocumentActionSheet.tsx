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
  ScrollView,
  Share,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import {
  X,
  Trash2,
  Globe,
  ShieldCheck,
  ChevronRight,
  File,
  Image,
  Video,
  ExternalLink,
} from '@/components/navigation/icons';
import { documentsApi, Document, Folder } from '@/src/api/documents.api';
import { useAuth } from '@/src/contexts/AuthContext';
import config from '@/src/config';

type ItemType = 'document' | 'folder';

interface DocumentActionSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: Document | Folder | null;
  itemType: ItemType | null;
  onMovePress?: () => void;
}

const FILE_TYPE_CONFIG: Record<string, { icon: React.ComponentType<any>; color: string; bg: string }> = {
  image: { icon: Image, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  document: { icon: File, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  video: { icon: Video, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

// Custom icons
function PencilIcon({ size, color }: { size: number; color: string }) {
  return (
    <Box style={{ width: size, height: size, position: 'relative' }}>
      <Box
        style={{
          position: 'absolute',
          width: size * 0.7,
          height: size * 0.15,
          backgroundColor: color,
          top: size * 0.15,
          left: size * 0.15,
          transform: [{ rotate: '-45deg' }],
          borderRadius: 2,
        }}
      />
      <Box
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.08,
          borderRightWidth: size * 0.08,
          borderTopWidth: size * 0.15,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          bottom: size * 0.1,
          left: size * 0.05,
          transform: [{ rotate: '-45deg' }],
        }}
      />
    </Box>
  );
}

function MoveIcon({ size, color }: { size: number; color: string }) {
  return (
    <Box style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Box
        style={{
          width: size * 0.6,
          height: size * 0.5,
          borderWidth: 2,
          borderColor: color,
          borderRadius: 3,
          position: 'relative',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: -2,
            left: 2,
            width: size * 0.25,
            height: size * 0.12,
            backgroundColor: color,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
          }}
        />
      </Box>
    </Box>
  );
}

function DownloadIcon({ size, color }: { size: number; color: string }) {
  return (
    <Box style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Arrow */}
      <Box
        style={{
          width: 2,
          height: size * 0.45,
          backgroundColor: color,
          position: 'absolute',
          top: size * 0.1,
        }}
      />
      {/* Arrow head */}
      <Box
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.15,
          borderRightWidth: size * 0.15,
          borderTopWidth: size * 0.2,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
          position: 'absolute',
          top: size * 0.45,
        }}
      />
      {/* Base line */}
      <Box
        style={{
          width: size * 0.6,
          height: 2,
          backgroundColor: color,
          position: 'absolute',
          bottom: size * 0.15,
          borderRadius: 1,
        }}
      />
    </Box>
  );
}

function ShareIcon({ size, color }: { size: number; color: string }) {
  return (
    <Box style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Arrow */}
      <Box
        style={{
          width: 2,
          height: size * 0.4,
          backgroundColor: color,
          position: 'absolute',
          top: size * 0.05,
        }}
      />
      {/* Arrow head */}
      <Box
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.12,
          borderRightWidth: size * 0.12,
          borderBottomWidth: size * 0.15,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderBottomColor: color,
          position: 'absolute',
          top: size * 0.02,
        }}
      />
      {/* Box */}
      <Box
        style={{
          width: size * 0.7,
          height: size * 0.5,
          borderWidth: 2,
          borderTopWidth: 0,
          borderColor: color,
          borderRadius: 4,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          position: 'absolute',
          bottom: size * 0.1,
        }}
      />
    </Box>
  );
}

function IncognitoIcon({ size, color }: { size: number; color: string }) {
  return (
    <Box style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Hat */}
      <Box
        style={{
          position: 'absolute',
          top: size * 0.1,
          width: size * 0.8,
          height: size * 0.25,
          backgroundColor: color,
          borderTopLeftRadius: size * 0.15,
          borderTopRightRadius: size * 0.15,
        }}
      />
      {/* Brim */}
      <Box
        style={{
          position: 'absolute',
          top: size * 0.32,
          width: size * 0.95,
          height: size * 0.12,
          backgroundColor: color,
          borderRadius: size * 0.06,
        }}
      />
      {/* Glasses */}
      <Box
        style={{
          position: 'absolute',
          top: size * 0.5,
          width: size * 0.85,
          height: size * 0.3,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box
          style={{
            width: size * 0.35,
            height: size * 0.28,
            backgroundColor: '#374151',
            borderRadius: size * 0.14,
            borderWidth: 2,
            borderColor: color,
          }}
        />
        <Box style={{ width: size * 0.1, height: 2, backgroundColor: color }} />
        <Box
          style={{
            width: size * 0.35,
            height: size * 0.28,
            backgroundColor: '#374151',
            borderRadius: size * 0.14,
            borderWidth: 2,
            borderColor: color,
          }}
        />
      </Box>
    </Box>
  );
}

export function DocumentActionSheet({
  visible,
  onClose,
  onSuccess,
  item,
  itemType,
  onMovePress,
}: DocumentActionSheetProps) {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [newName, setNewName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (visible && item) {
      setNewName(item.name);
      setIsRenaming(false);
      setActionLoading(null);
    }
  }, [visible, item]);

  const getFileUrl = useCallback((doc: Document) => {
    if (!doc.url) return null;
    return doc.url.startsWith('http')
      ? doc.url
      : `${config.apiUrl.replace('/api', '')}${doc.url}`;
  }, []);

  const handleRename = useCallback(async () => {
    if (!token || !item) return;

    const trimmedName = newName.trim();
    if (!trimmedName || trimmedName === item.name) {
      setIsRenaming(false);
      return;
    }

    try {
      setLoading(true);
      if (itemType === 'folder') {
        await documentsApi.renameFolder(token, item._id, trimmedName);
      } else {
        await documentsApi.updateDocument(token, item._id, { name: trimmedName });
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to rename');
    } finally {
      setLoading(false);
    }
  }, [token, item, itemType, newName, onSuccess, onClose]);

  const handleDelete = useCallback(async () => {
    if (!token || !item) return;

    Alert.alert(
      `Delete ${itemType === 'folder' ? 'Folder' : 'File'}`,
      itemType === 'folder'
        ? 'This will delete the folder and all its contents. This action cannot be undone.'
        : 'This will permanently delete this file. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              if (itemType === 'folder') {
                await documentsApi.deleteFolder(token, item._id);
              } else {
                await documentsApi.deleteDocument(token, item._id);
              }
              onSuccess();
              onClose();
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete');
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  }, [token, item, itemType, onSuccess, onClose]);

  const handleToggleVisibility = useCallback(async () => {
    if (!token || !item || itemType !== 'document') return;

    const doc = item as Document;
    try {
      setLoading(true);
      await documentsApi.updateDocument(token, item._id, { isPublic: !doc.isPublic });
      onSuccess();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update visibility');
    } finally {
      setLoading(false);
    }
  }, [token, item, itemType, onSuccess, onClose]);

  const handleMove = useCallback(() => {
    onClose();
    onMovePress?.();
  }, [onClose, onMovePress]);

  const handleDownload = useCallback(async () => {
    if (!item || itemType !== 'document') return;

    const doc = item as Document;
    const fileUrl = getFileUrl(doc);
    if (!fileUrl) {
      Alert.alert('Error', 'File URL not available');
      return;
    }

    try {
      setActionLoading('download');

      // Download file to cache directory first
      const filename = doc.name || 'file';
      const localUri = FileSystem.cacheDirectory + filename;

      const downloadResult = await FileSystem.downloadAsync(fileUrl, localUri);

      if (downloadResult.status !== 200) {
        Alert.alert('Error', 'Failed to download file');
        return;
      }

      if (Platform.OS === 'android') {
        // For Android: Use StorageAccessFramework to save to Downloads
        const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();

        if (permissions.granted) {
          const base64 = await FileSystem.readAsStringAsync(downloadResult.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const newUri = await FileSystem.StorageAccessFramework.createFileAsync(
            permissions.directoryUri,
            filename,
            doc.mimeType || 'application/octet-stream'
          );

          await FileSystem.writeAsStringAsync(newUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          Alert.alert('Downloaded', `${doc.name} saved successfully`);
          onClose();
        }
      } else {
        // For iOS: Use sharing to save
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(downloadResult.uri, {
            mimeType: doc.mimeType,
            dialogTitle: `Save ${doc.name}`,
          });
          onClose();
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to download');
    } finally {
      setActionLoading(null);
    }
  }, [item, itemType, getFileUrl, onClose]);

  const handleShare = useCallback(async () => {
    if (!item || itemType !== 'document') return;

    const doc = item as Document;
    const fileUrl = getFileUrl(doc);
    if (!fileUrl) {
      Alert.alert('Error', 'File URL not available');
      return;
    }

    try {
      setActionLoading('share');

      // Download file first for native sharing
      const filename = doc.name || 'file';
      const localUri = FileSystem.cacheDirectory + filename;

      const downloadResult = await FileSystem.downloadAsync(fileUrl, localUri);

      if (downloadResult.status === 200) {
        await Sharing.shareAsync(downloadResult.uri, {
          mimeType: doc.mimeType,
          dialogTitle: `Share ${doc.name}`,
        });
      } else {
        Alert.alert('Error', 'Failed to download file for sharing');
      }
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        Alert.alert('Error', error.message || 'Failed to share');
      }
    } finally {
      setActionLoading(null);
    }
  }, [item, itemType, getFileUrl]);

  if (!item) return null;

  const isDocument = itemType === 'document';
  const doc = isDocument ? (item as Document) : null;
  const fileConfig = doc ? FILE_TYPE_CONFIG[doc.fileType] || FILE_TYPE_CONFIG.document : null;
  const FileIcon = fileConfig?.icon || File;

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
                <HStack className="items-center flex-1 mr-4">
                  {isDocument && (
                    <Box
                      className="w-11 h-11 rounded-xl items-center justify-center mr-3"
                      style={{ backgroundColor: fileConfig?.bg }}
                    >
                      <FileIcon size={22} color={fileConfig?.color || '#f59e0b'} />
                    </Box>
                  )}
                  <VStack className="flex-1">
                    <Text
                      className="font-inter-semibold text-typography-900 text-base"
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text className="text-typography-500 text-sm">
                      {isDocument ? 'File options' : 'Folder options'}
                    </Text>
                  </VStack>
                </HStack>
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
                <Box className="py-10 items-center">
                  <ActivityIndicator size="large" color="#3b82f6" />
                </Box>
              ) : isRenaming ? (
                /* Rename Mode */
                <VStack className="px-5 pt-5" space="lg">
                  <VStack space="sm">
                    <Text className="text-sm font-inter-medium text-typography-700">
                      New Name
                    </Text>
                    <Box
                      className="rounded-xl px-4 py-3.5 border"
                      style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                      }}
                    >
                      <TextInput
                        placeholder="Enter new name..."
                        placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                        value={newName}
                        onChangeText={setNewName}
                        autoFocus
                        style={{
                          color: isDark ? '#f5f5f5' : '#171717',
                          fontFamily: 'Inter-Regular',
                          fontSize: 16,
                        }}
                      />
                    </Box>
                  </VStack>
                  <HStack space="sm">
                    <Pressable
                      onPress={() => setIsRenaming(false)}
                      style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.8 : 1 })}
                    >
                      <Box
                        className="rounded-xl py-3.5 items-center border"
                        style={{ borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)' }}
                      >
                        <Text className="font-inter-semibold text-typography-700">Cancel</Text>
                      </Box>
                    </Pressable>
                    <Pressable
                      onPress={handleRename}
                      disabled={!newName.trim() || newName.trim() === item.name}
                      style={({ pressed }) => ({
                        flex: 1,
                        opacity: !newName.trim() || newName.trim() === item.name ? 0.5 : pressed ? 0.9 : 1,
                      })}
                    >
                      <Box className="rounded-xl py-3.5 items-center" style={{ backgroundColor: '#3b82f6' }}>
                        <Text className="font-inter-semibold text-white">Save</Text>
                      </Box>
                    </Pressable>
                  </HStack>
                </VStack>
              ) : (
                /* Action List */
                <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
                  <VStack className="pt-2 pb-2">
                    {/* Share (documents only) */}
                    {isDocument && (
                      <Pressable
                        onPress={handleShare}
                        disabled={actionLoading === 'share'}
                        style={({ pressed }) => ({
                          backgroundColor: pressed
                            ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)')
                            : 'transparent',
                        })}
                      >
                        <HStack className="px-5 py-4 items-center">
                          <Box
                            className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                            style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                          >
                            {actionLoading === 'share' ? (
                              <ActivityIndicator size="small" color="#3b82f6" />
                            ) : (
                              <ShareIcon size={20} color="#3b82f6" />
                            )}
                          </Box>
                          <Text className="font-inter-medium text-typography-900 flex-1">
                            Share
                          </Text>
                        </HStack>
                      </Pressable>
                    )}

                    {/* Download (documents only) */}
                    {isDocument && (
                      <Pressable
                        onPress={handleDownload}
                        disabled={actionLoading === 'download'}
                        style={({ pressed }) => ({
                          backgroundColor: pressed
                            ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)')
                            : 'transparent',
                        })}
                      >
                        <HStack className="px-5 py-4 items-center">
                          <Box
                            className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                            style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                          >
                            {actionLoading === 'download' ? (
                              <ActivityIndicator size="small" color="#10b981" />
                            ) : (
                              <DownloadIcon size={20} color="#10b981" />
                            )}
                          </Box>
                          <Text className="font-inter-medium text-typography-900 flex-1">
                            Open / Download
                          </Text>
                          <ExternalLink size={16} color={isDark ? '#6b7280' : '#9ca3af'} />
                        </HStack>
                      </Pressable>
                    )}

                    {/* Divider */}
                    {isDocument && (
                      <Box
                        className="h-px mx-5 my-2"
                        style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
                      />
                    )}

                    {/* Rename */}
                    <Pressable
                      onPress={() => setIsRenaming(true)}
                      style={({ pressed }) => ({
                        backgroundColor: pressed
                          ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)')
                          : 'transparent',
                      })}
                    >
                      <HStack className="px-5 py-4 items-center">
                        <Box
                          className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }}
                        >
                          <PencilIcon size={20} color={isDark ? '#a1a1aa' : '#6b7280'} />
                        </Box>
                        <Text className="font-inter-medium text-typography-900 flex-1">
                          Rename
                        </Text>
                        <ChevronRight size={18} color={isDark ? '#6b7280' : '#9ca3af'} />
                      </HStack>
                    </Pressable>

                    {/* Move */}
                    {onMovePress && isDocument && (
                      <Pressable
                        onPress={handleMove}
                        style={({ pressed }) => ({
                          backgroundColor: pressed
                            ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)')
                            : 'transparent',
                        })}
                      >
                        <HStack className="px-5 py-4 items-center">
                          <Box
                            className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                            style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)' }}
                          >
                            <MoveIcon size={20} color={isDark ? '#a1a1aa' : '#6b7280'} />
                          </Box>
                          <Text className="font-inter-medium text-typography-900 flex-1">
                            Move to...
                          </Text>
                          <ChevronRight size={18} color={isDark ? '#6b7280' : '#9ca3af'} />
                        </HStack>
                      </Pressable>
                    )}

                    {/* Toggle Visibility (documents only) */}
                    {isDocument && doc && (
                      <Pressable
                        onPress={handleToggleVisibility}
                        style={({ pressed }) => ({
                          backgroundColor: pressed
                            ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)')
                            : 'transparent',
                        })}
                      >
                        <HStack className="px-5 py-4 items-center">
                          <Box
                            className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                            style={{
                              backgroundColor: doc.isPublic
                                ? 'rgba(16, 185, 129, 0.1)'
                                : 'rgba(107, 114, 128, 0.15)',
                            }}
                          >
                            {doc.isPublic ? (
                              <Globe size={20} color="#10b981" />
                            ) : (
                              <IncognitoIcon size={20} color="#6b7280" />
                            )}
                          </Box>
                          <VStack className="flex-1">
                            <Text className="font-inter-medium text-typography-900">
                              {doc.isPublic ? 'Make Private' : 'Make Public'}
                            </Text>
                            <Text className="text-typography-500 text-xs mt-0.5">
                              {doc.isPublic
                                ? 'Only you can see this file'
                                : 'Colleges can view this file'}
                            </Text>
                          </VStack>
                        </HStack>
                      </Pressable>
                    )}

                    {/* Divider */}
                    <Box
                      className="h-px mx-5 my-2"
                      style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}
                    />

                    {/* Delete */}
                    <Pressable
                      onPress={handleDelete}
                      style={({ pressed }) => ({
                        backgroundColor: pressed
                          ? (isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)')
                          : 'transparent',
                      })}
                    >
                      <HStack className="px-5 py-4 items-center">
                        <Box
                          className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                          style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        >
                          <Trash2 size={20} color="#ef4444" />
                        </Box>
                        <Text className="font-inter-medium text-error-500">
                          Delete
                        </Text>
                      </HStack>
                    </Pressable>
                  </VStack>
                </ScrollView>
              )}
            </Box>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default DocumentActionSheet;

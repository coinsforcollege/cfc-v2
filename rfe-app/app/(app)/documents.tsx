'use client';
import React, { useState, useCallback, useEffect } from 'react';
import {
  Pressable,
  useWindowDimensions,
  useColorScheme,
  Platform,
  Image,
  Alert,
  ActivityIndicator,
  TextInput,
  View,
  InteractionManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { useAuth } from '@/src/contexts/AuthContext';
import { UserAvatar } from '@/components/navigation/UserAvatar';
import { studentApi } from '@/src/api/student.api';
import { ChevronLeft, Upload, Home, Search } from '@/components/navigation/icons';
import {
  DocumentListSection,
  StorageBar,
  CreateFolderSheet,
  DocumentActionSheet,
  MoveToSheet,
} from '@/components/documents';
import { documentsApi, Folder, Document } from '@/src/api/documents.api';

const TABLET_BREAKPOINT = 768;

// Icon colors
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


// Folder icon component for breadcrumb
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

export default function DocumentsScreen() {
  const { width } = useWindowDimensions();
  const { user, token } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isDesktop = width >= TABLET_BREAKPOINT;
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;
  const [isReady, setIsReady] = useState(false);

  // Delay heavy content until after navigation animation completes
  useEffect(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => interaction.cancel();
  }, []);

  // State
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<Folder[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageLimit] = useState(1024 * 1024 * 1024); // 1GB
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFabMenu, setShowFabMenu] = useState(false);

  // Sheet states
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showMoveSheet, setShowMoveSheet] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Document | Folder | null>(null);
  const [selectedItemType, setSelectedItemType] = useState<'document' | 'folder' | null>(null);

  const topPadding = isDesktop ? 16 : Math.max(insets.top, Platform.OS === 'ios' ? 47 : 24);

  // Fetch storage info and profile picture
  useEffect(() => {
    if (token) {
      fetchStorageInfo();
      const fetchProfilePicture = async () => {
        try {
          const response = await studentApi.getProfile(token);
          if (response.success) {
            setProfilePicture(response.data.profilePicture || null);
          }
        } catch (error) {
          console.error('Error fetching profile picture:', error);
        }
      };
      fetchProfilePicture();
    }
  }, [token, refreshTrigger]);

  const fetchStorageInfo = async () => {
    if (!token) return;
    try {
      const response = await documentsApi.getStorageInfo(token);
      setStorageUsed(response.data.used);
      // Optionally update storage limit from server if different
      // setStorageLimit(response.data.total);
    } catch (error) {
      console.error('Failed to fetch storage info:', error);
    }
  };

  // Build folder path when navigating
  useEffect(() => {
    if (!token || !currentFolderId) {
      setFolderPath([]);
      return;
    }

    const buildPath = async () => {
      try {
        const response = await documentsApi.getFolders(token);
        const folders = response.data;

        // Build path from current folder to root
        const path: Folder[] = [];
        let folderId: string | null = currentFolderId;

        while (folderId) {
          const folder = folders.find(f => f._id === folderId);
          if (folder) {
            path.unshift(folder);
            folderId = folder.parent;
          } else {
            break;
          }
        }

        setFolderPath(path);
      } catch (error) {
        console.error('Failed to build folder path:', error);
      }
    };

    buildPath();
  }, [token, currentFolderId]);

  const handleFolderPress = useCallback((folder: Folder) => {
    setCurrentFolderId(folder._id);
  }, []);

  const handleDocumentPress = useCallback((document: Document) => {
    // For now, just show action sheet
    // Later could open a preview or external viewer
    setSelectedItem(document);
    setSelectedItemType('document');
    setShowActionSheet(true);
  }, []);

  const handleFolderLongPress = useCallback((folder: Folder) => {
    setSelectedItem(folder);
    setSelectedItemType('folder');
    setShowActionSheet(true);
  }, []);

  const handleDocumentLongPress = useCallback((document: Document) => {
    setSelectedItem(document);
    setSelectedItemType('document');
    setShowActionSheet(true);
  }, []);

  const handleNavigateToRoot = useCallback(() => {
    setCurrentFolderId(null);
  }, []);

  const handleNavigateToFolder = useCallback((folderId: string) => {
    setCurrentFolderId(folderId);
  }, []);

  const handleBack = useCallback(() => {
    if (currentFolderId) {
      // Go to parent folder
      const currentIndex = folderPath.findIndex(f => f._id === currentFolderId);
      if (currentIndex > 0) {
        setCurrentFolderId(folderPath[currentIndex - 1]._id);
      } else {
        setCurrentFolderId(null);
      }
    } else {
      router.back();
    }
  }, [currentFolderId, folderPath]);

  const handleRefresh = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleUpload = useCallback(async () => {
    if (!token) {
      Alert.alert('Error', 'Please log in to upload files');
      return;
    }

    Alert.alert(
      'Upload Files',
      'Choose file type to upload',
      [
        {
          text: 'Photos/Videos',
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Permission Required', 'Please grant photo library access to upload files.');
              return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsMultipleSelection: true,
              quality: 0.8,
            });

            if (!result.canceled && result.assets) {
              const files = result.assets.map((asset) => ({
                uri: asset.uri,
                name: asset.fileName || `file_${Date.now()}.${asset.uri.split('.').pop()}`,
                type: asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
              }));

              await uploadFiles(files);
            }
          },
        },
        {
          text: 'Documents',
          onPress: async () => {
            try {
              const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                multiple: true,
              });

              if (!result.canceled && result.assets) {
                const files = result.assets.map((asset) => ({
                  uri: asset.uri,
                  name: asset.name,
                  type: asset.mimeType || 'application/octet-stream',
                }));

                await uploadFiles(files);
              }
            } catch (error) {
              console.error('Document picker error:', error);
            }
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  }, [token, currentFolderId]);

  const uploadFiles = async (files: { uri: string; name: string; type: string }[]) => {
    if (!token) return;

    try {
      setUploading(true);
      await documentsApi.uploadDocuments(token, files, currentFolderId || undefined);
      handleRefresh();
      Alert.alert('Success', `${files.length} file${files.length > 1 ? 's' : ''} uploaded`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleMovePress = useCallback(() => {
    if (selectedItem && selectedItemType === 'document') {
      setShowMoveSheet(true);
    }
  }, [selectedItem, selectedItemType]);

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#09090b' : '#ffffff' }}>
      {/* Header */}
      <Box
        className="bg-background-0"
        style={{
          paddingTop: topPadding,
          zIndex: 10,
        }}
      >
        <Box
          className="px-4 py-3"
          style={{
            maxWidth: isDesktop ? 1200 : undefined,
            alignSelf: isDesktop ? 'center' : undefined,
            width: '100%',
          }}
        >
          {/* Top Row: Back, Title, Profile */}
          <Box className="flex-row items-center justify-between mb-3">
            <Box className="flex-row items-center flex-1">
              {!isDesktop && (
                <Pressable
                  onPress={handleBack}
                  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
                >
                  <Box className="w-9 h-9 items-center justify-center mr-1">
                    <ChevronLeft
                      size={22}
                      strokeWidth={2.5}
                      color={iconColors.primary}
                    />
                  </Box>
                </Pressable>
              )}

              {/* Title */}
              <Box className="flex-row items-center flex-1">
                <Image
                  source={require('@/assets/images/icons/app-icon-transparent-bg.png')}
                  style={{ width: 32, height: 32 }}
                  resizeMode="contain"
                />
                <Text className="text-lg font-inter-black text-typography-900 ml-2 tracking-tight">
                  Documents
                </Text>
              </Box>
            </Box>

            {!isDesktop && <UserAvatar name={user?.name || 'User'} profilePicture={profilePicture} size={36} />}
          </Box>

          {/* Search Bar */}
          <Box
            className="mt-3 flex-row items-center rounded-xl px-3"
            style={{
              backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
              height: 44,
            }}
          >
            <Search size={18} color={iconColors.muted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search files and folders..."
              placeholderTextColor={iconColors.muted}
              style={{
                flex: 1,
                marginLeft: 10,
                fontSize: 15,
                color: isDark ? '#f5f5f5' : '#262627',
                fontFamily: 'Inter-Medium',
              }}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <Pressable
                onPress={() => setSearchQuery('')}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Box
                  className="w-5 h-5 rounded-full items-center justify-center"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)' }}
                >
                  <Text className="text-xs text-typography-0 font-inter-bold">x</Text>
                </Box>
              </Pressable>
            )}
          </Box>
        </Box>
      </Box>

      {/* Storage Bar */}
      <StorageBar used={storageUsed} limit={storageLimit} />

      {/* Breadcrumb Navigation */}
      <Box className="px-4 pt-3 pb-1">
        <HStack className="items-center" style={{ flexWrap: 'wrap' }}>
          <Pressable
            onPress={handleNavigateToRoot}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <HStack className="items-center mr-1">
              <Home size={16} color={currentFolderId ? iconColors.muted : iconColors.primary} />
              <Text
                className={`text-sm ml-1 ${
                  currentFolderId ? 'text-typography-500' : 'text-typography-900 font-inter-semibold'
                }`}
              >
                My Files
              </Text>
            </HStack>
          </Pressable>

          {folderPath.map((folder, index) => (
            <HStack key={folder._id} className="items-center">
              <Text className="text-typography-400 mx-1">/</Text>
              <Pressable
                onPress={() => handleNavigateToFolder(folder._id)}
                style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
              >
                <HStack className="items-center">
                  <FolderIcon
                    size={14}
                    color={
                      index === folderPath.length - 1
                        ? (isDark ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)')
                        : iconColors.muted
                    }
                  />
                  <Text
                    className={`text-sm ml-1 ${
                      index === folderPath.length - 1
                        ? 'text-typography-900 font-inter-semibold'
                        : 'text-typography-500'
                    }`}
                    numberOfLines={1}
                  >
                    {folder.name}
                  </Text>
                </HStack>
              </Pressable>
            </HStack>
          ))}
        </HStack>
      </Box>

      {/* Document List */}
      {isReady ? (
        <>
          <DocumentListSection
            currentFolderId={currentFolderId}
            onFolderPress={handleFolderPress}
            onDocumentPress={handleDocumentPress}
            onFolderLongPress={handleFolderLongPress}
            onDocumentLongPress={handleDocumentLongPress}
            numColumns={isDesktop ? 4 : 2}
            refreshTrigger={refreshTrigger}
            searchQuery={searchQuery}
          />

          {/* Create Folder Sheet */}
          <CreateFolderSheet
            visible={showCreateFolder}
            onClose={() => setShowCreateFolder(false)}
            onSuccess={handleRefresh}
            currentFolderId={currentFolderId}
          />

          {/* Action Sheet */}
          <DocumentActionSheet
            visible={showActionSheet}
            onClose={() => {
              setShowActionSheet(false);
              setSelectedItem(null);
              setSelectedItemType(null);
            }}
            onSuccess={handleRefresh}
            item={selectedItem}
            itemType={selectedItemType}
            onMovePress={handleMovePress}
          />

          {/* Move Sheet */}
          <MoveToSheet
            visible={showMoveSheet}
            onClose={() => {
              setShowMoveSheet(false);
              setSelectedItem(null);
              setSelectedItemType(null);
            }}
            onSuccess={handleRefresh}
            items={selectedItem ? [selectedItem] : []}
            itemType={selectedItemType || 'document'}
            currentFolderId={currentFolderId}
          />
        </>
      ) : (
        <Box className="flex-1" />
      )}

      {/* Overlay */}
      {showFabMenu && (
        <Pressable
          onPress={() => setShowFabMenu(false)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        />
      )}

      {/* Speed Dial Options - positioned above FAB, aligned right */}
      {showFabMenu && (
        <View style={{ position: 'absolute', bottom: 168, right: 20, alignItems: 'flex-end' }}>
          {/* Upload button */}
          <Pressable
            onPress={() => { setShowFabMenu(false); handleUpload(); }}
            style={{ marginBottom: 12, flexDirection: 'row', alignItems: 'center' }}
          >
            <View style={{ backgroundColor: isDark ? '#27272a' : '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginRight: 12, elevation: 2 }}>
              <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 14 }}>Upload</Text>
            </View>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#10b981', justifyContent: 'center', alignItems: 'center', elevation: 4 }}>
              <Upload size={20} color="white" />
            </View>
          </Pressable>

          {/* New Folder button */}
          <Pressable
            onPress={() => { setShowFabMenu(false); setShowCreateFolder(true); }}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <View style={{ backgroundColor: isDark ? '#27272a' : '#fff', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 6, marginRight: 12, elevation: 2 }}>
              <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 14 }}>New Folder</Text>
            </View>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#3b82f6', justifyContent: 'center', alignItems: 'center', elevation: 4 }}>
              <FolderIcon size={20} color="white" />
            </View>
          </Pressable>
        </View>
      )}

      {/* Main FAB - fixed position */}
      <Pressable
        onPress={() => setShowFabMenu(!showFabMenu)}
        style={{
          position: 'absolute',
          bottom: 100,
          right: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: showFabMenu ? (isDark ? '#27272a' : '#ffffff') : '#3b82f6',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 8,
          transform: [{ rotate: showFabMenu ? '45deg' : '0deg' }],
        }}
      >
        <Text style={{ color: showFabMenu ? (isDark ? '#ffffff' : '#000000') : 'white', fontSize: 28, fontWeight: 'bold', marginTop: -4 }}>+</Text>
      </Pressable>
    </View>
  );
}

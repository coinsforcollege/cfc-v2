'use client';
import React, { useState, useCallback, useEffect } from 'react';
import {
  Modal,
  Pressable,
  useColorScheme,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import {
  X,
  FileText,
  CheckCircle,
  Upload,
  File,
  Image as ImageIcon,
  ChevronRight,
  ChevronLeft,
  Trash2,
  AlertCircle,
  Folder as FolderIcon,
} from '@/components/navigation/icons';
import { ScholarshipOffer, offersApi } from '@/src/api/offers.api';
import { documentsApi, Document, Folder } from '@/src/api/documents.api';
import { useAuth } from '@/src/contexts/AuthContext';
import config from '@/src/config';

interface SelectedDocument {
  requiredDocId: string;
  documentId?: string;
  newFile?: {
    uri: string;
    name: string;
    type: string;
  };
}

interface AcceptOfferSheetProps {
  visible: boolean;
  onClose: () => void;
  offer: ScholarshipOffer;
  onAcceptSuccess: () => void;
}

const ICON_COLORS = {
  light: {
    primary: 'rgb(38, 38, 39)',
    secondary: 'rgb(115, 115, 115)',
    muted: 'rgb(163, 163, 163)',
    accent: 'rgb(99, 102, 241)',
  },
  dark: {
    primary: 'rgb(245, 245, 245)',
    secondary: 'rgb(212, 212, 212)',
    muted: 'rgb(140, 140, 140)',
    accent: 'rgb(129, 140, 248)',
  },
};

export function AcceptOfferSheet({ visible, onClose, offer, onAcceptSuccess }: AcceptOfferSheetProps) {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const [selectedDocuments, setSelectedDocuments] = useState<SelectedDocument[]>([]);
  const [existingDocs, setExistingDocs] = useState<Document[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<{ id: string | null; name: string }[]>([{ id: null, name: 'My Documents' }]);
  const [loadingDocs, setLoadingDocs] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeRequiredDocId, setActiveRequiredDocId] = useState<string | null>(null);
  const [showDocPicker, setShowDocPicker] = useState(false);

  useEffect(() => {
    if (visible && token) {
      fetchExistingDocuments(null);
    }
  }, [visible, token]);

  useEffect(() => {
    if (showDocPicker && token) {
      fetchExistingDocuments(currentFolderId);
    }
  }, [currentFolderId, showDocPicker]);

  const fetchExistingDocuments = async (folderId: string | null) => {
    try {
      setLoadingDocs(true);
      const response = await documentsApi.getDocuments(token!, { folderId: folderId || undefined, limit: 100 });
      setFolders(response.data.folders || []);
      setExistingDocs(response.data.documents || []);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoadingDocs(false);
    }
  };

  const navigateToFolder = (folder: Folder) => {
    setFolderPath(prev => [...prev, { id: folder._id, name: folder.name }]);
    setCurrentFolderId(folder._id);
  };

  const navigateBack = () => {
    if (folderPath.length > 1) {
      const newPath = folderPath.slice(0, -1);
      setFolderPath(newPath);
      setCurrentFolderId(newPath[newPath.length - 1].id);
    }
  };

  const resetFolderNavigation = () => {
    setCurrentFolderId(null);
    setFolderPath([{ id: null, name: 'My Documents' }]);
  };

  const getSelectedDocForRequirement = (requiredDocId: string) => {
    return selectedDocuments.find(d => d.requiredDocId === requiredDocId);
  };

  const handleSelectExistingDoc = (requiredDocId: string, documentId: string) => {
    setSelectedDocuments(prev => {
      const filtered = prev.filter(d => d.requiredDocId !== requiredDocId);
      return [...filtered, { requiredDocId, documentId }];
    });
    setShowDocPicker(false);
    setActiveRequiredDocId(null);
    resetFolderNavigation();
  };

  const handleUploadNewDoc = useCallback(async (requiredDocId: string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedDocuments(prev => {
          const filtered = prev.filter(d => d.requiredDocId !== requiredDocId);
          return [...filtered, {
            requiredDocId,
            newFile: {
              uri: asset.uri,
              name: asset.name,
              type: asset.mimeType || 'application/octet-stream',
            },
          }];
        });
      }
    } catch (error) {
      console.error('Document picker error:', error);
    }
    setShowDocPicker(false);
    setActiveRequiredDocId(null);
  }, []);

  const handleUploadImage = useCallback(async (requiredDocId: string) => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant photo library access to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setSelectedDocuments(prev => {
        const filtered = prev.filter(d => d.requiredDocId !== requiredDocId);
        return [...filtered, {
          requiredDocId,
          newFile: {
            uri: asset.uri,
            name: asset.fileName || `image_${Date.now()}.jpg`,
            type: asset.mimeType || 'image/jpeg',
          },
        }];
      });
    }
    setShowDocPicker(false);
    setActiveRequiredDocId(null);
  }, []);

  const handleRemoveDoc = (requiredDocId: string) => {
    setSelectedDocuments(prev => prev.filter(d => d.requiredDocId !== requiredDocId));
  };

  const handleSubmit = useCallback(async () => {
    if (!token) {
      Alert.alert('Error', 'Please log in to accept offers');
      return;
    }

    const requiredDocs = offer.requiredDocuments.filter(d => d.required);
    const missingRequired = requiredDocs.filter(
      rd => !selectedDocuments.find(sd => sd.requiredDocId === rd._id)
    );

    if (missingRequired.length > 0) {
      Alert.alert(
        'Missing Documents',
        `Please provide the following required documents:\n${missingRequired.map(d => `- ${d.name}`).join('\n')}`
      );
      return;
    }

    try {
      setLoading(true);

      const uploadedDocIds: { requiredDocId: string; documentId: string }[] = [];
      const existingDocIds: { requiredDocId: string; documentId: string }[] = [];

      for (const selected of selectedDocuments) {
        if (selected.documentId) {
          existingDocIds.push({
            requiredDocId: selected.requiredDocId,
            documentId: selected.documentId,
          });
        } else if (selected.newFile) {
          const uploadResponse = await documentsApi.uploadDocuments(
            token,
            [selected.newFile]
          );
          if (uploadResponse.data && uploadResponse.data.length > 0) {
            uploadedDocIds.push({
              requiredDocId: selected.requiredDocId,
              documentId: uploadResponse.data[0]._id,
            });
          }
        }
      }

      const allDocIds = [...existingDocIds, ...uploadedDocIds];
      await offersApi.acceptOffer(token, offer._id, allDocIds);

      setSelectedDocuments([]);
      onAcceptSuccess();
      onClose();
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to accept offer');
    } finally {
      setLoading(false);
    }
  }, [token, offer, selectedDocuments, onAcceptSuccess, onClose]);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const getDocThumbnail = (doc: Document) => {
    if (doc.fileType === 'image') {
      const url = doc.url.startsWith('http')
        ? doc.url
        : `${config.apiUrl.replace('/api', '')}${doc.url}`;
      return url;
    }
    return null;
  };

  const requiredCount = offer.requiredDocuments.filter(d => d.required).length;
  const filledRequiredCount = offer.requiredDocuments.filter(
    d => d.required && selectedDocuments.find(sd => sd.requiredDocId === d._id)
  ).length;

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
          <Box
            className="rounded-t-3xl bg-primary-400"
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            {/* Header */}
            <HStack className="items-center justify-between px-4 py-4 border-b border-white/20">
              <VStack className="flex-1 mr-4">
                <Text className="text-white font-inter-bold text-lg">
                  Accept Scholarship
                </Text>
                <Text className="text-white/70 text-sm" numberOfLines={1}>
                  {offer.title}
                </Text>
              </VStack>
              <Pressable
                onPress={onClose}
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} color="white" />
              </Pressable>
            </HStack>

            <ScrollView style={{ maxHeight: 450 }} showsVerticalScrollIndicator={false}>
              <VStack className="px-4 py-4" space="md">
                {/* Progress indicator */}
                {requiredCount > 0 && (
                  <Box
                    className="rounded-xl p-3 flex-row items-center"
                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                  >
                    {filledRequiredCount === requiredCount ? (
                      <CheckCircle size={20} color="#86efac" />
                    ) : (
                      <AlertCircle size={20} color="#fcd34d" />
                    )}
                    <Text className="text-white/90 text-sm font-inter-medium ml-2">
                      {filledRequiredCount} of {requiredCount} required documents attached
                    </Text>
                  </Box>
                )}

                {/* Required Documents List */}
                <VStack space="sm">
                  <Text className="text-white/90 font-inter-semibold text-sm">
                    Documents to Submit
                  </Text>

                  {offer.requiredDocuments.map((reqDoc) => {
                    const selected = getSelectedDocForRequirement(reqDoc._id);
                    const existingDoc = selected?.documentId
                      ? existingDocs.find(d => d._id === selected.documentId)
                      : null;

                    return (
                      <Box key={reqDoc._id}>
                        <Box
                          className="rounded-xl p-4"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                        >
                          <HStack className="items-start mb-3">
                            <Box
                              className="w-8 h-8 rounded-lg items-center justify-center mr-3"
                              style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                            >
                              <FileText size={18} color="white" />
                            </Box>
                            <VStack className="flex-1">
                              <HStack className="items-center">
                                <Text className="text-white font-inter-semibold text-sm flex-1">
                                  {reqDoc.name}
                                </Text>
                                {selected ? (
                                  <Box className="bg-success-500 px-2 py-0.5 rounded ml-2">
                                    <Text className="text-white text-2xs font-inter-bold">
                                      Uploaded
                                    </Text>
                                  </Box>
                                ) : reqDoc.required ? (
                                  <Box className="bg-error-500/80 px-2 py-0.5 rounded ml-2">
                                    <Text className="text-white text-2xs font-inter-bold">
                                      Required
                                    </Text>
                                  </Box>
                                ) : null}
                              </HStack>
                              {reqDoc.description && (
                                <Text className="text-white/60 text-xs mt-1">
                                  {reqDoc.description}
                                </Text>
                              )}
                            </VStack>
                          </HStack>

                          {/* Selected Document Display */}
                          {selected ? (
                            <Box
                              className="rounded-lg p-3 flex-row items-center"
                              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                            >
                              {existingDoc ? (
                                <>
                                  {getDocThumbnail(existingDoc) ? (
                                    <Image
                                      source={{ uri: getDocThumbnail(existingDoc)! }}
                                      style={{ width: 40, height: 40, borderRadius: 8 }}
                                    />
                                  ) : (
                                    <Box
                                      className="w-10 h-10 rounded-lg items-center justify-center"
                                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                    >
                                      <File size={20} color="white" />
                                    </Box>
                                  )}
                                  <VStack className="flex-1 ml-3">
                                    <Text className="text-white text-sm font-inter-medium" numberOfLines={1}>
                                      {existingDoc.name}
                                    </Text>
                                    <Text className="text-white/60 text-xs">
                                      From your documents
                                    </Text>
                                  </VStack>
                                </>
                              ) : selected.newFile ? (
                                <>
                                  <Box
                                    className="w-10 h-10 rounded-lg items-center justify-center"
                                    style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                                  >
                                    {selected.newFile.type.startsWith('image/') ? (
                                      <ImageIcon size={20} color="white" />
                                    ) : (
                                      <File size={20} color="white" />
                                    )}
                                  </Box>
                                  <VStack className="flex-1 ml-3">
                                    <Text className="text-white text-sm font-inter-medium" numberOfLines={1}>
                                      {selected.newFile.name}
                                    </Text>
                                    <Text className="text-white/60 text-xs">
                                      New upload
                                    </Text>
                                  </VStack>
                                </>
                              ) : null}
                              <Pressable
                                onPress={() => handleRemoveDoc(reqDoc._id)}
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: 16,
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}
                              >
                                <Trash2 size={18} color="#fca5a5" />
                              </Pressable>
                            </Box>
                          ) : (
                            <Pressable
                              onPress={() => {
                                setActiveRequiredDocId(reqDoc._id);
                                setShowDocPicker(true);
                              }}
                              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                            >
                              <Box
                                className="rounded-lg py-3 flex-row items-center justify-center border border-dashed border-white/40"
                              >
                                <Upload size={18} color="rgba(255, 255, 255, 0.7)" />
                                <Text className="text-white/70 font-inter-medium text-sm ml-2">
                                  Attach Document
                                </Text>
                              </Box>
                            </Pressable>
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </VStack>
              </VStack>
            </ScrollView>

            {/* Submit Button */}
            <Box className="px-4 pt-2">
              <Pressable
                onPress={handleSubmit}
                disabled={loading}
                style={({ pressed }) => ({
                  opacity: pressed || loading ? 0.8 : 1,
                })}
              >
                <Box
                  className="rounded-xl py-4 items-center justify-center flex-row"
                  style={{ backgroundColor: 'rgba(255, 255, 255, 0.95)' }}
                >
                  {loading ? (
                    <ActivityIndicator color="#6366f1" />
                  ) : (
                    <>
                      <CheckCircle size={18} color="#6366f1" />
                      <Text className="text-primary-500 font-inter-bold text-base ml-2">
                        Accept Scholarship
                      </Text>
                    </>
                  )}
                </Box>
              </Pressable>
            </Box>
          </Box>
        </Box>

        {/* Document Picker Modal */}
        {showDocPicker && activeRequiredDocId && (
          <Modal
            visible={showDocPicker}
            animationType="slide"
            transparent
            onRequestClose={() => {
              setShowDocPicker(false);
              setActiveRequiredDocId(null);
              resetFolderNavigation();
            }}
          >
            <Box className="flex-1 justify-end bg-black/50">
              <Box
                className={`rounded-t-3xl ${isDark ? 'bg-background-900' : 'bg-background-0'}`}
                style={{ paddingBottom: insets.bottom + 16, maxHeight: '70%' }}
              >
                <HStack className="items-center justify-between px-4 py-4 border-b border-outline-200">
                  <Text className="text-typography-900 font-inter-bold text-lg flex-1 mr-3" numberOfLines={1}>
                    Select {offer.requiredDocuments.find(d => d._id === activeRequiredDocId)?.name || 'Document'}
                  </Text>
                  <Pressable
                    onPress={() => {
                      setShowDocPicker(false);
                      setActiveRequiredDocId(null);
                      resetFolderNavigation();
                    }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X size={20} color={iconColors.primary} />
                  </Pressable>
                </HStack>

                {/* Upload Options */}
                <VStack className="px-4 py-4" space="sm">
                  <Text className="text-typography-500 text-sm font-inter-medium mb-2">
                    Upload New
                  </Text>
                  <HStack space="sm">
                    <Pressable
                      onPress={() => handleUploadImage(activeRequiredDocId)}
                      style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.8 : 1 })}
                    >
                      <Box className="bg-background-100 rounded-xl py-3 px-4 flex-row items-center justify-center">
                        <ImageIcon size={18} color={iconColors.accent} />
                        <Text className="text-typography-700 font-inter-medium text-sm ml-2">
                          Image
                        </Text>
                      </Box>
                    </Pressable>
                    <Pressable
                      onPress={() => handleUploadNewDoc(activeRequiredDocId)}
                      style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.8 : 1 })}
                    >
                      <Box className="bg-background-100 rounded-xl py-3 px-4 flex-row items-center justify-center">
                        <File size={18} color={iconColors.accent} />
                        <Text className="text-typography-700 font-inter-medium text-sm ml-2">
                          Document
                        </Text>
                      </Box>
                    </Pressable>
                  </HStack>
                </VStack>

                {/* Existing Documents */}
                <Box className="px-4">
                  {/* Breadcrumb / Back Navigation */}
                  <HStack className="items-center mb-3">
                    {folderPath.length > 1 && (
                      <Pressable
                        onPress={navigateBack}
                        style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1, marginRight: 8 })}
                      >
                        <Box
                          className="w-8 h-8 rounded-full items-center justify-center"
                          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                        >
                          <ChevronLeft size={18} color={iconColors.primary} />
                        </Box>
                      </Pressable>
                    )}
                    <Text className="text-typography-500 text-sm font-inter-medium flex-1" numberOfLines={1}>
                      {folderPath[folderPath.length - 1].name}
                    </Text>
                  </HStack>

                  {loadingDocs ? (
                    <Box className="py-8 items-center">
                      <ActivityIndicator size="small" color={iconColors.accent} />
                    </Box>
                  ) : folders.length === 0 && existingDocs.length === 0 ? (
                    <Box className="py-8 items-center">
                      <Text className="text-typography-500 text-sm">
                        {currentFolderId ? 'This folder is empty' : 'No documents found. Upload files in the Docs tab first.'}
                      </Text>
                    </Box>
                  ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <VStack space="sm">
                        {/* Folders first */}
                        {folders.map((folder) => (
                          <Pressable
                            key={folder._id}
                            onPress={() => navigateToFolder(folder)}
                            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                          >
                            <Box className="bg-background-100 rounded-xl p-3 flex-row items-center">
                              <Box
                                className="w-11 h-11 rounded-lg items-center justify-center"
                                style={{ backgroundColor: isDark ? 'rgba(245, 158, 11, 0.2)' : 'rgba(245, 158, 11, 0.15)' }}
                              >
                                <FolderIcon size={22} color="#f59e0b" />
                              </Box>
                              <VStack className="flex-1 ml-3">
                                <Text className="text-typography-900 text-sm font-inter-medium" numberOfLines={1}>
                                  {folder.name}
                                </Text>
                                <Text className="text-typography-500 text-xs">
                                  Folder
                                </Text>
                              </VStack>
                              <ChevronRight size={18} color={iconColors.muted} />
                            </Box>
                          </Pressable>
                        ))}

                        {/* Files */}
                        {existingDocs.map((doc) => (
                          <Pressable
                            key={doc._id}
                            onPress={() => handleSelectExistingDoc(activeRequiredDocId!, doc._id)}
                            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                          >
                            <Box className="bg-background-100 rounded-xl p-3 flex-row items-center">
                              {getDocThumbnail(doc) ? (
                                <Image
                                  source={{ uri: getDocThumbnail(doc)! }}
                                  style={{ width: 44, height: 44, borderRadius: 8 }}
                                />
                              ) : (
                                <Box
                                  className="w-11 h-11 rounded-lg items-center justify-center"
                                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                                >
                                  <File size={22} color={iconColors.muted} />
                                </Box>
                              )}
                              <VStack className="flex-1 ml-3">
                                <Text className="text-typography-900 text-sm font-inter-medium" numberOfLines={1}>
                                  {doc.name}
                                </Text>
                                <Text className="text-typography-500 text-xs">
                                  {formatFileSize(doc.size)}
                                </Text>
                              </VStack>
                              <ChevronRight size={18} color={iconColors.muted} />
                            </Box>
                          </Pressable>
                        ))}
                      </VStack>
                    </ScrollView>
                  )}
                </Box>
              </Box>
            </Box>
          </Modal>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default AcceptOfferSheet;

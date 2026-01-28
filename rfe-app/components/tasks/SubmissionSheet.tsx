'use client';
import React, { useState, useCallback } from 'react';
import {
  Modal,
  Pressable,
  useColorScheme,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
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
import { Button, ButtonText } from '@/components/ui/button';
import {
  X,
  Upload,
  Image as ImageIcon,
  File,
  Video,
  Trash2,
  Send,
} from '@/components/navigation/icons';
import { Task, tasksApi } from '@/src/api/tasks.api';
import { useAuth } from '@/src/contexts/AuthContext';

interface SelectedFile {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

interface SubmissionSheetProps {
  visible: boolean;
  onClose: () => void;
  task: Task;
  onSubmitSuccess: (message: string, pointsAwarded: number) => void;
}

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

export function SubmissionSheet({ visible, onClose, task, onSubmitSuccess }: SubmissionSheetProps) {
  const { token } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const [comment, setComment] = useState('');
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [loading, setLoading] = useState(false);

  const pickImage = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets) {
      const newFiles = result.assets.map((asset) => ({
        uri: asset.uri,
        name: asset.fileName || `file_${Date.now()}.${asset.uri.split('.').pop()}`,
        type: asset.mimeType || (asset.type === 'video' ? 'video/mp4' : 'image/jpeg'),
        size: asset.fileSize,
      }));
      setFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  const pickDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
        multiple: true,
      });

      if (!result.canceled && result.assets) {
        const newFiles = result.assets.map((asset) => ({
          uri: asset.uri,
          name: asset.name,
          type: asset.mimeType || 'application/octet-stream',
          size: asset.size,
        }));
        setFiles((prev) => [...prev, ...newFiles]);
      }
    } catch (error) {
      console.error('Document picker error:', error);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!token) {
      Alert.alert('Error', 'Please log in to submit tasks');
      return;
    }

    try {
      setLoading(true);
      const response = await tasksApi.submitTask(task._id, token, {
        comment: comment.trim() || undefined,
        files: files.length > 0 ? files : undefined,
      });

      if (response.success) {
        onSubmitSuccess(response.message, response.data.pointsAwarded);
        setComment('');
        setFiles([]);
        onClose();
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to submit task');
    } finally {
      setLoading(false);
    }
  }, [token, task._id, comment, files, onSubmitSuccess, onClose]);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <ImageIcon size={20} color={iconColors.secondary} />;
    if (type.startsWith('video/')) return <Video size={20} color={iconColors.secondary} />;
    return <File size={20} color={iconColors.secondary} />;
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

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
              <Text className="text-typography-900 font-inter-bold text-xl">
                {task.requiresApproval ? 'Submit for Review' : 'Complete Task'}
              </Text>
              <Text className="text-typography-500 text-sm mt-0.5">
                {task.requiresApproval
                  ? 'Your submission will be reviewed by admin'
                  : `You will earn ${task.scholarshipPoints} SP`}
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

          <ScrollView style={{ maxHeight: 400 }} showsVerticalScrollIndicator={false}>
            <VStack className="px-5 py-4" space="md">
              {/* Comment Input */}
              <VStack space="sm">
                <Text className="text-typography-700 font-inter-medium text-sm">
                  Comment (optional)
                </Text>
                <Box
                  className="rounded-xl p-3 border"
                  style={{
                    minHeight: 100,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                  }}
                >
                  <TextInput
                    placeholder="Add a comment about your submission..."
                    placeholderTextColor={isDark ? '#6b7280' : '#9ca3af'}
                    value={comment}
                    onChangeText={setComment}
                    multiline
                    style={{
                      color: isDark ? '#f5f5f5' : '#171717',
                      fontFamily: 'Inter-Regular',
                      fontSize: 14,
                      minHeight: 80,
                      textAlignVertical: 'top',
                    }}
                  />
                </Box>
              </VStack>

              {/* File Upload Buttons */}
              <VStack space="sm">
                <Text className="text-typography-700 font-inter-medium text-sm">
                  Attachments (optional)
                </Text>
                <HStack space="sm">
                  <Pressable
                    onPress={pickImage}
                    style={({ pressed }) => ({
                      flex: 1,
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Box
                      className="rounded-xl py-3 px-4 flex-row items-center justify-center border"
                      style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                      }}
                    >
                      <ImageIcon size={18} color={iconColors.secondary} />
                      <Text className="text-typography-700 font-inter-medium text-sm ml-2">
                        Photos/Videos
                      </Text>
                    </Box>
                  </Pressable>
                  <Pressable
                    onPress={pickDocument}
                    style={({ pressed }) => ({
                      flex: 1,
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <Box
                      className="rounded-xl py-3 px-4 flex-row items-center justify-center border"
                      style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
                      }}
                    >
                      <File size={18} color={iconColors.secondary} />
                      <Text className="text-typography-700 font-inter-medium text-sm ml-2">
                        Documents
                      </Text>
                    </Box>
                  </Pressable>
                </HStack>
              </VStack>

              {/* Selected Files */}
              {files.length > 0 && (
                <VStack space="sm">
                  <Text className="text-typography-500 text-xs">
                    {files.length} file{files.length > 1 ? 's' : ''} selected
                  </Text>
                  {files.map((file, index) => (
                    <HStack
                      key={index}
                      className="rounded-xl p-3 items-center border"
                      style={{
                        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
                      }}
                    >
                      {file.type.startsWith('image/') ? (
                        <Image
                          source={{ uri: file.uri }}
                          style={{ width: 40, height: 40, borderRadius: 8 }}
                        />
                      ) : (
                        <Box
                          className="w-10 h-10 rounded-lg items-center justify-center"
                          style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }}
                        >
                          {getFileIcon(file.type)}
                        </Box>
                      )}
                      <VStack className="flex-1 ml-3">
                        <Text
                          className="text-typography-900 text-sm font-inter-medium"
                          numberOfLines={1}
                        >
                          {file.name}
                        </Text>
                        {file.size && (
                          <Text className="text-typography-500 text-xs">
                            {formatFileSize(file.size)}
                          </Text>
                        )}
                      </VStack>
                      <Pressable
                        onPress={() => removeFile(index)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Trash2 size={18} color="#ef4444" />
                      </Pressable>
                    </HStack>
                  ))}
                </VStack>
              )}
            </VStack>
          </ScrollView>

          {/* Submit Button */}
          <Box className="px-5 pt-4">
            <Pressable
              onPress={handleSubmit}
              disabled={loading}
              style={({ pressed }) => ({
                opacity: loading ? 0.5 : pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              })}
            >
              <Box
                className={`rounded-xl py-4 items-center justify-center flex-row ${task.requiresApproval ? 'bg-primary-500' : 'bg-success-500'}`}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <>
                    <Send size={18} color="white" />
                    <Text className="text-white font-inter-semibold text-base ml-2">
                      {task.requiresApproval ? 'Submit for Review' : 'Mark Completed'}
                    </Text>
                    {task.scholarshipPoints > 0 && (
                      <Text className="text-white/80 font-inter-semibold text-sm ml-2">
                        +{task.scholarshipPoints} SP
                      </Text>
                    )}
                  </>
                )}
              </Box>
            </Pressable>
          </Box>
        </Box>
      </Box>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default SubmissionSheet;

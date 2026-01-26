'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  Platform,
  useColorScheme,
  Keyboard,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  KeyboardStickyView,
  useReanimatedKeyboardAnimation,
} from 'react-native-keyboard-controller';
import Animated, {
  useAnimatedStyle,
  interpolate,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { useAuth } from '@/src/contexts/AuthContext';
import { hugoChatApi, ChatMessage, Suggestion } from '@/src/api/hugoChat.api';
import { studentApi } from '@/src/api/student.api';
import config from '@/src/config';
import { ChevronLeft, Bot } from 'lucide-react-native';
import { Ionicons } from '@expo/vector-icons';

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

function ChatAvatar({ 
  profilePicture, 
  name, 
  size = 24,
  iconSource
}: { 
  profilePicture: string | null; 
  name: string; 
  size?: number;
  iconSource?: any;
}) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const getProfilePictureUrl = () => {
    if (!profilePicture) return null;
    if (profilePicture.startsWith('http')) return profilePicture;
    const baseUrl = config.apiUrl.replace('/api', '');
    return `${baseUrl}${profilePicture}`;
  };

  const imageUrl = getProfilePictureUrl();

  // If iconSource is provided (e.g., for Hugo), use it
  if (iconSource) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          source={iconSource}
          style={{
            width: size,
            height: size,
          }}
          resizeMode="contain"
        />
      </View>
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: imageUrl ? 'transparent' : '#6366f1',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          resizeMode="cover"
        />
      ) : (
        <Text
          className="font-inter-bold text-white"
          style={{ fontSize: size * 0.4 }}
        >
          {initials || 'U'}
        </Text>
      )}
    </View>
  );
}

function MessageBubble({ 
  message, 
  isDark, 
  userProfilePicture, 
  userName 
}: { 
  message: ChatMessage; 
  isDark: boolean;
  userProfilePicture: string | null;
  userName: string;
}) {
  const isUser = message.role === 'user';

  return (
    <View
      style={{
        flexDirection: 'row',
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '85%',
        marginVertical: 6,
        alignItems: 'flex-start',
        gap: 8,
      }}
    >
      {!isUser && (
        <ChatAvatar
          profilePicture={null}
          name="Hugo"
          size={24}
          iconSource={require('@/assets/images/icons/app-icon-transparent-bg.png')}
        />
      )}
      <View style={{ flex: 1 }}>
        {!isUser && (
          <HStack className="items-center mb-1.5" space="xs">
            <Text className="text-xs font-inter-semibold text-primary-500">Hugo</Text>
          </HStack>
        )}
        <View
          style={{
            backgroundColor: isUser
              ? '#4f46e5'
              : isDark
              ? 'rgba(255, 255, 255, 0.08)'
              : '#f3f4f6',
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 16,
            borderTopRightRadius: isUser ? 4 : 16,
            borderTopLeftRadius: isUser ? 16 : 4,
          }}
        >
          <Text
            className={isUser ? 'text-white' : 'text-typography-900'}
            style={{ fontSize: 15, lineHeight: 22 }}
          >
            {message.content}
          </Text>
        </View>
      </View>
      {isUser && (
        <ChatAvatar
          profilePicture={userProfilePicture}
          name={userName}
          size={24}
        />
      )}
    </View>
  );
}

function TypingDot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 300 }),
          withTiming(0, { duration: 300 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: '#4f46e5',
          marginHorizontal: 2,
        },
        animatedStyle,
      ]}
    />
  );
}

function TypingIndicator({ isDark }: { isDark: boolean }) {
  return (
    <View style={{ alignSelf: 'flex-start', marginVertical: 6 }}>
      <HStack className="items-center" space="xs">
        <Image
          source={require('@/assets/images/icons/app-icon-transparent-bg.png')}
          style={{ width: 20, height: 20 }}
          resizeMode="contain"
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f3f4f6',
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 16,
            borderTopLeftRadius: 4,
          }}
        >
          <TypingDot delay={0} />
          <TypingDot delay={150} />
          <TypingDot delay={300} />
        </View>
      </HStack>
    </View>
  );
}

function SuggestionCard({ suggestion, onPress }: { suggestion: Suggestion; onPress: () => void; isDark: boolean }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <Box
        className="bg-background-0 rounded-lg border border-outline-100"
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.06,
          shadowRadius: 2,
          elevation: 2,
        }}
      >
        <Text className="text-typography-800 text-sm font-inter-medium">
          {suggestion.text}
        </Text>
      </Box>
    </Pressable>
  );
}

export default function HugoChatScreen() {
  const { token, user } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;
  const scrollViewRef = useRef<ScrollView>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const topPadding = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 24);

  // Animate padding based on keyboard state
  const { progress } = useReanimatedKeyboardAnimation();

  const inputWrapperStyle = useAnimatedStyle(() => {
    return {
      paddingBottom: interpolate(progress.value, [0, 1], [insets.bottom + 8, 8]),
    };
  });

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!token) return;
      try {
        const response = await hugoChatApi.getSuggestions(token);
        if (response.success && response.data) {
          setSuggestions(response.data.suggestions);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setSuggestionsLoading(false);
      }
    };
    fetchSuggestions();
  }, [token]);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (!token) return;
      try {
        const response = await studentApi.getProfile(token);
        if (response.success) {
          setProfilePicture(response.data.profilePicture || null);
        }
      } catch (error) {
        // Silently fail - avatar will show initials
      }
    };
    fetchProfilePicture();
  }, [token]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!token || !text.trim() || isLoading) return;

      const userMessage: ChatMessage = { role: 'user', content: text.trim() };
      setMessages((prev) => [...prev, userMessage]);
      setInputText('');
      setIsLoading(true);
      Keyboard.dismiss();

      try {
        const response = await hugoChatApi.sendMessage(token, text.trim(), messages);
        if (response.success && response.data) {
          const assistantMessage: ChatMessage = {
            role: 'assistant',
            content: response.data.reply,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        } else {
          const errorMessage: ChatMessage = {
            role: 'assistant',
            content: response.message || 'Sorry, I had trouble responding. Please try again.',
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      } catch (error: any) {
        const errorMessage: ChatMessage = {
          role: 'assistant',
          content: error.message || 'Sorry, something went wrong. Please try again.',
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [token, messages, isLoading]
  );

  const handleSuggestionPress = (suggestion: Suggestion) => {
    sendMessage(suggestion.text);
  };

  const handleSend = () => {
    sendMessage(inputText);
  };

  return (
    <View style={{ flex: 1, backgroundColor: isDark ? '#09090b' : '#ffffff' }}>
      {/* Header */}
      <View
        style={{
          paddingTop: topPadding,
          backgroundColor: isDark ? '#09090b' : '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              opacity: pressed ? 0.6 : 1,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            })}
          >
            <ChevronLeft size={24} strokeWidth={2.5} color={iconColors.primary} />
          </Pressable>

          <Image
            source={require('@/assets/images/icons/app-icon-transparent-bg.png')}
            style={{ width: 36, height: 36, marginLeft: 4 }}
            resizeMode="contain"
          />

          <View style={{ marginLeft: 10 }}>
            <Text className="text-lg font-inter-bold text-typography-900">Hugo AI</Text>
            <Text className="text-xs font-inter-medium text-typography-500">Your learning assistant</Text>
          </View>
        </View>
      </View>

      {/* Chat Area */}
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 16,
          flexGrow: 1,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
      >
          {/* Welcome Screen */}
          {messages.length === 0 && (
            <View style={{ paddingVertical: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
                <View
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    backgroundColor: '#4f46e5',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}
                >
                  <Bot size={28} color="#ffffff" strokeWidth={2} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text className="text-xl font-inter-bold text-typography-900 mb-1">
                    Hi, I'm Hugo!
                  </Text>
                  <Text className="text-sm font-inter-regular text-typography-500">
                    Your friendly learning assistant. Ask me about any school subject!
                  </Text>
                </View>
              </View>

              {/* Suggestions */}
              {suggestionsLoading ? (
                <View style={{ paddingVertical: 20 }}>
                  <ActivityIndicator size="small" color="#4f46e5" />
                </View>
              ) : (
                <View>
                  <Text className="text-xs font-inter-semibold text-typography-400 uppercase tracking-wider mb-3">
                    Try asking
                  </Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                    {suggestions.map((suggestion, index) => (
                      <SuggestionCard
                        key={index}
                        suggestion={suggestion}
                        onPress={() => handleSuggestionPress(suggestion)}
                        isDark={isDark}
                      />
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Messages */}
          {messages.map((message, index) => (
            <MessageBubble 
              key={index} 
              message={message} 
              isDark={isDark}
              userProfilePicture={profilePicture}
              userName={user?.name || 'User'}
            />
          ))}

          {/* Typing Indicator */}
          {isLoading && <TypingIndicator isDark={isDark} />}
      </ScrollView>

      {/* Input Area - Sticks to keyboard */}
      <KeyboardStickyView>
        <Animated.View
          style={[
            {
              backgroundColor: isDark ? '#09090b' : '#ffffff',
              borderTopWidth: 1,
              borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              paddingHorizontal: 16,
              paddingTop: 8,
            },
            inputWrapperStyle,
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : '#f3f4f6',
                borderRadius: 24,
                paddingHorizontal: 18,
                paddingVertical: 12,
                marginRight: 12,
                minHeight: 48,
                maxHeight: 120,
                justifyContent: 'center',
              }}
            >
              <TextInput
                value={inputText}
                onChangeText={setInputText}
                placeholder="Ask Hugo anything..."
                placeholderTextColor={iconColors.muted}
                multiline
                style={{
                  fontSize: 15,
                  color: isDark ? '#f5f5f5' : '#262627',
                  fontFamily: 'Inter-Regular',
                  maxHeight: 96,
                  paddingVertical: 0,
                }}
                editable={!isLoading}
              />
            </View>

            <Pressable
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
              style={({ pressed }) => ({
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: isDark ? '#18181b' : '#f3f4f6',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Ionicons name="send" size={20} color="#4f46e5" />
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardStickyView>
    </View>
  );
}

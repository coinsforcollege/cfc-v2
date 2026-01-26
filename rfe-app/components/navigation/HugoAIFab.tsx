import React from 'react';
import { Pressable, View, Text, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Bot } from 'lucide-react-native';

export function HugoAIFab() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Pressable
      onPress={() => router.push('/(app)/hugo-chat')}
      style={{
        position: 'absolute',
        bottom: 100,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4f46e5',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 28,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 8,
        }}
      >
        <Bot size={18} color="#ffffff" strokeWidth={2} />
      </View>
      <Text style={{ color: '#ffffff', fontSize: 14, fontWeight: 'bold' }}>
        Hugo AI
      </Text>
    </Pressable>
  );
}

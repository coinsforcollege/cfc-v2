'use client';
import React, { useState, useEffect } from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { router } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/src/contexts/AuthContext';
import { scholarshipApi, ScholarshipTransaction } from '@/src/api/scholarship.api';
import {
  ChevronRight,
  Zap,
  Award,
  TrendingUp,
  ListTodo,
  Gift,
} from 'lucide-react-native';

// Map transaction sources to icons and colors
function getTransactionStyle(transaction: ScholarshipTransaction) {
  const type = transaction.type;
  const source = transaction.source?.toLowerCase() || '';
  const category = transaction.metadata?.category?.toLowerCase() || '';

  if (type === 'earned') {
    if (source.includes('task') || category) {
      return {
        icon: ListTodo,
        bgColor: '#dcfce7',
        iconColor: '#16a34a',
        amountColor: '#16a34a',
      };
    }
    if (source.includes('referral') || source.includes('bonus')) {
      return {
        icon: Gift,
        bgColor: '#fef3c7',
        iconColor: '#d97706',
        amountColor: '#d97706',
      };
    }
    return {
      icon: Zap,
      bgColor: '#dcfce7',
      iconColor: '#16a34a',
      amountColor: '#16a34a',
    };
  }

  if (type === 'spent') {
    return {
      icon: Award,
      bgColor: '#fee2e2',
      iconColor: '#dc2626',
      amountColor: '#dc2626',
    };
  }

  // adjustment
  return {
    icon: TrendingUp,
    bgColor: '#dbeafe',
    iconColor: '#2563eb',
    amountColor: '#2563eb',
  };
}

// Format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function SkeletonTransactionCard() {
  return (
    <Box className="bg-background-0 rounded-xl p-3 mb-2 border border-outline-100">
      <HStack className="items-center">
        <Skeleton width={40} height={40} borderRadius={12} />
        <VStack className="flex-1 ml-3">
          <Skeleton width={140} height={14} borderRadius={4} style={{ marginBottom: 4 }} />
          <Skeleton width={60} height={10} borderRadius={4} />
        </VStack>
        <Skeleton width={50} height={16} borderRadius={4} />
      </HStack>
    </Box>
  );
}

interface TransactionCardProps {
  transaction: ScholarshipTransaction;
  isDark: boolean;
}

function TransactionCard({ transaction, isDark }: TransactionCardProps) {
  const style = getTransactionStyle(transaction);
  const IconComponent = style.icon;
  const isEarned = transaction.type === 'earned';

  const handlePress = () => {
    router.push('/(app)/scholarship-points');
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => ({ opacity: pressed ? 0.9 : 1 })}
    >
      <Box className="bg-background-0 rounded-xl p-3 mb-2 border border-outline-100">
        <HStack className="items-center">
          {/* Icon */}
          <Box
            className="w-10 h-10 rounded-xl items-center justify-center"
            style={{ backgroundColor: style.bgColor }}
          >
            <IconComponent size={20} color={style.iconColor} />
          </Box>

          {/* Content */}
          <VStack className="flex-1 ml-3 mr-2">
            <Text
              className="text-typography-900 font-inter-medium text-sm"
              numberOfLines={1}
            >
              {transaction.description}
            </Text>
            <HStack className="items-center mt-0.5">
              <Text className="text-typography-400 text-2xs font-inter-regular">
                {formatRelativeTime(transaction.createdAt)}
              </Text>
              {transaction.metadata?.category && (
                <>
                  <Text className="text-typography-300 text-2xs mx-1">-</Text>
                  <Text className="text-primary-500 text-2xs font-inter-medium">
                    {transaction.metadata.category}
                  </Text>
                </>
              )}
            </HStack>
          </VStack>

          {/* Amount */}
          <Box
            className="px-2 py-1 rounded-lg"
            style={{ backgroundColor: isEarned ? '#dcfce7' : '#fee2e2' }}
          >
            <Text
              className="text-xs font-inter-bold"
              style={{ color: style.amountColor }}
            >
              {isEarned ? '+' : '-'}{transaction.amount} SP
            </Text>
          </Box>
        </HStack>
      </Box>
    </Pressable>
  );
}

function EmptyTransactions() {
  return (
    <Box className="bg-background-50 rounded-2xl p-6 items-center">
      <Box className="w-12 h-12 rounded-full bg-primary-100 items-center justify-center mb-3">
        <Zap size={24} color="#6366f1" />
      </Box>
      <Text className="text-typography-900 font-inter-bold text-base mb-1">
        No Activity Yet
      </Text>
      <Text className="text-typography-500 text-sm font-inter-regular text-center">
        Complete tasks to earn scholarship points
      </Text>
      <Pressable
        onPress={() => router.push('/(app)/tasks')}
        style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1, marginTop: 12 })}
      >
        <Box className="bg-primary-500 px-4 py-2 rounded-full">
          <Text className="text-white text-sm font-inter-bold">
            Browse Tasks
          </Text>
        </Box>
      </Pressable>
    </Box>
  );
}

export function ActivityHistorySection() {
  const { token } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [transactions, setTransactions] = useState<ScholarshipTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  const fetchTransactions = async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await scholarshipApi.getTransactions(token, { limit: 5 });
      if (response.success && response.data) {
        setTransactions(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="mb-6 px-4">
      {/* Section Header */}
      <HStack className="mb-3 items-center justify-between">
        <Text className="text-typography-900 font-inter-regular text-lg tracking-tight">
          Activity History
        </Text>
        <Pressable
          onPress={() => router.push('/(app)/scholarship-points')}
          hitSlop={10}
          style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
        >
          <HStack className="items-center">
            <Text className="text-sm font-inter-bold uppercase tracking-wider text-primary-600">
              View All
            </Text>
            <ChevronRight size={16} color="#4f46e5" />
          </HStack>
        </Pressable>
      </HStack>

      {/* Transactions */}
      {loading ? (
        <>
          <SkeletonTransactionCard />
          <SkeletonTransactionCard />
          <SkeletonTransactionCard />
          <SkeletonTransactionCard />
          <SkeletonTransactionCard />
        </>
      ) : transactions.length === 0 ? (
        <EmptyTransactions />
      ) : (
        transactions.map((transaction) => (
          <TransactionCard
            key={transaction._id}
            transaction={transaction}
            isDark={isDark}
          />
        ))
      )}
    </Box>
  );
}

export default ActivityHistorySection;

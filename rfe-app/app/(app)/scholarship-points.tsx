import React, { useState, useCallback, useEffect } from 'react';
import {
  ScrollView,
  Pressable,
  Platform,
  useColorScheme,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  FlatList,
  View,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { Skeleton } from '@/components/ui/Skeleton';
import { useAuth } from '@/src/contexts/AuthContext';
import { UserAvatar } from '@/components/navigation/UserAvatar';
import { studentApi } from '@/src/api/student.api';
import {
  scholarshipApi,
  ScholarshipAnalytics,
  ScholarshipTransaction,
  TIER_CONFIGS,
  TierId,
  getTierById,
} from '@/src/api/scholarship.api';
import { offersApi } from '@/src/api/offers.api';
import { storage } from '@/src/utils/storage';
import {
  ChevronLeft,
  TrendingUp,
  Award,
  Zap,
  CheckCircle,
  Clock,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { HugoAIFab } from '@/components/navigation';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 32;

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

// Format currency helper
function formatCurrency(value: number, currency: string = 'USD'): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
}

// Tier Selector Component
function TierSelector({
  selectedTier,
  onSelectTier,
}: {
  selectedTier: TierId;
  onSelectTier: (tier: TierId) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
    >
      {TIER_CONFIGS.map((tier) => {
        const isSelected = selectedTier === tier.id;
        return (
          <Pressable
            key={tier.id}
            onPress={() => onSelectTier(tier.id)}
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Box
              className={`py-1.5 px-3 rounded-full flex-row items-center ${
                isSelected ? '' : 'bg-background-100 border border-outline-200'
              }`}
              style={isSelected ? { backgroundColor: tier.color } : undefined}
            >
              <Text
                className={`text-xs font-inter-semibold ${
                  isSelected ? 'text-white' : 'text-typography-700'
                }`}
              >
                {tier.name}
              </Text>
              <Text
                className={`text-xs font-inter-medium ml-1 ${
                  isSelected ? 'text-white/80' : 'text-typography-400'
                }`}
              >
                {tier.weeklyRate}/wk
              </Text>
            </Box>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// Points Chart Component
function PointsChart({
  analytics,
  selectedTier,
  isDark,
}: {
  analytics: ScholarshipAnalytics;
  selectedTier: TierId;
  isDark: boolean;
}) {
  const tier = getTierById(selectedTier);
  const chartData = analytics.chartData;

  if (chartData.length < 2) {
    return (
      <Box className="bg-background-50 rounded-2xl p-4 mx-4 items-center justify-center h-[200px]">
        <TrendingUp size={32} color="#9ca3af" />
        <Text className="text-typography-500 text-sm font-inter-medium mt-2 text-center">
          Complete more tasks to see your progress chart
        </Text>
      </Box>
    );
  }

  // Calculate expected trajectory based on tier
  const startDate = new Date(analytics.accountCreatedAt);
  const expectedData = chartData.map((point) => {
    const currentDate = new Date(point.date);
    const weeksElapsed = Math.max(
      0,
      (currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 7)
    );
    return Math.round(weeksElapsed * tier.weeklyRate);
  });

  const actualData = chartData.map((point) => point.balance);

  // Format labels (show every nth label to avoid crowding)
  const labelInterval = Math.ceil(chartData.length / 5);
  const labels = chartData.map((point, index) => {
    if (index % labelInterval === 0 || index === chartData.length - 1) {
      const date = new Date(point.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
    return '';
  });

  return (
    <Box className="mx-4">
      <LineChart
        data={{
          labels,
          datasets: [
            {
              data: expectedData,
              color: () => tier.color,
              strokeWidth: 2,
              withDots: false,
            },
            {
              data: actualData,
              color: () => '#fbbf24',
              strokeWidth: 3,
            },
          ],
          legend: [`Expected (${tier.name})`, 'Your Progress'],
        }}
        width={CHART_WIDTH}
        height={200}
        chartConfig={{
          backgroundColor: isDark ? '#18181b' : '#ffffff',
          backgroundGradientFrom: isDark ? '#18181b' : '#ffffff',
          backgroundGradientTo: isDark ? '#27272a' : '#f8fafc',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(99, 102, 241, ${opacity})`,
          labelColor: () => isDark ? '#a1a1aa' : '#6b7280',
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#fbbf24',
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: isDark ? '#3f3f46' : '#e5e7eb',
            strokeWidth: 1,
          },
        }}
        bezier
        style={{
          borderRadius: 16,
        }}
        withInnerLines
        withOuterLines={false}
        withVerticalLines={false}
        fromZero
        yAxisSuffix=" SP"
        segments={4}
      />
    </Box>
  );
}

// Category Breakdown Component
function CategoryBreakdown({
  categories,
  totalEarned,
}: {
  categories: ScholarshipAnalytics['categoryBreakdown'];
  totalEarned: number;
}) {
  if (categories.length === 0) {
    return (
      <Box className="bg-background-0 rounded-2xl p-4 mx-4 border border-outline-100">
        <Text className="text-typography-500 text-sm font-inter-medium text-center">
          No category data yet
        </Text>
      </Box>
    );
  }

  return (
    <Box className="bg-background-0 rounded-2xl p-4 mx-4 border border-outline-100">
      <VStack space="md">
        {categories.map((cat, index) => {
          const percentage = totalEarned > 0 ? (cat.totalPoints / totalEarned) * 100 : 0;
          const colors = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6'];
          const color = colors[index % colors.length];

          return (
            <VStack key={cat.category} space="xs">
              <HStack className="justify-between items-center">
                <Text className="text-typography-900 text-sm font-inter-medium">
                  {cat.category}
                </Text>
                <Text className="text-typography-500 text-xs font-inter-medium">
                  {cat.totalPoints} SP ({percentage.toFixed(0)}%)
                </Text>
              </HStack>
              <Box className="h-2 bg-background-100 rounded-full overflow-hidden">
                <Box
                  className="h-full rounded-full"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                  }}
                />
              </Box>
            </VStack>
          );
        })}
      </VStack>
    </Box>
  );
}

// Transaction Card Component
function TransactionCard({ transaction }: { transaction: ScholarshipTransaction }) {
  const isEarned = transaction.type === 'earned';
  const IconComponent = isEarned ? Zap : Award;
  const bgColor = isEarned ? '#dcfce7' : '#fef3c7';
  const iconColor = isEarned ? '#16a34a' : '#d97706';
  const amountColor = isEarned ? '#16a34a' : '#dc2626';

  const date = new Date(transaction.createdAt);
  const formattedDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;

  return (
    <Box className="bg-background-0 p-4 border-b border-outline-50">
      <HStack className="items-center" space="md">
        <Box
          className="w-10 h-10 rounded-xl items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <IconComponent size={20} color={iconColor} />
        </Box>
        <VStack className="flex-1">
          <Text className="text-typography-900 text-sm font-inter-medium" numberOfLines={1}>
            {transaction.description}
          </Text>
          <HStack className="items-center" space="xs">
            <Clock size={12} color="#9ca3af" />
            <Text className="text-typography-400 text-xs font-inter-regular">
              {formattedDate}
            </Text>
          </HStack>
          {transaction.metadata?.category && (
            <Text className="text-primary-500 text-xs font-inter-medium mt-0.5">
              {transaction.metadata.category}
            </Text>
          )}
        </VStack>
        <VStack className="items-end">
          <Text className="font-inter-bold text-sm" style={{ color: amountColor }}>
            {isEarned ? '+' : '-'}{transaction.amount} SP
          </Text>
          <Text className="text-typography-400 text-xs font-inter-regular">
            Bal: {transaction.balanceAfter}
          </Text>
        </VStack>
      </HStack>
    </Box>
  );
}

// Section Header Component
function SectionHeader({ title, rightElement }: { title: string; rightElement?: React.ReactNode }) {
  return (
    <HStack className="px-4 py-3 items-center justify-between">
      <Text className="text-xs font-inter-bold uppercase tracking-widest text-typography-400">
        {title}
      </Text>
      {rightElement}
    </HStack>
  );
}

export default function ScholarshipPointsScreen() {
  const { user, token } = useAuth();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const iconColors = isDark ? ICON_COLORS.dark : ICON_COLORS.light;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [analytics, setAnalytics] = useState<ScholarshipAnalytics | null>(null);
  const [transactions, setTransactions] = useState<ScholarshipTransaction[]>([]);
  const [transactionPage, setTransactionPage] = useState(1);
  const [hasMoreTransactions, setHasMoreTransactions] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedTier, setSelectedTier] = useState<TierId>('ivy');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // Scholarship offers data
  const [potentialScholarship, setPotentialScholarship] = useState(0);
  const [scholarshipCurrency, setScholarshipCurrency] = useState('USD');
  const [offersCount, setOffersCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);

  const topPadding = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, 24);

  // Load saved tier preference
  useEffect(() => {
    const loadTier = async () => {
      const savedTier = await storage.getScholarshipTier();
      if (savedTier && ['ivy', 'tier1', 'tier2', 'regional'].includes(savedTier)) {
        setSelectedTier(savedTier as TierId);
      }
    };
    loadTier();
  }, []);

  // Save tier preference when changed
  const handleTierChange = useCallback((tier: TierId) => {
    setSelectedTier(tier);
    storage.setScholarshipTier(tier);
  }, []);

  // Fetch profile picture
  const fetchProfilePicture = useCallback(async () => {
    if (!token) return;
    try {
      const response = await studentApi.getProfile(token);
      if (response.success) {
        setProfilePicture(response.data.profilePicture || null);
      }
    } catch (error) {
      console.error('Error fetching profile picture:', error);
    }
  }, [token]);

  // Fetch analytics
  const fetchAnalytics = useCallback(async () => {
    if (!token) return;
    try {
      const response = await scholarshipApi.getAnalytics(token);
      if (response.success) {
        setAnalytics(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  }, [token]);

  // Fetch highest scholarship offer across both accepted and active
  const fetchOffersTotal = useCallback(async () => {
    if (!token) return;
    try {
      // Fetch both accepted and active offers
      const [acceptedResponse, activeResponse] = await Promise.all([
        offersApi.getOffers(token, { status: 'accepted', limit: 100 }),
        offersApi.getOffers(token, { status: 'active', limit: 100 }),
      ]);

      // Combine all offers
      const allOffers = [
        ...(acceptedResponse.success ? acceptedResponse.data : []),
        ...(activeResponse.success ? activeResponse.data : []),
      ];

      if (allOffers.length > 0) {
        const highest = Math.max(...allOffers.map(offer => offer.totalValue));
        const highestOffer = allOffers.find(o => o.totalValue === highest);
        setPotentialScholarship(highest);
        setScholarshipCurrency(highestOffer?.currency || 'USD');
        setOffersCount(allOffers.length);
      } else {
        setPotentialScholarship(0);
        setOffersCount(0);
      }
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    }
  }, [token]);

  // Fetch transactions
  const fetchTransactions = useCallback(
    async (page: number = 1, append: boolean = false) => {
      if (!token) return;
      try {
        const response = await scholarshipApi.getTransactions(token, {
          page,
          limit: 20,
        });
        if (response.success) {
          if (append) {
            setTransactions((prev) => [...prev, ...response.data]);
          } else {
            setTransactions(response.data);
          }
          setHasMoreTransactions(page < response.pagination.pages);
          setTransactionPage(page);
        }
      } catch (error) {
        console.error('Failed to fetch transactions:', error);
      }
    },
    [token]
  );

  // Initial load
  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        await Promise.all([
          fetchAnalytics(),
          fetchTransactions(1),
          fetchProfilePicture(),
          fetchOffersTotal(),
        ]);
        setLoading(false);
      };
      loadData();
    }, [fetchAnalytics, fetchTransactions, fetchProfilePicture, fetchOffersTotal])
  );

  // Refresh handler
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      fetchAnalytics(),
      fetchTransactions(1),
      fetchOffersTotal(),
    ]);
    setRefreshing(false);
  }, [fetchAnalytics, fetchTransactions, fetchOffersTotal]);

  // Load more transactions
  const handleLoadMore = useCallback(async () => {
    if (loadingMore || !hasMoreTransactions) return;
    setLoadingMore(true);
    await fetchTransactions(transactionPage + 1, true);
    setLoadingMore(false);
  }, [loadingMore, hasMoreTransactions, transactionPage, fetchTransactions]);

  // Render transaction item
  const renderTransaction = useCallback(
    ({ item }: { item: ScholarshipTransaction }) => <TransactionCard transaction={item} />,
    []
  );

  // Key extractor
  const keyExtractor = useCallback((item: ScholarshipTransaction) => item._id, []);

  // List footer
  const ListFooter = useCallback(() => {
    if (loadingMore) {
      return (
        <Box className="py-4 items-center">
          <ActivityIndicator size="small" color="#6366f1" />
        </Box>
      );
    }
    if (!hasMoreTransactions && transactions.length > 0) {
      return (
        <Box className="py-4 items-center">
          <Text className="text-typography-400 text-xs font-inter-medium">
            No more transactions
          </Text>
        </Box>
      );
    }
    return null;
  }, [loadingMore, hasMoreTransactions, transactions.length]);

  return (
    <Box className="flex-1 bg-background-50">
      {/* Header with gradient */}
      <View style={{ overflow: 'hidden' }}>
        <LinearGradient
          colors={['#1e1b4b', '#312e81', '#3730a3']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{ paddingTop: topPadding }}
        >
          <Image
            source={require('@/assets/images/elegant-blue-wavy-pattern-background.png')}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 300, opacity: 0.02 }}
            resizeMode="cover"
          />

          {/* Top Row: Back + Title on left, Avatar on right */}
          <HStack className="px-4 py-3 items-center justify-between">
            <HStack className="items-center" space="sm">
              <Pressable
                onPress={() => router.back()}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Box className="w-10 h-10 items-center justify-center">
                  <ChevronLeft size={24} strokeWidth={2.5} color="white" />
                </Box>
              </Pressable>
              <Text className="text-white text-lg font-inter-bold">
                Scholarship Points
              </Text>
            </HStack>
            <Pressable
              onPress={() => router.push('/(app)/profile')}
              style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
            >
              <UserAvatar name={user?.name || 'User'} profilePicture={profilePicture} size={40} />
            </Pressable>
          </HStack>

          {/* Balance Row */}
          <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 }}>
            <HStack className="justify-between items-start">
              {/* Left: Lifetime Points */}
              <VStack>
                <Text className="text-indigo-300 text-xs font-inter-medium uppercase tracking-widest mb-1">
                  Lifetime Points
                </Text>
                {loading ? (
                  <Skeleton width={100} height={40} borderRadius={8} />
                ) : (
                  <HStack className="items-baseline">
                    <Text className="text-white text-4xl font-inter-bold">
                      {analytics?.totalEarned.toLocaleString() || 0}
                    </Text>
                    <Text className="text-indigo-300 text-base font-inter-medium ml-1.5">
                      SP
                    </Text>
                  </HStack>
                )}
              </VStack>

              {/* Right: Potential Scholarships */}
              <VStack className="items-end">
                <HStack className="items-center mb-1">
                  <Text className="text-indigo-300 text-xs font-inter-medium uppercase tracking-widest">
                    Potential Value
                  </Text>
                  {offersCount > 0 && (
                    <Pressable
                      onPress={() => setShowTooltip(!showTooltip)}
                      style={{ marginLeft: 4 }}
                    >
                      <Info size={14} color="rgba(199, 210, 254, 0.8)" />
                    </Pressable>
                  )}
                </HStack>
                {loading ? (
                  <Skeleton width={80} height={32} borderRadius={8} />
                ) : (
                  <Pressable
                    onPress={() => router.push('/(app)/offers')}
                    style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                  >
                    <HStack className="items-center">
                      <Text className="text-amber-400 text-2xl font-inter-bold">
                        {potentialScholarship > 0
                          ? formatCurrency(potentialScholarship, scholarshipCurrency)
                          : '$0'}
                      </Text>
                      <ChevronRight size={20} color="#fbbf24" style={{ marginLeft: 2 }} />
                    </HStack>
                  </Pressable>
                )}
                {offersCount > 0 && (
                  <Text className="text-indigo-300 text-xs font-inter-medium mt-0.5">
                    {offersCount} offer{offersCount > 1 ? 's' : ''} available
                  </Text>
                )}
              </VStack>
            </HStack>

            {/* Tooltip */}
            {showTooltip && offersCount > 0 && (
              <Box className="mt-3 bg-white/10 rounded-xl p-3">
                <Text className="text-white/90 text-xs font-inter-regular">
                  This shows the highest scholarship offer you've received or accepted.
                  Tap to view and respond to your offers.
                </Text>
              </Box>
            )}
          </View>
        </LinearGradient>
      </View>

      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={keyExtractor}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={ListFooter}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 40),
        }}
        ListHeaderComponent={
          <>
            {/* Tier Selector */}
            <SectionHeader title="Target Tier" />
            {loading ? (
              <Box className="px-4">
                <Skeleton width={SCREEN_WIDTH - 32} height={50} borderRadius={12} />
              </Box>
            ) : (
              <TierSelector selectedTier={selectedTier} onSelectTier={handleTierChange} />
            )}

            {/* Progress Chart */}
            <SectionHeader title="Progress Trajectory" />
            {loading ? (
              <Box className="px-4">
                <Skeleton width={CHART_WIDTH} height={200} borderRadius={16} />
              </Box>
            ) : analytics ? (
              <PointsChart analytics={analytics} selectedTier={selectedTier} isDark={isDark} />
            ) : null}

            {/* Category Breakdown */}
            <SectionHeader title="Category Breakdown" />
            {loading ? (
              <Box className="px-4">
                <Skeleton width={CHART_WIDTH} height={120} borderRadius={16} />
              </Box>
            ) : analytics ? (
              <CategoryBreakdown
                categories={analytics.categoryBreakdown}
                totalEarned={analytics.totalEarned}
              />
            ) : null}

            {/* Transaction History Header */}
            <SectionHeader
              title="Transaction History"
              rightElement={
                <Text className="text-typography-400 text-xs font-inter-medium">
                  {transactions.length} transactions
                </Text>
              }
            />
          </>
        }
        ListEmptyComponent={
          !loading ? (
            <Box className="py-8 items-center">
              <CheckCircle size={48} color="#d1d5db" />
              <Text className="text-typography-400 text-sm font-inter-medium mt-3">
                No transactions yet
              </Text>
              <Text className="text-typography-400 text-xs font-inter-regular mt-1">
                Complete tasks to earn scholarship points
              </Text>
            </Box>
          ) : null
        }
      />

      {/* Hugo AI FAB */}
      <HugoAIFab />
    </Box>
  );
}

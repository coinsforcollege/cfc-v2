import React, { useEffect, useState, useRef } from 'react';
import { View, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 48;

// Dummy data: Grade 4 through Grade 12
const grades = ['4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];

// Full journey data showing progression
const fullJourneyData = [0, 800, 1900, 2800, 4200, 5100, 6200, 8100, 9500];

const ANIMATION_INTERVAL = 400; // Time between revealing each point
const PAUSE_DURATION = 2000; // Pause at the end before restarting

export default function TrajectoryChart() {
  const [visiblePoints, setVisiblePoints] = useState(2);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const animate = () => {
      timeoutRef.current = setTimeout(() => {
        setVisiblePoints((prev) => {
          if (prev >= fullJourneyData.length) {
            // Pause at the end, then reset
            setTimeout(() => {
              setVisiblePoints(2);
            }, PAUSE_DURATION);
            return prev;
          }
          return prev + 1;
        });
        animate();
      }, ANIMATION_INTERVAL);
    };

    animate();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Get visible data slice
  const visibleData = fullJourneyData.slice(0, visiblePoints);
  const visibleLabels = grades.slice(0, visiblePoints);

  // Pad data to maintain chart scale
  const paddedData = [...visibleData];
  while (paddedData.length < fullJourneyData.length) {
    paddedData.push(visibleData[visibleData.length - 1]);
  }

  return (
    <View className="items-center">
      <LineChart
        data={{
          labels: grades,
          datasets: [
            {
              data: paddedData,
              color: () => '#f093fb',
              strokeWidth: 3,
            },
          ],
        }}
        width={CHART_WIDTH}
        height={200}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#f8fafc',
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(81, 100, 246, ${opacity})`,
          labelColor: () => '#6b7280',
          style: { borderRadius: 16 },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#f093fb',
          },
          propsForBackgroundLines: {
            strokeDasharray: '',
            stroke: '#e5e7eb',
            strokeWidth: 1,
          },
        }}
        bezier
        style={{ borderRadius: 16 }}
        withInnerLines
        withOuterLines={false}
        withVerticalLines={false}
        fromZero
        yAxisSuffix=" SP"
        segments={4}
      />
    </View>
  );
}

import React, { useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path, Line } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CHART_WIDTH = SCREEN_WIDTH - 48;
const CHART_HEIGHT = 200;
const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };

const INNER_WIDTH = CHART_WIDTH - PADDING.left - PADDING.right;
const INNER_HEIGHT = CHART_HEIGHT - PADDING.top - PADDING.bottom;

// Data points - closer together for visual impact
const withRfeData = [0, 1200, 2800, 4500, 5800, 7000, 8200, 9200, 10000];
const withoutRfeData = [0, 600, 1400, 2200, 2800, 3400, 4000, 4500, 5000];

const MAX_Y = 10000;

// Animation timing
const DRAW_DURATION = 4000;
const PAUSE_DURATION = 2000;

// Create animated path component
const AnimatedPath = Animated.createAnimatedComponent(Path);

// Convert data points to SVG path
function dataToPath(data: number[]): string {
  const points = data.map((value, index) => {
    const x = PADDING.left + (index / (data.length - 1)) * INNER_WIDTH;
    const y = PADDING.top + INNER_HEIGHT - (value / MAX_Y) * INNER_HEIGHT;
    return { x, y };
  });

  // Create smooth bezier curve
  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cpx = (prev.x + curr.x) / 2;
    path += ` Q ${cpx} ${prev.y} ${cpx} ${(prev.y + curr.y) / 2}`;
    path += ` Q ${cpx} ${curr.y} ${curr.x} ${curr.y}`;
  }

  return path;
}

// Calculate approximate path length
function getPathLength(data: number[]): number {
  let length = 0;
  for (let i = 1; i < data.length; i++) {
    const x1 = (i - 1) / (data.length - 1) * INNER_WIDTH;
    const y1 = INNER_HEIGHT - (data[i - 1] / MAX_Y) * INNER_HEIGHT;
    const x2 = i / (data.length - 1) * INNER_WIDTH;
    const y2 = INNER_HEIGHT - (data[i] / MAX_Y) * INNER_HEIGHT;
    length += Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }
  return length * 1.5; // Multiply for bezier curve approximation
}

interface AnimatedLineProps {
  data: number[];
  color: string;
  strokeWidth: number;
  delay: number;
}

function AnimatedLine({ data, color, strokeWidth, delay }: AnimatedLineProps) {
  const pathLength = getPathLength(data);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withSequence(
        withDelay(
          delay,
          withTiming(1, { duration: DRAW_DURATION, easing: Easing.out(Easing.ease) })
        ),
        withDelay(PAUSE_DURATION, withTiming(0, { duration: 0 }))
      ),
      -1,
      false
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: pathLength * (1 - progress.value),
  }));

  const pathD = dataToPath(data);

  return (
    <AnimatedPath
      d={pathD}
      stroke={color}
      strokeWidth={strokeWidth}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={pathLength}
      animatedProps={animatedProps}
    />
  );
}

export default function TrajectoryChart() {
  return (
    <View className="items-center">
      <View
        style={{
          width: CHART_WIDTH,
          height: CHART_HEIGHT,
        }}
      >
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {/* Animated lines */}
          <AnimatedLine
            data={withoutRfeData}
            color="#facc15"
            strokeWidth={4}
            delay={0}
          />
          <AnimatedLine
            data={withRfeData}
            color="#3b82f6"
            strokeWidth={4}
            delay={100}
          />

          {/* Y-axis line - rendered after progress lines to be on top */}
          <Line
            x1={PADDING.left}
            y1={PADDING.top}
            x2={PADDING.left}
            y2={PADDING.top + INNER_HEIGHT}
            stroke="#ffffff"
            strokeWidth={4}
          />

          {/* X-axis line - rendered after progress lines to be on top */}
          <Line
            x1={PADDING.left}
            y1={PADDING.top + INNER_HEIGHT}
            x2={CHART_WIDTH - PADDING.right}
            y2={PADDING.top + INNER_HEIGHT}
            stroke="#ffffff"
            strokeWidth={4}
          />
        </Svg>
      </View>

      {/* Legend */}
      <View className="flex-row justify-center mt-3 gap-6">
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#3b82f6' }} />
          <Text className="text-white/80 text-sm font-inter-medium">With RFE</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#facc15' }} />
          <Text className="text-white/80 text-sm font-inter-medium">Without RFE</Text>
        </View>
      </View>
    </View>
  );
}

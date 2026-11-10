import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import type { BuiltInIconType } from './types';

interface BuiltInIconProps {
  type: BuiltInIconType | string;
  size?: number;
  color?: string;
}

const AnimatedLoadingSpinner: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    animation.start();
    return () => animation.stop();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const borderThickness = Math.max(2, size * 0.12);

  return (
    <Animated.View
      style={[
        styles.center,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: borderThickness,
          borderColor: 'rgba(255, 255, 255, 0.25)',
          borderTopColor: color,
          transform: [{ rotate: spin }],
        },
      ]}
    />
  );
};

export const BuiltInIcon: React.FC<BuiltInIconProps> = ({
  type,
  size = 18,
  color = '#FFFFFF',
}) => {
  switch (type) {
    case 'success':
    case 'check': {
      // Crisp pixel-perfect checkmark
      const checkWidth = size * 0.36;
      const checkHeight = size * 0.65;
      const stroke = Math.max(2, size * 0.12);
      return (
        <View style={[styles.center, { width: size, height: size }]}>
          <View
            style={{
              width: checkWidth,
              height: checkHeight,
              borderColor: color,
              borderBottomWidth: stroke,
              borderRightWidth: stroke,
              borderRadius: 1,
              transform: [{ rotate: '45deg' }, { translateY: -size * 0.08 }],
            }}
          />
        </View>
      );
    }

    case 'danger':
    case 'error': {
      // Crisp pixel-perfect cross
      const crossThickness = Math.max(2, size * 0.12);
      const crossLength = size * 0.72;
      return (
        <View style={[styles.center, { width: size, height: size }]}>
          <View
            style={[
              styles.crossBar,
              {
                width: crossLength,
                height: crossThickness,
                backgroundColor: color,
                borderRadius: crossThickness / 2,
                transform: [{ rotate: '45deg' }],
              },
            ]}
          />
          <View
            style={[
              styles.crossBar,
              {
                width: crossLength,
                height: crossThickness,
                backgroundColor: color,
                borderRadius: crossThickness / 2,
                transform: [{ rotate: '-45deg' }],
              },
            ]}
          />
        </View>
      );
    }

    case 'warning': {
      // Modern clean exclamation mark
      const warnThickness = Math.max(2, size * 0.13);
      const dotSize = warnThickness * 1.1;
      return (
        <View style={[styles.center, { width: size, height: size }]}>
          <View
            style={{
              width: warnThickness,
              height: size * 0.46,
              backgroundColor: color,
              borderRadius: warnThickness / 2,
              marginBottom: size * 0.14,
            }}
          />
          <View
            style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: color,
            }}
          />
        </View>
      );
    }

    case 'info': {
      // Modern clean info icon: top dot, bottom stem
      const infoThickness = Math.max(2, size * 0.13);
      const infoDotSize = infoThickness * 1.1;
      return (
        <View style={[styles.center, { width: size, height: size }]}>
          <View
            style={{
              width: infoDotSize,
              height: infoDotSize,
              borderRadius: infoDotSize / 2,
              backgroundColor: color,
              marginBottom: size * 0.14,
            }}
          />
          <View
            style={{
              width: infoThickness,
              height: size * 0.46,
              backgroundColor: color,
              borderRadius: infoThickness / 2,
            }}
          />
        </View>
      );
    }

    case 'bell': {
      // Clean notification bell silhouette
      const stroke = Math.max(1.8, size * 0.1);
      return (
        <View style={[styles.center, { width: size, height: size }]}>
          {/* Bell dome */}
          <View
            style={{
              width: size * 0.58,
              height: size * 0.48,
              backgroundColor: color,
              borderTopLeftRadius: size * 0.29,
              borderTopRightRadius: size * 0.29,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
            }}
          />
          {/* Rim bar */}
          <View
            style={{
              width: size * 0.74,
              height: stroke,
              backgroundColor: color,
              borderRadius: 1,
              marginTop: 1,
            }}
          />
          {/* Clapper */}
          <View
            style={{
              width: size * 0.2,
              height: size * 0.12,
              backgroundColor: color,
              borderBottomLeftRadius: size * 0.1,
              borderBottomRightRadius: size * 0.1,
              marginTop: 1,
            }}
          />
        </View>
      );
    }

    case 'star': {
      // Modern 4-point sparkle star
      return (
        <View style={[styles.center, { width: size, height: size }]}>
          <View
            style={{
              position: 'absolute',
              width: size * 0.75,
              height: size * 0.24,
              backgroundColor: color,
              borderRadius: size * 0.12,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: size * 0.24,
              height: size * 0.75,
              backgroundColor: color,
              borderRadius: size * 0.12,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: size * 0.48,
              height: size * 0.48,
              backgroundColor: color,
              borderRadius: size * 0.08,
              transform: [{ rotate: '45deg' }],
            }}
          />
        </View>
      );
    }

    case 'heart': {
      // Pure React Native geometric heart
      const squareSize = size * 0.46;
      const circleSize = size * 0.46;
      return (
        <View style={[styles.center, { width: size, height: size }]}>
          <View
            style={{
              width: squareSize,
              height: squareSize,
              backgroundColor: color,
              transform: [{ rotate: '45deg' }, { translateY: -size * 0.04 }],
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: color,
              top: size * 0.14,
              left: size * 0.1,
            }}
          />
          <View
            style={{
              position: 'absolute',
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: color,
              top: size * 0.14,
              right: size * 0.1,
            }}
          />
        </View>
      );
    }

    case 'lock': {
      // Secure lock: upper shackle + lower body
      const shackleThickness = Math.max(2, size * 0.1);
      return (
        <View style={[styles.center, { width: size, height: size }]}>
          {/* Shackle */}
          <View
            style={{
              width: size * 0.44,
              height: size * 0.38,
              borderTopLeftRadius: size * 0.22,
              borderTopRightRadius: size * 0.22,
              borderWidth: shackleThickness,
              borderBottomWidth: 0,
              borderColor: color,
              marginBottom: -1,
            }}
          />
          {/* Body */}
          <View
            style={{
              width: size * 0.6,
              height: size * 0.46,
              backgroundColor: color,
              borderRadius: 3,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 2,
                height: 4,
                backgroundColor: 'rgba(0, 0, 0, 0.45)',
                borderRadius: 1,
              }}
            />
          </View>
        </View>
      );
    }

    case 'loading': {
      return <AnimatedLoadingSpinner size={size} color={color} />;
    }

    case 'default':
    default: {
      const defaultDot = size * 0.44;
      return (
        <View style={[styles.center, { width: size, height: size }]}>
          <View
            style={{
              width: defaultDot,
              height: defaultDot,
              borderRadius: defaultDot / 2,
              backgroundColor: color,
            }}
          />
        </View>
      );
    }
  }
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  crossBar: {
    position: 'absolute',
  },
});

import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { FlashMessageType } from './types';

interface BuiltInIconProps {
  type: FlashMessageType;
  size?: number;
  color?: string;
}

export const BuiltInIcon: React.FC<BuiltInIconProps> = ({
  type,
  size = 18,
  color = '#FFFFFF',
}) => {
  switch (type) {
    case 'success': {
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

    case 'danger': {
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
      // Modern clean info icon: top dot, bottom stem (no double circle!)
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

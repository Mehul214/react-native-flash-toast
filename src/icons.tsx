import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { FlashMessageType } from './types';

interface BuiltInIconProps {
  type: FlashMessageType;
  size?: number;
  color?: string;
}

export const BuiltInIcon: React.FC<BuiltInIconProps> = ({
  type,
  size = 22,
  color = '#FFFFFF',
}) => {
  const containerStyle = [
    styles.circle,
    {
      width: size,
      height: size,
      borderRadius: size / 2,
      borderColor: color,
    },
  ];

  switch (type) {
    case 'success':
      return (
        <View style={containerStyle}>
          <Text style={[styles.symbol, { color, fontSize: size * 0.65 }]}>✓</Text>
        </View>
      );
    case 'danger':
      return (
        <View style={containerStyle}>
          <Text style={[styles.symbol, { color, fontSize: size * 0.65 }]}>✕</Text>
        </View>
      );
    case 'warning':
      return (
        <View style={containerStyle}>
          <Text style={[styles.symbol, { color, fontSize: size * 0.65 }]}>!</Text>
        </View>
      );
    case 'info':
      return (
        <View style={containerStyle}>
          <Text style={[styles.symbol, { color, fontSize: size * 0.65 }]}>ℹ</Text>
        </View>
      );
    case 'default':
    default:
      return (
        <View style={containerStyle}>
          <Text style={[styles.symbol, { color, fontSize: size * 0.6 }]}>●</Text>
        </View>
      );
  }
};

const styles = StyleSheet.create({
  circle: {
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbol: {
    fontWeight: '800',
    textAlign: 'center',
    includeFontPadding: false,
    lineHeight: 22,
  },
});


import { Platform, StatusBar, Dimensions } from 'react-native';

export interface EdgeInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

/**
 * Returns safe default insets when react-native-safe-area-context is not present.
 * If the user's app wraps FlashMessage in SafeAreaProvider, safe-area context takes precedence.
 */
export function getDefaultSafeAreaInsets(): EdgeInsets {
  const { width, height } = Dimensions.get('window');
  const isLandscape = width > height;

  if (Platform.OS === 'android') {
    return {
      top: StatusBar.currentHeight ?? 24,
      bottom: 16,
      left: 0,
      right: 0,
    };
  }

  if (Platform.OS === 'ios') {
    // Dynamic island & modern notch iPhones typically have 47-59pt top inset
    const isModernIphone = !Platform.isPad && !Platform.isTV && (height >= 812 || width >= 812);
    return {
      top: isModernIphone ? (isLandscape ? 0 : 50) : 20,
      bottom: isModernIphone ? 34 : 0,
      left: 0,
      right: 0,
    };
  }

  return {
    top: 16,
    bottom: 16,
    left: 0,
    right: 0,
  };
}


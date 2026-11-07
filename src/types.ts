import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type FlashMessageType = 'default' | 'success' | 'danger' | 'warning' | 'info';

export type FlashMessagePosition = 'top' | 'bottom' | 'center';

export type FlashMessageTransition = 'slide' | 'fade' | 'bounce';

export type FlashMessageIcon =
  | FlashMessageType
  | 'none'
  | ReactNode
  | ((props: { size: number; color: string }) => ReactNode);

export interface FlashMessageAction {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface FlashMessageOptions {
  /** Unique ID for the message. Auto-generated if not provided */
  id?: string;
  /** Primary title or content */
  message: string | ReactNode;
  /** Secondary subtitle or body content */
  description?: string | ReactNode;
  /** Preset semantic style */
  type?: FlashMessageType;
  /** Screen position: 'top', 'bottom', or 'center'. Default: 'top' */
  position?: FlashMessagePosition;
  /** Display duration in milliseconds before auto-hiding. Default: 3000ms. Set to 0 to disable */
  duration?: number;
  /** Whether the message auto-dismisses after duration. Default: true */
  autoHide?: boolean;
  /** Floating pill with rounded corners vs edge-to-edge bar. Default: true */
  floating?: boolean;
  /** Preset or custom icon */
  icon?: FlashMessageIcon;
  /** Interactive action button (e.g. Undo, Retry) */
  action?: FlashMessageAction;
  /** Callback fired when the flash message card is tapped */
  onPress?: () => void;
  /** Callback fired when the flash message is long-pressed */
  onLongPress?: () => void;
  /** Callback fired after the message appears */
  onShow?: () => void;
  /** Callback fired after the message has fully hidden */
  onHide?: () => void;
  /** Custom container style */
  style?: StyleProp<ViewStyle>;
  /** Custom title text style */
  titleStyle?: StyleProp<TextStyle>;
  /** Custom description text style */
  textStyle?: StyleProp<TextStyle>;
  /** Override background color */
  backgroundColor?: string;
  /** Override text and icon color */
  color?: string;
  /** Dismiss when tapped. Default: true */
  hideOnPress?: boolean;
  /** Enable swipe up/down gesture to dismiss. Default: true */
  swipeToDismiss?: boolean;
  /** Temporarily pause the autoHide timer while finger touches the banner. Default: true */
  pauseOnPress?: boolean;
  /** Show an animated countdown progress bar at the bottom of the card. Default: false */
  showProgressBar?: boolean;
  /** Transition animation style: 'slide' | 'fade' | 'bounce'. Default: 'slide' */
  transition?: FlashMessageTransition;
  /** Override manual top inset / status bar height if needed */
  statusBarHeight?: number;
  /** Custom render function to completely override inner layout */
  customComponent?: (options: FlashMessageOptions, hide: () => void) => ReactNode;
}

export interface FlashMessageRef {
  showMessage: (options: FlashMessageOptions) => void;
  hideMessage: () => void;
}

export interface FlashMessageContainerProps {
  /** Default position for all messages if not specified in options */
  position?: FlashMessagePosition;
  /** Default duration in ms. Default: 3000 */
  duration?: number;
  /** Default floating style. Default: true */
  floating?: boolean;
  /** Default transition. Default: 'slide' */
  transition?: FlashMessageTransition;
  /** Optional top status bar offset */
  statusBarOffset?: number;
  /** Optional bottom navigation bar offset */
  bottomOffset?: number;
  /** Extra container style */
  style?: StyleProp<ViewStyle>;
  /** Can message replace current one immediately or queue. Default: 'replace' */
  mode?: 'replace' | 'queue';
}

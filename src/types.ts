import type { ReactNode } from 'react';
import type { StyleProp, ViewStyle, TextStyle } from 'react-native';

export type FlashMessageType =
  | 'default'
  | 'success'
  | 'danger'
  | 'error'
  | 'warning'
  | 'info'
  | (string & {});

export type FlashMessagePosition = 'top' | 'bottom' | 'center';

export type FlashMessageTransition = 'slide' | 'fade' | 'bounce';

export type BuiltInIconType =
  | 'default'
  | 'success'
  | 'danger'
  | 'error'
  | 'warning'
  | 'info'
  | 'bell'
  | 'star'
  | 'heart'
  | 'check'
  | 'lock'
  | 'loading';

export interface IconConfigObject {
  /** Name of a built-in icon preset */
  name?: BuiltInIconType | string;
  /** Custom icon component or render function */
  component?: ReactNode | ((props: { size: number; color: string }) => ReactNode);
  /** Custom icon color (overrides text color) */
  color?: string;
  /** Custom icon size in pixels (default: 18) */
  size?: number;
  /** Whether to render the circular badge background container (default: true) */
  badge?: boolean;
  /** Custom background color for the circular icon badge */
  badgeColor?: string;
  /** Custom style for the circular icon badge */
  badgeStyle?: StyleProp<ViewStyle>;
  /** Custom style for the icon wrapper */
  style?: StyleProp<ViewStyle>;
  /** Position of the icon relative to message: 'left' | 'right' (default: 'left') */
  position?: 'left' | 'right';
}

export type FlashMessageIcon =
  | BuiltInIconType
  | 'none'
  | ReactNode
  | ((props: { size: number; color: string }) => ReactNode)
  | IconConfigObject
  | (string & {});

export interface FlashMessageAction {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export interface ColorThemeEntry {
  background: string;
  text?: string;
  icon?: string;
  iconBadge?: string;
  description?: string;
  progressBar?: string;
  progressBarBackground?: string;
}

export interface FlashMessageOptions {
  /** Unique ID for the message. Auto-generated if not provided */
  id?: string;
  /** Primary title or content */
  message: string | ReactNode;
  /** Secondary subtitle or body content */
  description?: string | ReactNode;
  /** Preset semantic style or custom registered theme name */
  type?: FlashMessageType;
  /** Screen position: 'top', 'bottom', or 'center'. Default: 'top' */
  position?: FlashMessagePosition;
  /** Display duration in milliseconds before auto-hiding. Default: 3000ms. Set to 0 to disable */
  duration?: number;
  /** Whether the message auto-dismisses after duration. Default: true */
  autoHide?: boolean;
  /** Floating pill with rounded corners vs edge-to-edge bar. Default: true */
  floating?: boolean;

  /** Preset or custom icon (string preset, JSX element, render function, or configuration object) */
  icon?: FlashMessageIcon;
  /** Custom icon color (overrides card text color) */
  iconColor?: string;
  /** Custom icon size in pixels (default: 18) */
  iconSize?: number;
  /** Whether to render the circular badge background container behind the icon (default: true) */
  iconBadge?: boolean;
  /** Custom background color for the circular icon badge (e.g. 'rgba(255,255,255,0.22)' or '#FEF3C7') */
  iconBadgeColor?: string;
  /** Custom style for the circular icon badge */
  iconBadgeStyle?: StyleProp<ViewStyle>;
  /** Custom style for the icon container */
  iconStyle?: StyleProp<ViewStyle>;
  /** Position of icon relative to message text: 'left' | 'right'. Default: 'left' */
  iconPosition?: 'left' | 'right';

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

  /** Override card background color */
  backgroundColor?: string;
  /** Override primary text (title) color */
  color?: string;
  /** Override description text color */
  descriptionColor?: string;
  /** Override card border color */
  borderColor?: string;
  /** Override card border width */
  borderWidth?: number;
  /** Override card border radius */
  borderRadius?: number;

  /** Custom progress bar fill color */
  progressBarColor?: string;
  /** Custom progress bar track background color */
  progressBarBackgroundColor?: string;

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
  /** Default title text style */
  titleStyle?: StyleProp<TextStyle>;
  /** Default description text style */
  textStyle?: StyleProp<TextStyle>;
  /** Default icon position */
  iconPosition?: 'left' | 'right';
  /** Custom theme color map to register globally or locally */
  theme?: Record<string, ColorThemeEntry>;
  /** Can message replace current one immediately or queue. Default: 'replace' */
  mode?: 'replace' | 'queue';
}

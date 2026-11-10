import { FlashMessage } from './FlashMessage';

export { FlashMessage };
export default FlashMessage;

export {
  flashManager,
  showMessage,
  hideMessage,
  flash,
  dismissFlash,
} from './FlashMessageManager';

export {
  FlashMessageProvider,
  useFlashMessage,
} from './FlashMessageProvider';

export { BuiltInIcon } from './icons';
export {
  COLORS,
  styles,
  setColorTheme,
  setCustomColors,
  resetColorThemes,
  resolveTheme,
} from './styles';

export type {
  FlashMessageAction,
  FlashMessageContainerProps,
  FlashMessageIcon,
  FlashMessageOptions,
  FlashMessagePosition,
  FlashMessageRef,
  FlashMessageTransition,
  FlashMessageType,
  BuiltInIconType,
  ColorThemeEntry,
  IconConfigObject,
} from './types';

import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  Text,
  View,
} from 'react-native';
import { flashManager } from './FlashMessageManager';
import { BuiltInIcon } from './icons';
import { COLORS, styles } from './styles';
import type {
  FlashMessageContainerProps,
  FlashMessageOptions,
  FlashMessageRef,
} from './types';
import { getDefaultSafeAreaInsets } from './utils/safeArea';

export const FlashMessage = React.forwardRef<FlashMessageRef, FlashMessageContainerProps>(
  (props, ref) => {
    const {
      position: defaultPosition = 'top',
      duration: defaultDuration = 3000,
      floating: defaultFloating = true,
      statusBarOffset,
      bottomOffset,
      style: containerCustomStyle,
    } = props;

    const [currentMessage, setCurrentMessage] = useState<FlashMessageOptions | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Animation values
    const translateY = useRef(new Animated.Value(-150)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const progress = useRef(new Animated.Value(1)).current;

    // Timers & gesture tracking
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const progressAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
    const remainingTimeRef = useRef<number>(0);
    const timerStartedAtRef = useRef<number>(0);

    const safeInsets = getDefaultSafeAreaInsets();

    const position = currentMessage?.position ?? defaultPosition;
    const isTop = position === 'top';
    const isBottom = position === 'bottom';

    const clearTimers = useCallback(() => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      if (progressAnimationRef.current) {
        progressAnimationRef.current.stop();
        progressAnimationRef.current = null;
      }
    }, []);

    const animateHide = useCallback(
      (callback?: () => void) => {
        clearTimers();

        const targetY = isTop ? -180 : isBottom ? 180 : 0;

        Animated.parallel([
          Animated.timing(translateY, {
            toValue: targetY,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsVisible(false);
          if (currentMessage?.onHide) {
            currentMessage.onHide();
          }
          setCurrentMessage(null);
          callback?.();
        });
      },
      [clearTimers, isTop, isBottom, opacity, translateY, currentMessage]
    );

    const startAutoHideTimer = useCallback(
      (durationMs: number) => {
        clearTimers();
        if (durationMs <= 0) return;

        remainingTimeRef.current = durationMs;
        timerStartedAtRef.current = Date.now();

        // Start progress bar animation
        progress.setValue(1);
        progressAnimationRef.current = Animated.timing(progress, {
          toValue: 0,
          duration: durationMs,
          useNativeDriver: false, // width needs layout or scaleX
        });
        progressAnimationRef.current.start();

        hideTimeoutRef.current = setTimeout(() => {
          animateHide();
        }, durationMs);
      },
      [animateHide, clearTimers, progress]
    );

    const pauseTimer = useCallback(() => {
      if (hideTimeoutRef.current && timerStartedAtRef.current > 0) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
        const elapsed = Date.now() - timerStartedAtRef.current;
        remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);
        if (progressAnimationRef.current) {
          progressAnimationRef.current.stop();
        }
      }
    }, []);

    const resumeTimer = useCallback(() => {
      if (remainingTimeRef.current > 0) {
        startAutoHideTimer(remainingTimeRef.current);
      }
    }, [startAutoHideTimer]);

    const show = useCallback(
      (options: FlashMessageOptions) => {
        clearTimers();
        setCurrentMessage(options);
        setIsVisible(true);

        const pos = options.position ?? defaultPosition;
        const initialY = pos === 'top' ? -150 : pos === 'bottom' ? 150 : 0;

        translateY.setValue(initialY);
        opacity.setValue(0);
        progress.setValue(1);

        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            tension: 70,
            friction: 9,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (options.onShow) {
            options.onShow();
          }
        });

        const shouldAutoHide = options.autoHide ?? true;
        const dur = shouldAutoHide ? options.duration ?? defaultDuration : 0;
        if (dur > 0) {
          startAutoHideTimer(dur);
        }
      },
      [clearTimers, defaultDuration, defaultPosition, opacity, progress, startAutoHideTimer, translateY]
    );

    // Register with manager and imperative ref
    useImperativeHandle(
      ref,
      () => ({
        showMessage: show,
        hideMessage: () => animateHide(),
      }),
      [show, animateHide]
    );

    useEffect(() => {
      const instanceRef: FlashMessageRef = {
        showMessage: show,
        hideMessage: () => animateHide(),
      };
      flashManager.register(instanceRef);
      return () => {
        flashManager.unregister();
        clearTimers();
      };
    }, [show, animateHide, clearTimers]);

    // PanResponder for smooth swipe-to-dismiss gesture
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dy) > 5;
        },
        onPanResponderGrant: () => {
          if (currentMessage?.pauseOnPress ?? true) {
            pauseTimer();
          }
        },
        onPanResponderMove: (_, gestureState) => {
          if (!(currentMessage?.swipeToDismiss ?? true)) return;

          // Only allow dragging upwards for top, downwards for bottom
          if (isTop && gestureState.dy < 0) {
            translateY.setValue(gestureState.dy);
          } else if (isBottom && gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const swipeThreshold = 30;
          const isDismissGesture =
            (isTop && gestureState.dy < -swipeThreshold) ||
            (isBottom && gestureState.dy > swipeThreshold);

          if (isDismissGesture && (currentMessage?.swipeToDismiss ?? true)) {
            animateHide();
          } else {
            // Spring back to center
            Animated.spring(translateY, {
              toValue: 0,
              tension: 80,
              friction: 8,
              useNativeDriver: true,
            }).start();

            if (currentMessage?.pauseOnPress ?? true) {
              resumeTimer();
            }
          }
        },
      })
    ).current;

    if (!isVisible || !currentMessage) {
      return null;
    }

    const type = currentMessage.type ?? 'default';
    const typeColors = COLORS[type];
    const backgroundColor = currentMessage.backgroundColor ?? typeColors.background;
    const textColor = currentMessage.color ?? typeColors.text;
    const floating = currentMessage.floating ?? defaultFloating;

    const topInset =
      currentMessage.statusBarHeight ??
      statusBarOffset ??
      (isTop ? safeInsets.top + (floating ? 8 : 0) : 0);

    const bottomInset =
      bottomOffset ?? (isBottom ? safeInsets.bottom + (floating ? 8 : 0) : 0);

    const rootPositionStyle = isTop
      ? [styles.rootTop, { paddingTop: topInset }]
      : isBottom
      ? [styles.rootBottom, { paddingBottom: bottomInset }]
      : styles.rootCenter;

    const renderIcon = () => {
      if (currentMessage.icon === 'none') return null;

      if (typeof currentMessage.icon === 'function') {
        return (
          <View style={styles.iconContainer}>
            {currentMessage.icon({ size: 22, color: textColor })}
          </View>
        );
      }

      if (React.isValidElement(currentMessage.icon)) {
        return <View style={styles.iconContainer}>{currentMessage.icon}</View>;
      }

      const iconType = typeof currentMessage.icon === 'string' ? currentMessage.icon : type;
      return (
        <View style={styles.iconContainer}>
          <BuiltInIcon type={iconType as any} color={textColor} size={22} />
        </View>
      );
    };

    const handlePress = () => {
      if (currentMessage.onPress) {
        currentMessage.onPress();
      }
      if (currentMessage.hideOnPress ?? true) {
        animateHide();
      }
    };

    const progressWidthInterpolation = progress.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    });

    return (
      <View
        pointerEvents="box-none"
        style={[styles.rootOverlay, rootPositionStyle, containerCustomStyle]}
      >
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.toastContainer,
            floating ? styles.floatingContainer : styles.edgeToEdgeContainer,
            { backgroundColor },
            currentMessage.style,
            {
              transform: [{ translateY }],
              opacity,
            },
          ]}
        >
          {currentMessage.customComponent ? (
            currentMessage.customComponent(currentMessage, () => animateHide())
          ) : (
            <Pressable
              onPress={handlePress}
              onLongPress={currentMessage.onLongPress}
              style={styles.contentWrapper}
            >
              {renderIcon()}

              <View style={styles.textContainer}>
                {typeof currentMessage.message === 'string' ? (
                  <Text
                    style={[styles.titleText, { color: textColor }, currentMessage.titleStyle]}
                    numberOfLines={2}
                  >
                    {currentMessage.message}
                  </Text>
                ) : (
                  currentMessage.message
                )}

                {currentMessage.description ? (
                  typeof currentMessage.description === 'string' ? (
                    <Text
                      style={[
                        styles.descriptionText,
                        { color: textColor },
                        currentMessage.textStyle,
                      ]}
                      numberOfLines={3}
                    >
                      {currentMessage.description}
                    </Text>
                  ) : (
                    currentMessage.description
                  )
                ) : null}
              </View>

              {currentMessage.action ? (
                <Pressable
                  onPress={() => {
                    currentMessage.action?.onPress();
                    animateHide();
                  }}
                  style={[styles.actionButton, currentMessage.action.style]}
                >
                  <Text style={[styles.actionButtonText, currentMessage.action.textStyle]}>
                    {currentMessage.action.label}
                  </Text>
                </Pressable>
              ) : null}
            </Pressable>
          )}

          {currentMessage.showProgressBar && (
            <View style={styles.progressBarContainer}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  { width: progressWidthInterpolation },
                ]}
              />
            </View>
          )}
        </Animated.View>
      </View>
    );
  }
);

FlashMessage.displayName = 'FlashMessage';

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
  ViewStyle,
} from 'react-native';
import { flashManager } from './FlashMessageManager';
import { BuiltInIcon } from './icons';
import { resolveTheme, styles } from './styles';
import type {
  FlashMessageContainerProps,
  FlashMessageOptions,
  FlashMessageRef,
  IconConfigObject,
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
      titleStyle: defaultTitleStyle,
      textStyle: defaultTextStyle,
      iconPosition: defaultIconPosition = 'left',
      theme: localTheme,
    } = props;

    const [currentMessage, setCurrentMessage] = useState<FlashMessageOptions | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Keep active message in a mutable ref so callbacks always access latest values
    const currentMessageRef = useRef<FlashMessageOptions | null>(null);

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

        const pos = currentMessageRef.current?.position ?? defaultPosition;
        const targetY = pos === 'top' ? -180 : pos === 'bottom' ? 180 : 0;

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
          const onHide = currentMessageRef.current?.onHide;
          currentMessageRef.current = null;
          setCurrentMessage(null);
          if (onHide) {
            onHide();
          }
          callback?.();
        });
      },
      [clearTimers, defaultPosition, opacity, translateY]
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
          useNativeDriver: false,
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
        currentMessageRef.current = options;
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
        const dur = shouldAutoHide
          ? options.duration !== undefined
            ? options.duration
            : defaultDuration
          : 0;

        if (dur > 0) {
          startAutoHideTimer(dur);
        }
      },
      [clearTimers, defaultDuration, defaultPosition, opacity, progress, startAutoHideTimer, translateY]
    );

    // Mutable ref wrappers so external callers always invoke latest functions
    const showRef = useRef(show);
    const animateHideRef = useRef(animateHide);
    showRef.current = show;
    animateHideRef.current = animateHide;

    // Register with imperative ref
    useImperativeHandle(
      ref,
      () => ({
        showMessage: (options: FlashMessageOptions) => showRef.current(options),
        hideMessage: () => animateHideRef.current(),
      }),
      []
    );

    // Register with manager ON MOUNT only
    useEffect(() => {
      const instanceRef: FlashMessageRef = {
        showMessage: (options: FlashMessageOptions) => showRef.current(options),
        hideMessage: () => animateHideRef.current(),
      };
      flashManager.register(instanceRef);
      return () => {
        flashManager.unregister();
        clearTimers();
      };
    }, [clearTimers]);

    // PanResponder for smooth swipe-to-dismiss gesture
    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_, gestureState) => {
          const swipeEnabled = currentMessageRef.current?.swipeToDismiss ?? true;
          return swipeEnabled && Math.abs(gestureState.dy) > 8;
        },
        onPanResponderGrant: () => {
          if (currentMessageRef.current?.pauseOnPress ?? true) {
            pauseTimer();
          }
        },
        onPanResponderMove: (_, gestureState) => {
          if (!(currentMessageRef.current?.swipeToDismiss ?? true)) return;
          const pos = currentMessageRef.current?.position ?? defaultPosition;

          if (pos === 'top' && gestureState.dy < 0) {
            translateY.setValue(gestureState.dy);
          } else if (pos === 'bottom' && gestureState.dy > 0) {
            translateY.setValue(gestureState.dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const pos = currentMessageRef.current?.position ?? defaultPosition;
          const swipeThreshold = 30;
          const isDismissGesture =
            (pos === 'top' && gestureState.dy < -swipeThreshold) ||
            (pos === 'bottom' && gestureState.dy > swipeThreshold);

          if (isDismissGesture && (currentMessageRef.current?.swipeToDismiss ?? true)) {
            animateHide();
          } else {
            Animated.spring(translateY, {
              toValue: 0,
              tension: 80,
              friction: 8,
              useNativeDriver: true,
            }).start();

            if (currentMessageRef.current?.pauseOnPress ?? true) {
              resumeTimer();
            }
          }
        },
      })
    ).current;

    if (!isVisible || !currentMessage) {
      return null;
    }

    const position = currentMessage.position ?? defaultPosition;
    const isTop = position === 'top';
    const isBottom = position === 'bottom';

    const type = currentMessage.type ?? 'default';
    const resolvedTheme = resolveTheme(type, localTheme);

    const backgroundColor = currentMessage.backgroundColor ?? resolvedTheme.background;
    const textColor = currentMessage.color ?? (resolvedTheme.text || '#FFFFFF');
    const descriptionColor =
      currentMessage.descriptionColor ??
      resolvedTheme.description ??
      'rgba(255, 255, 255, 0.9)';
    const defaultIconColor = resolvedTheme.icon || textColor;
    const defaultBadgeBg = resolvedTheme.iconBadge || 'rgba(255, 255, 255, 0.22)';
    const progressBarColor =
      currentMessage.progressBarColor ?? resolvedTheme.progressBar ?? 'rgba(255, 255, 255, 0.9)';
    const progressBarTrackColor =
      currentMessage.progressBarBackgroundColor ??
      resolvedTheme.progressBarBackground ??
      'rgba(255, 255, 255, 0.2)';

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

    // Card customizations (borders, radius)
    const customCardStyle: ViewStyle = {};
    if (currentMessage.borderColor) {
      customCardStyle.borderColor = currentMessage.borderColor;
    }
    if (currentMessage.borderWidth !== undefined) {
      customCardStyle.borderWidth = currentMessage.borderWidth;
    }
    if (currentMessage.borderRadius !== undefined) {
      customCardStyle.borderRadius = currentMessage.borderRadius;
    }

    // Determine icon placement
    const isConfigObject =
      typeof currentMessage.icon === 'object' &&
      currentMessage.icon !== null &&
      !React.isValidElement(currentMessage.icon) &&
      ('name' in currentMessage.icon ||
        'component' in currentMessage.icon ||
        'color' in currentMessage.icon ||
        'size' in currentMessage.icon);

    const configObj = isConfigObject ? (currentMessage.icon as IconConfigObject) : null;

    const iconPlacement =
      configObj?.position ??
      currentMessage.iconPosition ??
      defaultIconPosition ??
      'left';

    const renderIconContent = () => {
      if (currentMessage.icon === 'none') return null;

      // 1. Config Object
      if (configObj) {
        const finalColor = configObj.color ?? currentMessage.iconColor ?? defaultIconColor;
        const finalSize = configObj.size ?? currentMessage.iconSize ?? 18;
        const showBadge =
          configObj.badge !== undefined
            ? configObj.badge
            : currentMessage.iconBadge !== undefined
            ? currentMessage.iconBadge
            : true;
        const badgeBg = configObj.badgeColor ?? currentMessage.iconBadgeColor ?? defaultBadgeBg;

        let iconNode: React.ReactNode = null;
        if (typeof configObj.component === 'function') {
          iconNode = configObj.component({ size: finalSize, color: finalColor });
        } else if (React.isValidElement(configObj.component)) {
          iconNode = configObj.component;
        } else {
          const iconType = configObj.name || type;
          iconNode = <BuiltInIcon type={iconType} color={finalColor} size={finalSize} />;
        }

        const badgeDimension = finalSize + 14;
        const badgeViewStyle: ViewStyle = {
          width: badgeDimension,
          height: badgeDimension,
          borderRadius: badgeDimension / 2,
          backgroundColor: badgeBg,
        };

        return (
          <View
            style={[
              iconPlacement === 'right' ? styles.iconContainerRight : styles.iconContainerLeft,
              configObj.style,
              currentMessage.iconStyle,
            ]}
          >
            {showBadge ? (
              <View
                style={[
                  styles.iconBadge,
                  badgeViewStyle,
                  configObj.badgeStyle,
                  currentMessage.iconBadgeStyle,
                ]}
              >
                {iconNode}
              </View>
            ) : (
              iconNode
            )}
          </View>
        );
      }

      // 2. Custom Render Function
      const finalColor = currentMessage.iconColor ?? defaultIconColor;
      const finalSize = currentMessage.iconSize ?? 18;
      const showBadge = currentMessage.iconBadge !== undefined ? currentMessage.iconBadge : true;
      const badgeBg = currentMessage.iconBadgeColor ?? defaultBadgeBg;

      const badgeDimension = finalSize + 14;
      const badgeViewStyle: ViewStyle = {
        width: badgeDimension,
        height: badgeDimension,
        borderRadius: badgeDimension / 2,
        backgroundColor: badgeBg,
      };

      if (typeof currentMessage.icon === 'function') {
        const iconNode = currentMessage.icon({ size: finalSize, color: finalColor });
        return (
          <View
            style={[
              iconPlacement === 'right' ? styles.iconContainerRight : styles.iconContainerLeft,
              currentMessage.iconStyle,
            ]}
          >
            {showBadge ? (
              <View style={[styles.iconBadge, badgeViewStyle, currentMessage.iconBadgeStyle]}>
                {iconNode}
              </View>
            ) : (
              iconNode
            )}
          </View>
        );
      }

      // 3. React Element
      if (React.isValidElement(currentMessage.icon)) {
        return (
          <View
            style={[
              iconPlacement === 'right' ? styles.iconContainerRight : styles.iconContainerLeft,
              currentMessage.iconStyle,
            ]}
          >
            {showBadge ? (
              <View style={[styles.iconBadge, badgeViewStyle, currentMessage.iconBadgeStyle]}>
                {currentMessage.icon}
              </View>
            ) : (
              currentMessage.icon
            )}
          </View>
        );
      }

      // 4. Preset String or Default
      const iconType = typeof currentMessage.icon === 'string' ? currentMessage.icon : type;
      return (
        <View
          style={[
            iconPlacement === 'right' ? styles.iconContainerRight : styles.iconContainerLeft,
            currentMessage.iconStyle,
          ]}
        >
          {showBadge ? (
            <View style={[styles.iconBadge, badgeViewStyle, currentMessage.iconBadgeStyle]}>
              <BuiltInIcon type={iconType} color={finalColor} size={finalSize} />
            </View>
          ) : (
            <BuiltInIcon type={iconType} color={finalColor} size={finalSize} />
          )}
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
            customCardStyle,
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
              onPressIn={() => {
                if (currentMessage.pauseOnPress ?? true) {
                  pauseTimer();
                }
              }}
              onPressOut={() => {
                if (currentMessage.pauseOnPress ?? true) {
                  resumeTimer();
                }
              }}
              onLongPress={currentMessage.onLongPress}
              style={styles.contentWrapper}
            >
              {iconPlacement === 'left' && renderIconContent()}

              <View style={styles.textContainer}>
                {typeof currentMessage.message === 'string' ? (
                  <Text
                    style={[
                      styles.titleText,
                      { color: textColor },
                      defaultTitleStyle,
                      currentMessage.titleStyle,
                    ]}
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
                        { color: descriptionColor },
                        defaultTextStyle,
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

              {iconPlacement === 'right' && renderIconContent()}

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
            <View style={[styles.progressBarContainer, { backgroundColor: progressBarTrackColor }]}>
              <Animated.View
                style={[
                  styles.progressBarFill,
                  {
                    backgroundColor: progressBarColor,
                    width: progressWidthInterpolation,
                  },
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

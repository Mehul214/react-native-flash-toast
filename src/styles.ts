import { StyleSheet, Platform } from 'react-native';
import type { FlashMessageType } from './types';

export const COLORS: Record<FlashMessageType, { background: string; text: string; icon: string }> = {
  default: {
    background: '#1F2937', // Slate 800
    text: '#FFFFFF',
    icon: '#9CA3AF',
  },
  success: {
    background: '#059669', // Emerald 600
    text: '#FFFFFF',
    icon: '#D1FAE5',
  },
  danger: {
    background: '#DC2626', // Red 600
    text: '#FFFFFF',
    icon: '#FEE2E2',
  },
  warning: {
    background: '#D97706', // Amber 600
    text: '#FFFFFF',
    icon: '#FEF3C7',
  },
  info: {
    background: '#2563EB', // Blue 600
    text: '#FFFFFF',
    icon: '#DBEAFE',
  },
};

export const styles = StyleSheet.create({
  rootOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 99999,
    elevation: 99999,
  },
  rootTop: {
    top: 0,
  },
  rootBottom: {
    bottom: 0,
  },
  rootCenter: {
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toastContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 14,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.15)',
      } as any,
    }),
  },
  floatingContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.16)',
  },
  edgeToEdgeContainer: {
    marginHorizontal: 0,
    borderRadius: 0,
  },
  contentWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: -0.2,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  descriptionText: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
    lineHeight: 18,
  },
  actionButton: {
    marginLeft: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  progressBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
});

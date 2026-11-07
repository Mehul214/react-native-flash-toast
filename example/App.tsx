import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  FlashMessage,
  showMessage,
  hideMessage,
} from 'react-native-flash-toast';

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>⚡️ react-native-flash-toast</Text>
        <Text style={styles.headerSubtitle}>
          Modern, high-performance flash banners for React Native New Architecture (Fabric) & Expo.
        </Text>

        {/* Basic Demos */}
        <Text style={styles.sectionTitle}>Basic Types</Text>
        <View style={styles.buttonRow}>
          <ActionButton
            label="Simple Message"
            color="#374151"
            onPress={() =>
              showMessage({
                message: 'Hello World!',
                description: 'This is a quick flash notification.',
                type: 'default',
              })
            }
          />
          <ActionButton
            label="Single Line"
            color="#4B5563"
            onPress={() =>
              showMessage({
                message: 'Profile settings saved successfully.',
              })
            }
          />
        </View>

        {/* Semantic Status Messages */}
        <Text style={styles.sectionTitle}>Semantic Notifications</Text>
        <View style={styles.buttonGrid}>
          <ActionButton
            label="Success"
            color="#059669"
            onPress={() =>
              showMessage({
                message: 'Success!',
                description: 'Your payment was processed securely.',
                type: 'success',
              })
            }
          />
          <ActionButton
            label="Info"
            color="#2563EB"
            onPress={() =>
              showMessage({
                message: 'New Update Available',
                description: 'Version 2.0 is now ready for download.',
                type: 'info',
              })
            }
          />
          <ActionButton
            label="Warning"
            color="#D97706"
            onPress={() =>
              showMessage({
                message: 'Storage Almost Full',
                description: 'You have only 15% disk space remaining.',
                type: 'warning',
              })
            }
          />
          <ActionButton
            label="Danger"
            color="#DC2626"
            onPress={() =>
              showMessage({
                message: 'Connection Failed',
                description: 'Could not reach server. Please try again.',
                type: 'danger',
              })
            }
          />
        </View>

        {/* Positions */}
        <Text style={styles.sectionTitle}>Positions</Text>
        <View style={styles.buttonRow}>
          <ActionButton
            label="Top (Default)"
            color="#4F46E5"
            onPress={() =>
              showMessage({
                message: 'Top Flash Message',
                description: 'Presents from top with notch & dynamic island safety.',
                position: 'top',
                type: 'info',
              })
            }
          />
          <ActionButton
            label="Bottom"
            color="#7C3AED"
            onPress={() =>
              showMessage({
                message: 'Bottom Flash Message',
                description: 'Presents above navigation bar / home indicator.',
                position: 'bottom',
                type: 'success',
              })
            }
          />
          <ActionButton
            label="Center"
            color="#9333EA"
            onPress={() =>
              showMessage({
                message: 'Center Banner',
                description: 'Floating alert in the center of screen.',
                position: 'center',
                type: 'default',
              })
            }
          />
        </View>

        {/* Interactive & Custom */}
        <Text style={styles.sectionTitle}>Interactive & Custom Features</Text>
        <View style={styles.buttonCol}>
          <ActionButton
            label="With Action Button (Undo)"
            color="#0D9488"
            onPress={() =>
              showMessage({
                message: 'File moved to Trash',
                type: 'default',
                action: {
                  label: 'Undo',
                  onPress: () => {
                    showMessage({
                      message: 'Restored file successfully!',
                      type: 'success',
                    });
                  },
                },
              })
            }
          />

          <ActionButton
            label="With Countdown Progress Bar"
            color="#0284C7"
            onPress={() =>
              showMessage({
                message: 'Syncing Files...',
                description: 'Auto-hides with live countdown indicator.',
                type: 'info',
                duration: 4000,
                showProgressBar: true,
              })
            }
          />

          <ActionButton
            label="Persistent (autoHide: false)"
            color="#6B7280"
            onPress={() =>
              showMessage({
                message: 'No Internet Connection',
                description: 'Tap banner or the button below to hide.',
                type: 'danger',
                autoHide: false,
              })
            }
          />

          <ActionButton
            label="Dismiss Active Message"
            color="#111827"
            onPress={() => hideMessage()}
          />
        </View>
      </ScrollView>

      {/* Mount FlashMessage once at the top/root of your app */}
      <FlashMessage position="top" />
    </SafeAreaView>
  );
}

function ActionButton({
  label,
  color,
  onPress,
}: {
  label: string;
  color: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.btn, { backgroundColor: color }]}
      onPress={onPress}
    >
      <Text style={styles.btnText}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    padding: 20,
    paddingBottom: 60,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#374151',
    marginTop: 18,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  buttonCol: {
    gap: 8,
  },
  btn: {
    flex: 1,
    minWidth: 140,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});

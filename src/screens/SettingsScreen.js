// src/screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Linking
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import {
  registerForPushNotifications,
  areNotificationsEnabled,
  toggleNotifications,
} from '../services/notificationService';
import { colors, spacing, radius, typography } from '../utils/theme';
import config from '../config';

const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const [notifsEnabled, setNotifsEnabled] = useState(false);

  useEffect(() => {
    areNotificationsEnabled().then(setNotifsEnabled);
  }, []);

  const handleToggleNotifs = async (value) => {
    if (value) {
      const token = await registerForPushNotifications();
      if (!token) {
        Alert.alert(
          'Notifications Blocked',
          'Please enable notifications for FlipFinder in your device settings.',
          [
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        return;
      }
    }
    await toggleNotifications(value);
    setNotifsEnabled(value);
  };

  const openEmpireFlippers = () => {
    Linking.openURL(`${config.ef.affiliateBaseUrl}?ref=${config.ef.affiliateRef}`);
  };

  return (
    <ScrollView
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* App brand card */}
      <LinearGradient
        colors={['#00D4FF20', '#A855F710']}
        style={styles.brandCard}
      >
        <Text style={styles.brandName}>FlipFinder</Text>
        <Text style={styles.brandTagline}>Your Business Acquisition Partner</Text>
        <Text style={styles.brandVersion}>v1.0.0 · Powered by Empire Flippers</Text>
      </LinearGradient>

      {/* Notifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
              <Feather name="bell" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.settingLabel}>New Listing Alerts</Text>
              <Text style={styles.settingSubtext}>Get notified about new deals</Text>
            </View>
          </View>
          <Switch
            value={notifsEnabled}
            onValueChange={handleToggleNotifs}
            trackColor={{ false: colors.border, true: colors.primary + '80' }}
            thumbColor={notifsEnabled ? colors.primary : colors.textMuted}
          />
        </View>
      </View>

      {/* About */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>

        <SettingLink icon="globe" label="Visit Empire Flippers" onPress={openEmpireFlippers} color={colors.primary} />
        <SettingLink icon="shield" label="Privacy Policy" onPress={() => {}} color={colors.textSecondary} />
        <SettingLink icon="file-text" label="Terms of Service" onPress={() => {}} color={colors.textSecondary} />
        <SettingLink icon="mail" label="Contact Support" onPress={() => Linking.openURL('mailto:support@flipfinderapp.com')} color={colors.textSecondary} />
      </View>

      <Text style={styles.disclaimer}>
        FlipFinder is an independent affiliate app. All listings are sourced from 
        Empire Flippers and verified by their team. Acquisitions are processed 
        directly on Empire Flippers.
      </Text>
    </ScrollView>
  );
};

const SettingLink = ({ icon, label, onPress, color }) => (
  <TouchableOpacity style={styles.settingRow} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.settingLeft}>
      <View style={[styles.settingIcon, { backgroundColor: color + '20' }]}>
        <Feather name={icon} size={16} color={color} />
      </View>
      <Text style={styles.settingLabel}>{label}</Text>
    </View>
    <Feather name="chevron-right" size={16} color={colors.textMuted} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.black,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandCard: {
    margin: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary + '30',
    alignItems: 'center',
  },
  brandName: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.black,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  brandTagline: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    marginTop: 4,
  },
  brandVersion: { fontSize: typography.fontSizes.xs, color: colors.textMuted, marginTop: 8 },
  section: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.xs,
    color: colors.textMuted,
    fontWeight: typography.fontWeights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: spacing.sm,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.bgCard,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { fontSize: typography.fontSizes.md, color: colors.textPrimary, fontWeight: typography.fontWeights.medium },
  settingSubtext: { fontSize: typography.fontSizes.xs, color: colors.textMuted, marginTop: 2 },
  disclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.sm,
  },
});

export default SettingsScreen;

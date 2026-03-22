import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { registerForPushNotifications, areNotificationsEnabled, toggleNotifications } from '../services/notificationService';
import { colors, spacing, radius, typography } from '../utils/theme';
import config from '../config';

export default function SettingsScreen() {
  var insets = useSafeAreaInsets();
  var notifState = useState(false);
  var notifsEnabled = notifState[0];
  var setNotifsEnabled = notifState[1];

  useEffect(function() {
    areNotificationsEnabled().then(function(val) { setNotifsEnabled(val); });
  }, []);

  async function handleToggleNotifs(value) {
    if (value) {
      var token = await registerForPushNotifications();
      if (!token) {
        Alert.alert(
          'Notifications Blocked',
          'Please enable notifications for FlipFinder in your device settings.',
          [
            { text: 'Open Settings', onPress: function() { Linking.openSettings(); } },
            { text: 'Cancel', style: 'cancel' },
          ]
        );
        return;
      }
    }
    await toggleNotifications(value);
    setNotifsEnabled(value);
  }

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.brandCard}>
        <Text style={styles.brandName}>FlipFinder</Text>
        <Text style={styles.brandTag}>Your Business Acquisition Partner</Text>
        <Text style={styles.brandVersion}>v1.0.0 - Powered by Empire Flippers</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
              <Feather name="bell" size={16} color={colors.primary} />
            </View>
            <View>
              <Text style={styles.settingName}>New Listing Alerts</Text>
              <Text style={styles.settingSub}>Get notified about new deals</Text>
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

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>About</Text>
        <TouchableOpacity style={styles.settingRow} onPress={function() { Linking.openURL(config.ef.marketplaceUrl); }}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
              <Feather name="globe" size={16} color={colors.primary} />
            </View>
            <Text style={styles.settingName}>Visit Empire Flippers</Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.textMuted} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.settingRow, { marginTop: 2 }]} onPress={function() { Linking.openURL('mailto:support@flipfinderapp.com'); }}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: colors.primary + '20' }]}>
              <Feather name="mail" size={16} color={colors.primary} />
            </View>
            <Text style={styles.settingName}>Contact Support</Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <Text style={styles.disclaimer}>
        FlipFinder is an independent affiliate app. All listings are sourced from Empire Flippers and verified by their team.
      </Text>
    </ScrollView>
  );
}

var styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { paddingBottom: 120 },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: typography.fontSizes.xxl, fontWeight: typography.fontWeights.black, color: colors.textPrimary, letterSpacing: -0.5 },
  brandCard: { margin: spacing.lg, borderRadius: radius.lg, padding: spacing.lg, alignItems: 'center', borderWidth: 1, borderColor: colors.primary + '30', backgroundColor: colors.primary + '08' },
  brandName: { fontSize: typography.fontSizes.xxl, fontWeight: typography.fontWeights.black, color: colors.primary, letterSpacing: -0.5 },
  brandTag: { fontSize: typography.fontSizes.md, color: colors.textSecondary, marginTop: 4 },
  brandVersion: { fontSize: typography.fontSizes.xs, color: colors.textMuted, marginTop: 8 },
  section: { marginHorizontal: spacing.lg, marginBottom: spacing.lg },
  sectionLabel: { fontSize: typography.fontSizes.xs, color: colors.textMuted, fontWeight: typography.fontWeights.semibold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: spacing.sm },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: colors.bgCard, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  settingName: { fontSize: typography.fontSizes.md, color: colors.textPrimary, fontWeight: typography.fontWeights.medium },
  settingSub: { fontSize: typography.fontSizes.xs, color: colors.textMuted, marginTop: 2 },
  disclaimer: { fontSize: 11, color: colors.textMuted, textAlign: 'center', lineHeight: 18, paddingHorizontal: spacing.xl },
});

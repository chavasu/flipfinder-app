import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { subscribeToEmailList, validateEmail } from '../services/emailService';
import { colors, spacing, radius, typography } from '../utils/theme';

var EMAIL_CAPTURED_KEY = '@flipfinder_email_captured';

export async function shouldShowEmailModal() {
  var captured = await AsyncStorage.getItem(EMAIL_CAPTURED_KEY);
  return captured !== 'true';
}

export async function markEmailCaptured() {
  await AsyncStorage.setItem(EMAIL_CAPTURED_KEY, 'true');
}

export default function EmailCaptureModal(props) {
  var visible = props.visible;
  var onClose = props.onClose;

  var firstNameState = useState('');
  var firstName = firstNameState[0];
  var setFirstName = firstNameState[1];

  var emailState = useState('');
  var email = emailState[0];
  var setEmail = emailState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var successState = useState(false);
  var success = successState[0];
  var setSuccess = successState[1];

  var errorState = useState('');
  var error = errorState[0];
  var setError = errorState[1];

  async function handleSubscribe() {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await subscribeToEmailList({ email: email, firstName: firstName, source: 'app_launch_modal' });
      await markEmailCaptured();
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSkip() {
    await markEmailCaptured();
    onClose();
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleSkip}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.iconBox}>
            <Text style={styles.iconText}>💼</Text>
          </View>
          <Text style={styles.title}>Find Your Next Business</Text>
          <Text style={styles.sub}>Get notified when premium businesses hit the market. Be first to make an offer.</Text>

          {success ? (
            <View style={styles.successBox}>
              <Text style={styles.successText}>You are in! Watch your inbox.</Text>
            </View>
          ) : (
            <View>
              <TextInput
                style={styles.input}
                placeholder="First name (optional)"
                placeholderTextColor={colors.textMuted}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              <TextInput
                style={styles.input}
                placeholder="Your email address"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <TouchableOpacity style={styles.btn} onPress={handleSubscribe} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Get Deal Alerts - Free</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

var styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.primary + '30',
  },
  iconBox: {
    width: 72, height: 72, borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconText: { fontSize: 36 },
  title: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.black,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  sub: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  input: {
    width: 280,
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: typography.fontSizes.md,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  error: { color: colors.error, fontSize: typography.fontSizes.sm, marginBottom: spacing.sm },
  btn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: spacing.sm,
    width: 280,
  },
  btnText: { fontSize: typography.fontSizes.md, fontWeight: typography.fontWeights.bold, color: colors.bg },
  skipBtn: { paddingVertical: spacing.md, alignItems: 'center' },
  skipText: { color: colors.textMuted, fontSize: typography.fontSizes.sm },
  successBox: { alignItems: 'center', paddingVertical: spacing.xl },
  successText: { fontSize: typography.fontSizes.lg, fontWeight: typography.fontWeights.bold, color: colors.success },
});

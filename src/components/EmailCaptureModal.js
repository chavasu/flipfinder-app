// src/components/EmailCaptureModal.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Animated
} from 'react-native';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../utils/theme';
import { subscribeToEmailList, validateEmail } from '../services/emailService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EMAIL_CAPTURED_KEY = '@flipfinder_email_captured';

export const shouldShowEmailModal = async () => {
  const captured = await AsyncStorage.getItem(EMAIL_CAPTURED_KEY);
  return captured !== 'true';
};

export const markEmailCaptured = async () => {
  await AsyncStorage.setItem(EMAIL_CAPTURED_KEY, 'true');
};

const EmailCaptureModal = ({ visible, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await subscribeToEmailList({ email, firstName, source: 'app_launch_modal' });
      await markEmailCaptured();
      setSuccess(true);
      setTimeout(onClose, 2000);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    await markEmailCaptured();
    onClose();
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={handleSkip}
      backdropOpacity={0.85}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.container}>
          {/* Glow accent */}
          <View style={styles.glowDot} />

          <LinearGradient
            colors={['#00D4FF15', '#A855F710']}
            style={styles.iconBg}
          >
            <Text style={styles.iconText}>💼</Text>
          </LinearGradient>

          <Text style={styles.headline}>Find Your Next Business</Text>
          <Text style={styles.subtext}>
            Get notified when premium businesses matching your criteria hit the market. 
            Be first to make an offer.
          </Text>

          {success ? (
            <View style={styles.successBox}>
              <Feather name="check-circle" size={32} color={colors.success} />
              <Text style={styles.successText}>You're in! Watch your inbox. 🚀</Text>
            </View>
          ) : (
            <>
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
                autoCorrect={false}
              />
              {error ? <Text style={styles.error}>{error}</Text> : null}

              <TouchableOpacity
                style={styles.ctaBtn}
                onPress={handleSubscribe}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#00D4FF', '#0099BB']}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.ctaGradient}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.ctaText}>Get Deal Alerts — Free</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>

              <Text style={styles.legalText}>
                No spam. Unsubscribe anytime. We only send quality deal alerts.
              </Text>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: {
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.xl,
    paddingBottom: spacing.xxl,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.primary + '30',
  },
  glowDot: {
    position: 'absolute',
    top: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    opacity: 0.15,
    alignSelf: 'center',
  },
  iconBg: {
    width: 72, height: 72, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconText: { fontSize: 36 },
  headline: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.black,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },
  input: {
    width: '100%',
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
  error: {
    color: colors.error,
    fontSize: typography.fontSizes.sm,
    marginBottom: spacing.sm,
    alignSelf: 'flex-start',
  },
  ctaBtn: { width: '100%', borderRadius: radius.md, overflow: 'hidden', marginTop: spacing.sm },
  ctaGradient: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  ctaText: { fontSize: typography.fontSizes.md, fontWeight: typography.fontWeights.bold, color: '#fff' },
  skipBtn: { paddingVertical: spacing.md },
  skipText: { color: colors.textMuted, fontSize: typography.fontSizes.sm },
  legalText: {
    fontSize: 11, color: colors.textMuted,
    textAlign: 'center', paddingHorizontal: spacing.lg,
  },
  successBox: { alignItems: 'center', paddingVertical: spacing.xl, gap: spacing.md },
  successText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.success,
    textAlign: 'center',
  },
});

export default EmailCaptureModal;

// src/components/InquiryModal.js
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { colors, spacing, radius, typography } from '../utils/theme';
import { buildAffiliateLink, formatCurrency, getTypeColor } from '../services/empireFlippersApi';
import { validateEmail } from '../services/emailService';

const BUDGETS = ['Under $50K', '$50K–$200K', '$200K–$500K', '$500K–$1M', '$1M+'];

const InquiryModal = ({ visible, listing, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [budget, setBudget] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!listing) return null;

  const typeColor = getTypeColor(listing.monetization || listing.business_type || '');
  const listPrice = listing.listing_price || listing.list_price;

  const handleProceed = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    setError('');
    setLoading(true);

    // Optional: send inquiry data to your backend/CRM before redirecting
    try {
      // await sendInquiryToBackend({ name, email, budget, message, listingId: listing.id });
    } catch (_) {}

    const affiliateUrl = buildAffiliateLink(
      listing.url || `https://empireflippers.com/listing/${listing.listing_number || listing.id}`
    );

    setLoading(false);
    onClose();

    await WebBrowser.openBrowserAsync(affiliateUrl, {
      toolbarColor: colors.bg,
      controlsColor: colors.primary,
      showTitle: false,
    });
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      backdropOpacity={0.85}
      style={styles.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Feather name="x" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Start Acquisition</Text>
          <View style={{ width: 32 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Listing summary */}
          <View style={[styles.listingSummary, { borderLeftColor: typeColor }]}>
            <View style={[styles.typePill, { backgroundColor: typeColor + '20' }]}>
              <Text style={[styles.typeText, { color: typeColor }]}>
                {listing.monetization || listing.business_type}
              </Text>
            </View>
            <Text style={styles.listingPrice}>{formatCurrency(listPrice)}</Text>
            <Text style={styles.listingSubtext}>
              Listing #{listing.listing_number || listing.id}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Your Details</Text>
          <Text style={styles.sectionSubtext}>
            We'll pre-fill your info on Empire Flippers to save you time.
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Full name"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
          <TextInput
            style={styles.input}
            placeholder="Email address *"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.budgetLabel}>Acquisition Budget</Text>
          <View style={styles.budgetGrid}>
            {BUDGETS.map(b => (
              <TouchableOpacity
                key={b}
                style={[styles.budgetChip, budget === b && { backgroundColor: typeColor + '30', borderColor: typeColor }]}
                onPress={() => setBudget(b)}
              >
                <Text style={[styles.budgetText, budget === b && { color: typeColor }]}>{b}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={[styles.input, styles.messageInput]}
            placeholder="Any questions? (optional)"
            placeholderTextColor={colors.textMuted}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={3}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={handleProceed}
            disabled={loading}
          >
            <LinearGradient
              colors={[typeColor, typeColor + 'BB']}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={styles.ctaGradient}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.ctaInner}>
                  <Text style={styles.ctaText}>View on Empire Flippers</Text>
                  <Feather name="external-link" size={16} color="#fff" />
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            You'll be redirected to Empire Flippers to complete your acquisition.
            Listings are verified and vetted by the EF team.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: { justifyContent: 'flex-end', margin: 0 },
  container: {
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    maxHeight: '92%',
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  closeBtn: { padding: 6 },
  headerTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  listingSummary: {
    backgroundColor: colors.bgCardAlt,
    borderRadius: radius.md,
    padding: spacing.md,
    borderLeftWidth: 3,
    marginBottom: spacing.lg,
  },
  typePill: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
    marginBottom: spacing.xs,
  },
  typeText: { fontSize: typography.fontSizes.xs, fontWeight: typography.fontWeights.semibold },
  listingPrice: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.black,
    color: colors.textPrimary,
  },
  listingSubtext: { fontSize: typography.fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  sectionSubtext: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  input: {
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
  messageInput: { height: 80, textAlignVertical: 'top' },
  budgetLabel: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
    marginBottom: spacing.sm,
  },
  budgetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  budgetChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 8,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.bgCardAlt,
  },
  budgetText: { fontSize: typography.fontSizes.sm, color: colors.textSecondary },
  error: { color: colors.error, fontSize: typography.fontSizes.sm, marginBottom: spacing.sm },
  ctaBtn: { borderRadius: radius.md, overflow: 'hidden', marginTop: spacing.sm, marginBottom: spacing.md },
  ctaGradient: { paddingVertical: 16, alignItems: 'center' },
  ctaInner: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  ctaText: { fontSize: typography.fontSizes.md, fontWeight: typography.fontWeights.bold, color: '#fff' },
  disclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: spacing.md,
  },
});

export default InquiryModal;

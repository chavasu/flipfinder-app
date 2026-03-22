import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, ActivityIndicator, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../utils/theme';
import { buildAffiliateLink, formatCurrency, getTypeColor } from '../services/empireFlippersApi';
import { validateEmail } from '../services/emailService';

var BUDGETS = ['Under $50K', '$50K-$200K', '$200K-$500K', '$500K-$1M', '$1M+'];

export default function InquiryModal(props) {
  var visible = props.visible;
  var listing = props.listing;
  var onClose = props.onClose;

  var nameState = useState('');
  var name = nameState[0];
  var setName = nameState[1];

  var emailState = useState('');
  var email = emailState[0];
  var setEmail = emailState[1];

  var budgetState = useState('');
  var budget = budgetState[0];
  var setBudget = budgetState[1];

  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var errorState = useState('');
  var error = errorState[0];
  var setError = errorState[1];

  if (!listing) return null;

  var typeColor = getTypeColor(listing.monetization || listing.business_type || '');
  var listPrice = listing.listing_price || listing.list_price;

  async function handleProceed() {
    if (!validateEmail(email)) {
      setError('Please enter a valid email');
      return;
    }
    setError('');
    setLoading(true);
    var url = listing.url || ('https://empireflippers.com/listing/' + (listing.listing_number || listing.id));
    var affiliateUrl = buildAffiliateLink(url);
    setLoading(false);
    onClose();
    Linking.openURL(affiliateUrl);
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Start Acquisition</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Feather name="x" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.listingSummary, { borderLeftColor: typeColor }]}>
              <View style={[styles.typePill, { backgroundColor: typeColor + '20' }]}>
                <Text style={[styles.typeText, { color: typeColor }]}>{listing.monetization || listing.business_type}</Text>
              </View>
              <Text style={styles.listingPrice}>{formatCurrency(listPrice)}</Text>
              <Text style={styles.listingId}>{'Listing #' + (listing.listing_number || listing.id)}</Text>
            </View>

            <TextInput style={styles.input} placeholder="Full name" placeholderTextColor={colors.textMuted} value={name} onChangeText={setName} autoCapitalize="words" />
            <TextInput style={styles.input} placeholder="Email address *" placeholderTextColor={colors.textMuted} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

            <Text style={styles.budgetLabel}>Acquisition Budget</Text>
            <View style={styles.budgetGrid}>
              {BUDGETS.map(function(b) {
                return (
                  <TouchableOpacity
                    key={b}
                    style={[styles.budgetChip, budget === b && { backgroundColor: typeColor + '30', borderColor: typeColor }]}
                    onPress={function() { setBudget(b); }}
                  >
                    <Text style={[styles.budgetText, budget === b && { color: typeColor }]}>{b}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity style={[styles.ctaBtn, { backgroundColor: typeColor }]} onPress={handleProceed} disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.ctaText}>View on Empire Flippers</Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

var styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: colors.bgCard, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing.lg, paddingBottom: spacing.xxl, maxHeight: '90%', borderTopWidth: 1, borderTopColor: colors.border },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  title: { fontSize: typography.fontSizes.lg, fontWeight: typography.fontWeights.bold, color: colors.textPrimary },
  closeBtn: { padding: 6 },
  listingSummary: { backgroundColor: colors.bgCardAlt, borderRadius: radius.md, padding: spacing.md, borderLeftWidth: 3, marginBottom: spacing.lg },
  typePill: { alignSelf: 'flex-start', paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full, marginBottom: spacing.xs },
  typeText: { fontSize: typography.fontSizes.xs, fontWeight: typography.fontWeights.semibold },
  listingPrice: { fontSize: typography.fontSizes.xxl, fontWeight: typography.fontWeights.black, color: colors.textPrimary },
  listingId: { fontSize: typography.fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  input: { backgroundColor: colors.bgInput, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 14, fontSize: typography.fontSizes.md, color: colors.textPrimary, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  budgetLabel: { fontSize: typography.fontSizes.sm, color: colors.textSecondary, fontWeight: typography.fontWeights.medium, marginBottom: spacing.sm },
  budgetGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.md },
  budgetChip: { paddingHorizontal: spacing.sm, paddingVertical: 8, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.bgCardAlt },
  budgetText: { fontSize: typography.fontSizes.sm, color: colors.textSecondary },
  error: { color: colors.error, fontSize: typography.fontSizes.sm, marginBottom: spacing.sm },
  ctaBtn: { borderRadius: radius.md, paddingVertical: 16, alignItems: 'center', marginTop: spacing.sm, marginBottom: spacing.md },
  ctaText: { fontSize: typography.fontSizes.md, fontWeight: typography.fontWeights.bold, color: '#fff' },
});

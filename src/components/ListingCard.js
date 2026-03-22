import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { colors, spacing, radius, typography } from '../utils/theme';
import { formatCurrency, formatMultiple, getTypeColor } from '../services/empireFlippersApi';

export default function ListingCard(props) {
  var listing = props.listing;
  var onPress = props.onPress;
  var onFavoriteToggle = props.onFavoriteToggle;
  var isFavorited = props.isFavorited || false;
  var style = props.style;

  var favState = useState(isFavorited);
  var favorited = favState[0];
  var setFavorited = favState[1];

  var typeColor = getTypeColor(listing.monetization || listing.business_type || '');
  var monthlyProfit = listing.monthly_net_profit || listing.net_profit;
  var listPrice = listing.listing_price || listing.list_price;
  var businessType = listing.monetization || listing.business_type || 'Business';
  var niche = listing.niche || listing.category || '';

  function handleFavorite() {
    var newState = !favorited;
    setFavorited(newState);
    if (onFavoriteToggle) onFavoriteToggle(listing, newState);
  }

  return (
    <TouchableOpacity
      style={[styles.card, style]}
      onPress={function() { if (onPress) onPress(listing); }}
      activeOpacity={0.85}
    >
      <View style={styles.header}>
        <View style={[styles.typeBadge, { backgroundColor: typeColor + '22', borderColor: typeColor + '55' }]}>
          <Text style={[styles.typeText, { color: typeColor }]}>{businessType}</Text>
        </View>
        <TouchableOpacity onPress={handleFavorite} style={styles.heartBtn}>
          <Feather name="heart" size={18} color={favorited ? '#FF6B6B' : colors.textMuted} />
        </TouchableOpacity>
      </View>

      <Text style={styles.listingId} numberOfLines={1}>
        {'Listing #' + (listing.listing_number || listing.id) + (niche ? ' - ' + niche : '')}
      </Text>

      <View style={styles.priceRow}>
        <Text style={styles.price}>{formatCurrency(listPrice)}</Text>
        <View style={styles.multipleBadge}>
          <Text style={styles.multipleText}>{formatMultiple(listPrice, monthlyProfit)}</Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metricItem}>
          <Feather name="trending-up" size={12} color={colors.success} />
          <Text style={styles.metricLabel}>Monthly Profit</Text>
          <Text style={[styles.metricValue, { color: colors.success }]}>{formatCurrency(monthlyProfit)}</Text>
        </View>
        <View style={styles.metricItem}>
          <Feather name="bar-chart-2" size={12} color={colors.primary} />
          <Text style={styles.metricLabel}>Revenue</Text>
          <Text style={[styles.metricValue, { color: colors.primary }]}>{formatCurrency(listing.monthly_revenue)}</Text>
        </View>
        <View style={styles.metricItem}>
          <Feather name="clock" size={12} color={colors.gold} />
          <Text style={styles.metricLabel}>Age</Text>
          <Text style={[styles.metricValue, { color: colors.gold }]}>{listing.years_old ? listing.years_old + 'y' : 'N/A'}</Text>
        </View>
      </View>

      <View style={[styles.ctaBar, { backgroundColor: typeColor + '15' }]}>
        <Text style={[styles.ctaText, { color: typeColor }]}>View Business</Text>
        <View style={styles.verifiedBadge}>
          <Feather name="check-circle" size={12} color={colors.success} />
          <Text style={styles.verifiedText}>Verified</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

var styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  typeBadge: { paddingHorizontal: spacing.sm, paddingVertical: 3, borderRadius: radius.full, borderWidth: 1 },
  typeText: { fontSize: typography.fontSizes.xs, fontWeight: typography.fontWeights.semibold },
  heartBtn: { padding: 6 },
  listingId: { fontSize: typography.fontSizes.sm, color: colors.textSecondary, marginBottom: spacing.xs },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md, gap: spacing.sm },
  price: { fontSize: typography.fontSizes.xxl, fontWeight: typography.fontWeights.black, color: colors.textPrimary },
  multipleBadge: { backgroundColor: colors.primary + '20', borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  multipleText: { fontSize: typography.fontSizes.sm, color: colors.primary, fontWeight: typography.fontWeights.bold },
  metrics: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: colors.divider, marginBottom: spacing.md },
  metricItem: { flex: 1, alignItems: 'center', gap: 3 },
  metricLabel: { fontSize: 10, color: colors.textMuted, textAlign: 'center' },
  metricValue: { fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.bold },
  ctaBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  ctaText: { fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.bold },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontSize: 10, color: colors.success },
});

// src/components/ListingCard.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, radius, typography, shadows } from '../utils/theme';
import { formatCurrency, formatMultiple, getTypeColor } from '../services/empireFlippersApi';

const ListingCard = ({ listing, onPress, onFavoriteToggle, isFavorited = false, style }) => {
  const [favorited, setFavorited] = useState(isFavorited);
  const scaleAnim = new Animated.Value(1);

  useEffect(() => setFavorited(isFavorited), [isFavorited]);

  const handleFavorite = async () => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.3, useNativeDriver: true, speed: 50 }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }),
    ]).start();
    const newState = !favorited;
    setFavorited(newState);
    if (onFavoriteToggle) onFavoriteToggle(listing, newState);
  };

  const typeColor = getTypeColor(listing.monetization || listing.business_type || '');
  const monthlyProfit = listing.monthly_net_profit || listing.net_profit;
  const listPrice = listing.listing_price || listing.list_price;
  const businessType = listing.monetization || listing.business_type || 'Business';
  const niche = listing.niche || listing.category || '';
  const multiple = formatMultiple(listPrice, monthlyProfit);

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onPress && onPress(listing)}
      activeOpacity={0.85}
    >
      <View style={styles.card}>
        {/* Header row */}
        <View style={styles.header}>
          <View style={[styles.typeBadge, { backgroundColor: typeColor + '22', borderColor: typeColor + '55' }]}>
            <Text style={[styles.typeText, { color: typeColor }]}>{businessType}</Text>
          </View>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity onPress={handleFavorite} style={styles.heartBtn}>
              <Feather
                name={favorited ? 'heart' : 'heart'}
                size={18}
                color={favorited ? '#FF6B6B' : colors.textMuted}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Listing ID / Title */}
        <Text style={styles.listingId} numberOfLines={1}>
          Listing #{listing.listing_number || listing.id}
          {niche ? ` · ${niche}` : ''}
        </Text>

        {/* Price row */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatCurrency(listPrice)}</Text>
          <View style={styles.multipleBadge}>
            <Text style={styles.multipleText}>{multiple}</Text>
          </View>
        </View>

        {/* Metrics */}
        <View style={styles.metrics}>
          <MetricItem
            label="Monthly Profit"
            value={formatCurrency(monthlyProfit)}
            icon="trending-up"
            color={colors.success}
          />
          <MetricItem
            label="Monthly Revenue"
            value={formatCurrency(listing.monthly_revenue || listing.gross_revenue)}
            icon="bar-chart-2"
            color={colors.primary}
          />
          <MetricItem
            label="Age"
            value={listing.years_old ? `${listing.years_old}y` : listing.age || 'N/A'}
            icon="clock"
            color={colors.gold}
          />
        </View>

        {/* Bottom gradient CTA */}
        <LinearGradient
          colors={[typeColor + '15', typeColor + '05']}
          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
          style={styles.ctaBar}
        >
          <Text style={[styles.ctaText, { color: typeColor }]}>View Business →</Text>
          <View style={styles.verifiedBadge}>
            <Feather name="check-circle" size={12} color={colors.success} />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
};

const MetricItem = ({ label, value, icon, color }) => (
  <View style={styles.metricItem}>
    <Feather name={icon} size={12} color={color} />
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={[styles.metricValue, { color }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { marginBottom: spacing.md },
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  typeText: { fontSize: typography.fontSizes.xs, fontWeight: typography.fontWeights.semibold },
  heartBtn: { padding: 6 },
  listingId: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  price: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.black,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  multipleBadge: {
    backgroundColor: colors.primary + '20',
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  multipleText: {
    fontSize: typography.fontSizes.sm,
    color: colors.primary,
    fontWeight: typography.fontWeights.bold,
  },
  metrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  metricItem: { flex: 1, alignItems: 'center', gap: 3 },
  metricLabel: { fontSize: 10, color: colors.textMuted, textAlign: 'center' },
  metricValue: { fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.bold },
  ctaBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  ctaText: { fontSize: typography.fontSizes.sm, fontWeight: typography.fontWeights.bold },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  verifiedText: { fontSize: 10, color: colors.success },
});

export default ListingCard;

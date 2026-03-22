// src/screens/WatchlistScreen.js
import React, { useState } from 'react';
import {
  View, Text, FlatList, StyleSheet, TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ListingCard from '../components/ListingCard';
import InquiryModal from '../components/InquiryModal';
import { useFavorites } from '../store/favoritesStore';
import { colors, spacing, radius, typography } from '../utils/theme';

const WatchlistScreen = () => {
  const insets = useSafeAreaInsets();
  const { favorites, toggle, checkIsFavorite } = useFavorites();
  const [inquiryListing, setInquiryListing] = useState(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Watchlist</Text>
        <Text style={styles.subtitle}>{favorites.length} saved businesses</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Feather name="heart" size={40} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptyText}>
            Tap the heart on any listing to add it to your watchlist.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => String(item.id || item.listing_number)}
          renderItem={({ item }) => (
            <ListingCard
              listing={item}
              style={{ marginHorizontal: spacing.md }}
              isFavorited={checkIsFavorite(item.id)}
              onFavoriteToggle={(listing) => toggle(listing)}
              onPress={(listing) => setInquiryListing(listing)}
            />
          )}
          contentContainerStyle={{ paddingBottom: 120, paddingTop: spacing.md }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <InquiryModal
        visible={!!inquiryListing}
        listing={inquiryListing}
        onClose={() => setInquiryListing(null)}
      />
    </View>
  );
};

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
  subtitle: { fontSize: typography.fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  emptyIcon: {
    width: 88, height: 88,
    borderRadius: 44,
    backgroundColor: colors.bgCard,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: typography.fontSizes.xl,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default WatchlistScreen;

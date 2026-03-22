import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ListingCard from '../components/ListingCard';
import InquiryModal from '../components/InquiryModal';
import { useFavorites } from '../store/favoritesStore';
import { colors, spacing, typography } from '../utils/theme';

export default function WatchlistScreen() {
  var insets = useSafeAreaInsets();
  var favStore = useFavorites();
  var favorites = favStore.favorites;
  var toggle = favStore.toggle;
  var checkIsFavorite = favStore.checkIsFavorite;

  var inquiryState = useState(null);
  var inquiryListing = inquiryState[0];
  var setInquiryListing = inquiryState[1];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Watchlist</Text>
        <Text style={styles.subtitle}>{favorites.length + ' saved businesses'}</Text>
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Feather name="heart" size={40} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Nothing saved yet</Text>
          <Text style={styles.emptyText}>Tap the heart on any listing to add it to your watchlist.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={function(item) { return String(item.id || item.listing_number); }}
          renderItem={function(info) {
            return (
              <ListingCard
                listing={info.item}
                style={styles.cardPadding}
                isFavorited={checkIsFavorite(info.item.id)}
                onFavoriteToggle={function(listing) { toggle(listing); }}
                onPress={function(listing) { setInquiryListing(listing); }}
              />
            );
          }}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <InquiryModal
        visible={!!inquiryListing}
        listing={inquiryListing}
        onClose={function() { setInquiryListing(null); }}
      />
    </View>
  );
}

var styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  header: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: typography.fontSizes.xxl, fontWeight: typography.fontWeights.black, color: colors.textPrimary, letterSpacing: -0.5 },
  subtitle: { fontSize: typography.fontSizes.sm, color: colors.textSecondary, marginTop: 2 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  emptyIcon: { width: 88, height: 88, borderRadius: 44, backgroundColor: colors.bgCard, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg, borderWidth: 1, borderColor: colors.border },
  emptyTitle: { fontSize: typography.fontSizes.xl, fontWeight: typography.fontWeights.bold, color: colors.textPrimary, marginBottom: spacing.sm },
  emptyText: { fontSize: typography.fontSizes.md, color: colors.textSecondary, textAlign: 'center', lineHeight: 22 },
  cardPadding: { marginHorizontal: spacing.md },
  listContent: { paddingTop: spacing.md, paddingBottom: 120 },
});

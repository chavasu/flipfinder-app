import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, RefreshControl, ActivityIndicator, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ListingCard from '../components/ListingCard';
import EmailCaptureModal, { shouldShowEmailModal } from '../components/EmailCaptureModal';
import InquiryModal from '../components/InquiryModal';
import { fetchListings } from '../services/empireFlippersApi';
import { useFavorites } from '../store/favoritesStore';
import config from '../config';
import { colors, spacing, typography } from '../utils/theme';

export default function HomeScreen() {
  var insets = useSafeAreaInsets();
  var listingsState = useState([]);
  var listings = listingsState[0];
  var setListings = listingsState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var refreshingState = useState(false);
  var refreshing = refreshingState[0];
  var setRefreshing = refreshingState[1];

  var pageState = useState(1);
  var page = pageState[0];
  var setPage = pageState[1];

  var totalPagesState = useState(1);
  var totalPages = totalPagesState[0];
  var setTotalPages = totalPagesState[1];

  var searchState = useState('');
  var searchQuery = searchState[0];
  var setSearchQuery = searchState[1];

  var activeTypeState = useState('all');
  var activeType = activeTypeState[0];
  var setActiveType = activeTypeState[1];

  var emailModalState = useState(false);
  var showEmailModal = emailModalState[0];
  var setShowEmailModal = emailModalState[1];

  var inquiryState = useState(null);
  var inquiryListing = inquiryState[0];
  var setInquiryListing = inquiryState[1];

  var favStore = useFavorites();
  var toggleFavorite = favStore.toggle;
  var checkIsFavorite = favStore.checkIsFavorite;

  useEffect(function() {
    initApp();
  }, []);

  async function initApp() {
    await loadListings(1, 'all', true);
    var show = await shouldShowEmailModal();
    if (show) {
      setTimeout(function() { setShowEmailModal(true); }, 1500);
    }
  }

  async function loadListings(pageNum, type, initial) {
    if (initial) setLoading(true);
    try {
      var efType = null;
      var found = config.businessTypes.find(function(t) { return t.id === type; });
      if (found) efType = found.efFilter || null;

      var result = await fetchListings({ page: pageNum, perPage: 20, businessType: efType });
      if (pageNum === 1) {
        setListings(result.listings);
      } else {
        setListings(function(prev) { return prev.concat(result.listings); });
      }
      setTotalPages(result.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('loadListings error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function onRefresh() {
    setRefreshing(true);
    loadListings(1, activeType, false);
  }

  function onTypeFilter(typeId) {
    setActiveType(typeId);
    setListings([]);
    loadListings(1, typeId, false);
  }

  var filteredListings = searchQuery
    ? listings.filter(function(l) {
        var q = searchQuery.toLowerCase();
        return (
          (l.monetization || '').toLowerCase().indexOf(q) >= 0 ||
          (l.niche || '').toLowerCase().indexOf(q) >= 0 ||
          String(l.listing_number || l.id || '').indexOf(q) >= 0
        );
      })
    : listings;

  function renderHeader() {
    return (
      <View>
        <View style={[styles.hero, { paddingTop: insets.top + spacing.md }]}>
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>Live Listings</Text>
          </View>
          <Text style={styles.heroTitle}>Find Your Next{'\n'}Online Business</Text>
          <Text style={styles.heroSub}>Browse verified businesses for sale. Start an acquisition today.</Text>
          <View style={styles.searchBox}>
            <Feather name="search" size={16} color={colors.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search by type, niche, ID..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={function() { setSearchQuery(''); }}>
                <Feather name="x" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>
        </View>

        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={config.businessTypes}
          keyExtractor={function(item) { return item.id; }}
          contentContainerStyle={styles.filterContent}
          style={styles.filterScroll}
          renderItem={function(info) {
            var type = info.item;
            var isActive = activeType === type.id;
            return (
              <TouchableOpacity
                onPress={function() { onTypeFilter(type.id); }}
                style={[styles.chip, isActive && styles.chipActive]}
              >
                <Feather name={type.icon} size={13} color={isActive ? colors.bg : colors.textSecondary} />
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{type.label}</Text>
              </TouchableOpacity>
            );
          }}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {activeType === 'all' ? 'All Businesses' : (config.businessTypes.find(function(t) { return t.id === activeType; }) || {}).label}
          </Text>
          <Text style={styles.sectionCount}>{filteredListings.length} listings</Text>
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} size="large" />
            <Text style={styles.loadingText}>Fetching live listings...</Text>
          </View>
        ) : null}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />
      <FlatList
        data={filteredListings}
        keyExtractor={function(item) { return String(item.id || item.listing_number); }}
        ListHeaderComponent={renderHeader}
        renderItem={function(info) {
          return (
            <ListingCard
              listing={info.item}
              style={styles.cardPadding}
              isFavorited={checkIsFavorite(info.item.id)}
              onFavoriteToggle={function(listing) { toggleFavorite(listing); }}
              onPress={function(listing) { setInquiryListing(listing); }}
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      <EmailCaptureModal visible={showEmailModal} onClose={function() { setShowEmailModal(false); }} />
      <InquiryModal visible={!!inquiryListing} listing={inquiryListing} onClose={function() { setInquiryListing(null); }} />
    </View>
  );
}

var styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  hero: { padding: spacing.lg, backgroundColor: colors.bg },
  liveBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: spacing.md },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.success },
  liveText: { fontSize: typography.fontSizes.xs, color: colors.success, fontWeight: typography.fontWeights.semibold, textTransform: 'uppercase', letterSpacing: 0.5 },
  heroTitle: { fontSize: typography.fontSizes.xxxl, fontWeight: typography.fontWeights.black, color: colors.textPrimary, lineHeight: 40, marginBottom: spacing.sm, letterSpacing: -1 },
  heroSub: { fontSize: typography.fontSizes.md, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.lg },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bgInput, borderRadius: 10, paddingHorizontal: spacing.md, gap: spacing.sm, borderWidth: 1, borderColor: colors.border },
  searchInput: { flex: 1, paddingVertical: 14, fontSize: typography.fontSizes.md, color: colors.textPrimary },
  filterScroll: { marginTop: spacing.md },
  filterContent: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingVertical: spacing.xs },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: 999, backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontSize: typography.fontSizes.sm, color: colors.textSecondary, fontWeight: typography.fontWeights.medium },
  chipTextActive: { color: colors.bg, fontWeight: typography.fontWeights.bold },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.md },
  sectionTitle: { fontSize: typography.fontSizes.lg, fontWeight: typography.fontWeights.bold, color: colors.textPrimary },
  sectionCount: { fontSize: typography.fontSizes.sm, color: colors.textMuted },
  loadingBox: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.md },
  loadingText: { color: colors.textSecondary, fontSize: typography.fontSizes.sm },
  cardPadding: { marginHorizontal: spacing.md },
  listContent: { paddingBottom: 120 },
});

// src/screens/HomeScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, FlatList,
  TextInput, TouchableOpacity, RefreshControl,
  ActivityIndicator, StatusBar, Animated
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ListingCard from '../components/ListingCard';
import EmailCaptureModal, { shouldShowEmailModal } from '../components/EmailCaptureModal';
import InquiryModal from '../components/InquiryModal';
import { fetchListings, fetchFeaturedListings } from '../services/empireFlippersApi';
import { useFavorites } from '../store/favoritesStore';
import config from '../config';
import { colors, spacing, radius, typography } from '../utils/theme';

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [listings, setListings] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState('all');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [inquiryListing, setInquiryListing] = useState(null);
  const { toggle: toggleFavorite, checkIsFavorite } = useFavorites();
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    await loadListings(1, 'all', true);
    const showModal = await shouldShowEmailModal();
    if (showModal) setTimeout(() => setShowEmailModal(true), 1500);
  };

  const loadListings = async (pageNum = 1, type = activeType, initial = false) => {
    if (initial) setLoading(true);
    try {
      const efType = config.businessTypes.find(t => t.id === type)?.efFilter || null;
      const result = await fetchListings({
        page: pageNum,
        perPage: 20,
        businessType: efType,
      });
      if (pageNum === 1) {
        setListings(result.listings);
        if (initial) {
          const feat = result.listings.slice(0, 3);
          setFeatured(feat);
        }
      } else {
        setListings(prev => [...prev, ...result.listings]);
      }
      setTotalPages(result.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('Load listings error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadListings(1, activeType);
  };

  const onLoadMore = () => {
    if (loadingMore || page >= totalPages) return;
    setLoadingMore(true);
    loadListings(page + 1);
  };

  const onTypeFilter = (typeId) => {
    setActiveType(typeId);
    setListings([]);
    loadListings(1, typeId, false);
  };

  const filteredListings = searchQuery
    ? listings.filter(l => {
        const q = searchQuery.toLowerCase();
        return (
          (l.monetization || '').toLowerCase().includes(q) ||
          (l.niche || '').toLowerCase().includes(q) ||
          String(l.listing_number || l.id || '').includes(q)
        );
      })
    : listings;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.bg} />

      {/* Sticky header on scroll */}
      <Animated.View style={[styles.stickyHeader, { opacity: headerOpacity }]}>
        <Text style={styles.stickyTitle}>FlipFinder</Text>
      </Animated.View>

      <Animated.FlatList
        data={filteredListings}
        keyExtractor={(item) => String(item.id || item.listing_number)}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        ListHeaderComponent={
          <View>
            {/* Hero */}
            <LinearGradient
              colors={['#0A0E1A', '#0D1525', '#0A0E1A']}
              style={styles.hero}
            >
              <View style={styles.heroBadge}>
                <View style={styles.heroBadgeDot} />
                <Text style={styles.heroBadgeText}>Live Listings</Text>
              </View>
              <Text style={styles.heroTitle}>Find Your Next{'\n'}Online Business</Text>
              <Text style={styles.heroSubtext}>
                Browse {listings.length > 0 ? `${listings.length}+` : 'premium'} verified businesses for sale.
                Start an acquisition today.
              </Text>

              {/* Search */}
              <View style={styles.searchRow}>
                <Feather name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by type, niche, ID..."
                  placeholderTextColor={colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearBtn}>
                    <Feather name="x" size={16} color={colors.textMuted} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </LinearGradient>

            {/* Category filters */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterScroll}
              contentContainerStyle={styles.filterContent}
            >
              {config.businessTypes.map(type => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => onTypeFilter(type.id)}
                  style={[styles.filterChip, activeType === type.id && styles.filterChipActive]}
                >
                  <Feather
                    name={type.icon}
                    size={13}
                    color={activeType === type.id ? colors.bg : colors.textSecondary}
                  />
                  <Text style={[styles.filterText, activeType === type.id && styles.filterTextActive]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Section title */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {activeType === 'all' ? 'All Businesses' : config.businessTypes.find(t => t.id === activeType)?.label}
              </Text>
              <Text style={styles.sectionCount}>
                {filteredListings.length} listings
              </Text>
            </View>

            {loading && (
              <View style={styles.loadingBox}>
                <ActivityIndicator color={colors.primary} size="large" />
                <Text style={styles.loadingText}>Fetching live listings...</Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <ListingCard
            listing={item}
            style={{ marginHorizontal: spacing.md }}
            isFavorited={checkIsFavorite(item.id)}
            onFavoriteToggle={(listing) => toggleFavorite(listing)}
            onPress={(listing) => setInquiryListing(listing)}
          />
        )}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} />
          ) : null
        }
        onEndReached={onLoadMore}
        onEndReachedThreshold={0.4}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <EmailCaptureModal
        visible={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />

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
  stickyHeader: {
    position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100,
    backgroundColor: colors.bg + 'EE',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  stickyTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.black,
    color: colors.primary,
    letterSpacing: -0.5,
  },
  hero: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.md,
  },
  heroBadgeDot: {
    width: 7, height: 7, borderRadius: 4,
    backgroundColor: colors.success,
  },
  heroBadgeText: {
    fontSize: typography.fontSizes.xs,
    color: colors.success,
    fontWeight: typography.fontWeights.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: typography.fontSizes.xxxl,
    fontWeight: typography.fontWeights.black,
    color: colors.textPrimary,
    lineHeight: 40,
    marginBottom: spacing.sm,
    letterSpacing: -1,
  },
  heroSubtext: {
    fontSize: typography.fontSizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bgInput,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    fontSize: typography.fontSizes.md,
    color: colors.textPrimary,
  },
  clearBtn: { padding: 6 },
  filterScroll: { marginTop: spacing.md },
  filterContent: { paddingHorizontal: spacing.md, gap: spacing.sm, paddingVertical: spacing.xs },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.bgCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  filterTextActive: { color: colors.bg, fontWeight: typography.fontWeights.bold },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
  },
  sectionCount: { fontSize: typography.fontSizes.sm, color: colors.textMuted },
  loadingBox: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.md },
  loadingText: { color: colors.textSecondary, fontSize: typography.fontSizes.sm },
});

export default HomeScreen;

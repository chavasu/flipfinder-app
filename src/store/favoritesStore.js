// src/store/favoritesStore.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = '@flipfinder_favorites';

// Load favorites from storage
export const loadFavorites = async () => {
  try {
    const raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Save favorites to storage
export const saveFavorites = async (favorites) => {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
};

// Add a listing to favorites
export const addFavorite = async (listing) => {
  const favorites = await loadFavorites();
  const exists = favorites.find(f => f.id === listing.id);
  if (!exists) {
    const updated = [listing, ...favorites];
    await saveFavorites(updated);
    return updated;
  }
  return favorites;
};

// Remove a listing from favorites
export const removeFavorite = async (listingId) => {
  const favorites = await loadFavorites();
  const updated = favorites.filter(f => f.id !== listingId);
  await saveFavorites(updated);
  return updated;
};

// Check if a listing is favorited
export const isFavorite = async (listingId) => {
  const favorites = await loadFavorites();
  return favorites.some(f => f.id === listingId);
};

// React hook for favorites
export const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites().then(data => {
      setFavorites(data);
      setLoading(false);
    });
  }, []);

  const toggle = useCallback(async (listing) => {
    const isInList = favorites.some(f => f.id === listing.id);
    let updated;
    if (isInList) {
      updated = await removeFavorite(listing.id);
    } else {
      updated = await addFavorite(listing);
    }
    setFavorites(updated);
    return !isInList;
  }, [favorites]);

  const checkIsFavorite = useCallback((listingId) => {
    return favorites.some(f => f.id === listingId);
  }, [favorites]);

  return { favorites, loading, toggle, checkIsFavorite };
};

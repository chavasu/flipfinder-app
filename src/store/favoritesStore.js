import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

var FAVORITES_KEY = '@flipfinder_favorites';

export async function loadFavorites() {
  try {
    var raw = await AsyncStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export async function saveFavorites(favorites) {
  try {
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('Error saving favorites:', e);
  }
}

export async function addFavorite(listing) {
  var favorites = await loadFavorites();
  var exists = favorites.find(function(f) { return f.id === listing.id; });
  if (!exists) {
    var updated = [listing].concat(favorites);
    await saveFavorites(updated);
    return updated;
  }
  return favorites;
}

export async function removeFavorite(listingId) {
  var favorites = await loadFavorites();
  var updated = favorites.filter(function(f) { return f.id !== listingId; });
  await saveFavorites(updated);
  return updated;
}

export function useFavorites() {
  var state = useState([]);
  var favorites = state[0];
  var setFavorites = state[1];
  var loadingState = useState(true);
  var setLoading = loadingState[1];

  useEffect(function() {
    loadFavorites().then(function(data) {
      setFavorites(data);
      setLoading(false);
    });
  }, []);

  var toggle = useCallback(async function(listing) {
    var isInList = favorites.some(function(f) { return f.id === listing.id; });
    var updated;
    if (isInList) {
      updated = await removeFavorite(listing.id);
    } else {
      updated = await addFavorite(listing);
    }
    setFavorites(updated);
    return !isInList;
  }, [favorites]);

  var checkIsFavorite = useCallback(function(listingId) {
    return favorites.some(function(f) { return f.id === listingId; });
  }, [favorites]);

  return { favorites: favorites, toggle: toggle, checkIsFavorite: checkIsFavorite };
}

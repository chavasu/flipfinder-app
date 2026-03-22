// src/services/notificationService.js
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PUSH_TOKEN_KEY = '@flipfinder_push_token';
const NOTIF_ENABLED_KEY = '@flipfinder_notifs_enabled';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request permissions and get push token
export const registerForPushNotifications = async () => {
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return null;
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
  await AsyncStorage.setItem(NOTIF_ENABLED_KEY, 'true');

  return token;
};

// Check if notifications are enabled
export const areNotificationsEnabled = async () => {
  const enabled = await AsyncStorage.getItem(NOTIF_ENABLED_KEY);
  return enabled === 'true';
};

// Toggle notifications
export const toggleNotifications = async (enabled) => {
  await AsyncStorage.setItem(NOTIF_ENABLED_KEY, enabled ? 'true' : 'false');
};

// Get stored push token
export const getPushToken = async () => {
  return await AsyncStorage.getItem(PUSH_TOKEN_KEY);
};

// Schedule a local notification (for new listing alerts)
export const scheduleNewListingNotification = async ({ title, body, data = {} }) => {
  const enabled = await areNotificationsEnabled();
  if (!enabled) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data,
      color: '#00D4FF',
    },
    trigger: null, // Send immediately
  });
};

// Send new listing alert
export const notifyNewListing = async (listing) => {
  await scheduleNewListingNotification({
    title: '🔥 New Listing on FlipFinder',
    body: `${listing.business_type || 'Business'} for ${listing.list_price ? `$${(listing.list_price / 1000).toFixed(0)}K` : 'a great price'} — tap to view!`,
    data: { listingId: listing.id, screen: 'ListingDetail' },
  });
};

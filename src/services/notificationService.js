import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

var NOTIF_ENABLED_KEY = '@flipfinder_notifs_enabled';

Notifications.setNotificationHandler({
  handleNotification: async function() {
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    };
  },
});

export async function registerForPushNotifications() {
  var existing = await Notifications.getPermissionsAsync();
  var status = existing.status;
  if (status !== 'granted') {
    var result = await Notifications.requestPermissionsAsync();
    status = result.status;
  }
  if (status !== 'granted') return null;
  var token = await Notifications.getExpoPushTokenAsync();
  await AsyncStorage.setItem(NOTIF_ENABLED_KEY, 'true');
  return token.data;
}

export async function areNotificationsEnabled() {
  var val = await AsyncStorage.getItem(NOTIF_ENABLED_KEY);
  return val === 'true';
}

export async function toggleNotifications(enabled) {
  await AsyncStorage.setItem(NOTIF_ENABLED_KEY, enabled ? 'true' : 'false');
}

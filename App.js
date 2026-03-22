import React, { useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';

import HomeScreen from './src/screens/HomeScreen';
import WatchlistScreen from './src/screens/WatchlistScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors, typography, spacing } from './src/utils/theme';

SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

const TabBar = ({ state, navigation }) => {
  const tabs = [
    { name: 'Home', icon: 'grid', label: 'Discover' },
    { name: 'Watchlist', icon: 'heart', label: 'Watchlist' },
    { name: 'Settings', icon: 'settings', label: 'Settings' },
  ];
  return (
    <View style={styles.tabBarOuter}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const tab = tabs[index];
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              onPress={() => {
                if (!isFocused) navigation.navigate(route.name);
              }}
              activeOpacity={0.7}
            >
              <View style={[styles.tabIconWrap, isFocused && styles.tabIconWrapActive]}>
                <Feather
                  name={tab.icon}
                  size={19}
                  color={isFocused ? colors.bg : colors.textMuted}
                />
              </View>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function App() {
  const notifListener = useRef();
  const responseListener = useRef();
  const navigationRef = useRef();

  useEffect(() => {
    SplashScreen.hideAsync();
    notifListener.current = Notifications.addNotificationReceivedListener(n => {
      console.log('Notification:', n);
    });
    responseListener.current = Notifications.addNotificationResponseReceivedListener(r => {
      const data = r.notification.request.content.data;
      if (data && data.screen === 'Home') {
        navigationRef.current && navigationRef.current.navigate('Home');
      }
    });
    return function() {
      Notifications.removeNotificationSubscription(notifListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer ref={navigationRef}>
          <StatusBar style="light" backgroundColor={colors.bg} />
          <Tab.Navigator
            tabBar={function(props) { return <TabBar {...props} />; }}
            screenOptions={{ headerShown: false }}
            initialRouteName="Home"
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Watchlist" component={WatchlistScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  tabBarOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'android' ? spacing.md : spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    borderRadius: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    gap: 4,
  },
  tabIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconWrapActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: typography.fontWeights.medium,
  },
  tabLabelActive: {
    color: colors.primary,
    fontWeight: typography.fontWeights.bold,
  },
});

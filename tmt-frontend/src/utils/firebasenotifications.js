// src/utils/firebasenotifications.js
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform, PermissionsAndroid } from 'react-native';

export const requestUserPermissionAndStoreFCMToken = async () => {
  try {
    console.log('🔔 Starting FCM token request...');

    // Android 13+ requires runtime notification permission
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission Required',
          'Notification permission is required for medication reminders.'
        );
        return;
      }
    }

    // Request permission (iOS and Android < 13)
    // The deprecation warning here is about the requestPermission() method itself,
    // which you might eventually want to replace with more granular checks if needed.
    // For now, focus on the "No Firebase App" error.
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('✅ FCM Token:', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
        return fcmToken;
      } else {
        console.warn('⚠️ No FCM token received');
      }
    } else {
      Alert.alert(
        'Permission Required',
        'Notification permission is required for medication reminders.'
      );
    }
  } catch (err) {
    console.error('❌ Error in FCM token process:', err);
    if (err.code === 'messaging/unknown') {
      console.error('⚠️ Firebase messaging not properly configured (check app.json plugins)');
    }
  }
};
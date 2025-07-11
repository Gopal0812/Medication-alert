import './firebaseconfig'; // Ensure this path is correct
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

// IMPORT YOUR FIREBASE CONFIGURATION FILE FIRST

import SignupScreen from './src/screens/Signup';
import Login from './src/screens/Login';
import Home from './src/screens/Home';
import AddMedicationScreen from './src/screens/AddMedications';
import messaging, { getMessaging } from '@react-native-firebase/messaging';
import EditMedicationScreen from './src/screens/EditMedicationScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);



  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📱 Foreground notification received:', remoteMessage);
      Alert.alert(remoteMessage.notification.title, remoteMessage.notification.body);
    });

    // Handle background notifications
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📱 Background notification received:', remoteMessage);
      // You can show a local notification here if needed
    });

    return unsubscribe;
  }, []);






  async function requestUserPermission() {
    const authStatus = await getMessaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }
  async function getFCMToken() {
    try {
      const token = await getMessaging().getToken();
      await AsyncStorage.setItem('fcmToken', token);
      console.log('FCM Token:', token);
      return token; // You can then send this token to your server
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  }
  useEffect(() => {
    requestUserPermission(); // Call permission request
    getFCMToken(); // Call token retrieval
  }, []);



  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        setInitialRoute(token ? 'Home' : 'Signup');
      } catch (e) {
        console.error('Error reading token:', e);
        setInitialRoute('Signup');
      }
    };
    checkToken();
  }, []);





  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Addmedication" component={AddMedicationScreen} />
          <Stack.Screen name="Editmedication" component={EditMedicationScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
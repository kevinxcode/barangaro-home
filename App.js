import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import HomeScreen from './components/HomeScreen';
import NewsScreen from './components/NewsScreen';
import AccountScreen from './components/AccountScreen';
import LoginScreen from './components/LoginScreen';
import RegisterScreen from './components/RegisterScreen';
import PaymentScreen from './components/PaymentScreen';
import NotificationScreen from './components/NotificationScreen';
import HistoryScreen from './components/HistoryScreen';
import NewsDetailScreen from './components/NewsDetailScreen';
import PaymentStatusScreen from './components/PaymentStatusScreen';
import PaymentVerifiedScreen from './components/PaymentVerifiedScreen';
import PendingVerificationScreen from './components/PendingVerificationScreen';
import ApiConfigScreen from './components/ApiConfigScreen';
import ApiSettingsScreen from './components/ApiSettingsScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#a32620',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'News') iconName = 'newspaper';
          else if (route.name === 'Account') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="News" component={NewsScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    checkSession();
    setupFirebase();
    
    // Handle notification tap when app is in background
    const unsubscribeNotificationResponse = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('👆 Notification tapped:', JSON.stringify(response, null, 2));
    });

    return () => {
      unsubscribeNotificationResponse.remove();
    };
  }, []);

  const setupFirebase = async () => {
    console.log('🔥 Setting up Firebase...');
    
    const authStatus = await messaging().requestPermission();
    console.log('📱 Auth Status:', authStatus);
    
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('✅ Permission granted');
      const token = await messaging().getToken();
      console.log('🔑 FCM Token:', token);
      
      await messaging().subscribeToTopic('barangaro_homes');
      console.log('📢 Subscribed to topic: barangaro_homes');
    } else {
      console.log('❌ Permission denied');
    }

    // Foreground message handler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('📩 Foreground notification received:', JSON.stringify(remoteMessage, null, 2));
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
        },
        trigger: null,
      });
    });

    // Background message handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📩 Background notification received:', JSON.stringify(remoteMessage, null, 2));
    });

    return unsubscribe;
  };

  const checkSession = async () => {
    const session = await AsyncStorage.getItem('session');
    if (session) {
      const userStr = await AsyncStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      if (user && user.status === 'pending') {
        setInitialRoute('PendingVerification');
      } else {
        setInitialRoute('PageHome');
      }
    } else {
      setInitialRoute('Login');
    }
  };

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="ApiSettings"
          component={ApiSettingsScreen}
          options={{
            headerShown: true,
            title: 'Pengaturan API',
            headerStyle: { backgroundColor: '#a32620' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '500' },
          }}
        />
        <Stack.Screen
          name="ApiConfig"
          component={ApiConfigScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PendingVerification"
          component={PendingVerificationScreen}
          options={{
            headerShown: true,
            title: 'Verifikasi Akun',
            headerStyle: { backgroundColor: '#a32620' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '500' },
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="PageHome"
          component={HomeTabs}
          options={{
            headerShown: true,
            title: 'BARANGAROO KIRANA HOMES 2',
            headerStyle: { backgroundColor: '#a32620' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '500' },
            headerBackTitleVisible: false,
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{
            headerShown: true,
            title: 'Pembayaran',
            headerStyle: { backgroundColor: '#a32620' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '500' },
          }}
        />
        <Stack.Screen
          name="Notification"
          component={NotificationScreen}
          options={{
            headerShown: true,
            title: 'Notifikasi',
            headerStyle: { backgroundColor: '#a32620' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '500' },
          }}
        />
        <Stack.Screen
          name="History"
          component={HistoryScreen}
          options={{
            headerShown: true,
            title: 'Riwayat Pembayaran',
            headerStyle: { backgroundColor: '#a32620' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '500' },
          }}
        />
        <Stack.Screen
          name="NewsDetail"
          component={NewsDetailScreen}
          options={{
            headerShown: true,
            title: 'Detail Berita',
            headerStyle: { backgroundColor: '#a32620' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '500' },
          }}
        />
        <Stack.Screen
          name="PaymentStatus"
          component={PaymentStatusScreen}
          options={{
            headerShown: true,
            title: 'Status Pembayaran',
            headerStyle: { backgroundColor: '#a32620' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '500' },
            headerLeft: () => null,
          }}
        />
        <Stack.Screen
          name="PaymentVerified"
          component={PaymentVerifiedScreen}
          options={{
            headerShown: true,
            title: 'Detail Pembayaran',
            headerStyle: { backgroundColor: '#a32620' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '500' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

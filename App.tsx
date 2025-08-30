import 'react-native-gesture-handler'; // must be at top
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Notifications from 'expo-notifications';
import * as SplashScreen from 'expo-splash-screen';

import HomeScreen from './src/screens/HomeScreen';
import VideoScreen from './src/screens/VideoScreen';
import WebViewScreen from './src/screens/WebViewScreen';
import theme from './src/theme/colors';

export type RootStackParamList = {
  Home: undefined;
  Video: { videoUrl: string; title: string };
    WebView: undefined;   // add this
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// keep splash until we hide it manually
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App(): React.JSX.Element {
  useEffect(() => {
    // hide splash after short delay
    const t = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => {});
    }, 1200);

    Notifications.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        } as Notifications.NotificationBehavior;
      },
    });

    return () => clearTimeout(t);
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Video" component={VideoScreen} />
            <Stack.Screen name="WebView" component={WebViewScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaProvider>
  );
}

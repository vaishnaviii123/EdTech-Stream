import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { Platform } from "react-native";

import HomeScreen from "./src/screens/HomeScreen";
import VideoScreen from "./src/screens/VideoScreen";
import WebViewScreen from "./src/screens/WebViewScreen";
import theme from "./src/theme/colors";

export type RootStackParamList = {
  Home: undefined;
  Video: { videoUrl: string; title: string }; 
  WebView: undefined;
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

    // ✅ configure foreground notification behavior
    Notifications.setNotificationHandler({
      handleNotification: async () => {
        return {
          shouldShowBanner: true, 
          shouldShowList: true, 
          shouldPlaySound: true,
        } as any; 
      },
    });

    // ✅ create Android channel & request permission
    const setupNotifications = async () => {
      try {
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "Default",
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: "#FF231F7C",
          });
        }

        const { status } = await Notifications.getPermissionsAsync();
        if (status !== "granted") {
          await Notifications.requestPermissionsAsync();
        }
      } catch (e) {
        console.warn("Notification setup error:", e);
      }
    };

    setupNotifications();

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

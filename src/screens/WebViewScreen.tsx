import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { WebView } from "react-native-webview";
import * as Notifications from "expo-notifications";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Nav = NativeStackNavigationProp<RootStackParamList, "WebView">;

export default function WebViewScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const insets = useSafeAreaInsets();
  const [pageLoaded, setPageLoaded] = useState(false);

  const queueRef = useRef<string[]>([]);
  const isSendingRef = useRef(false);

  useEffect(() => {
    Notifications.requestPermissionsAsync().catch(() => {});
  }, []);

  const processQueue = async () => {
    if (isSendingRef.current || queueRef.current.length === 0) return;

    isSendingRef.current = true;
    const msg = queueRef.current.shift()!;

    // random delay 2–3 sec
    const delay = Math.floor(Math.random() * 2) + 2;

    setTimeout(async () => {
      try {
        await Notifications.scheduleNotificationAsync({
          content: { title: "Notification 🔔", body: msg },
          trigger: null, // immediate after timeout
        });
      } catch (err) {
        console.warn("Failed to schedule notification", err);
      } finally {
        isSendingRef.current = false;
        processQueue(); // process next if exists
      }
    }, delay * 1000);
  };

  const sendNotification = (msg: string) => {
    queueRef.current.push(msg);
    processQueue();
  };

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      {/* Header */}
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
        <Appbar.Content title="WebView Page" titleStyle={styles.title} />
      </Appbar.Header>

      {/* WebView */}
      <WebView
        source={{ uri: "https://reactnative.dev/" }}
        style={styles.webview}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#E50914" />
          </View>
        )}
        onLoadProgress={({ nativeEvent }) => {
          if (!pageLoaded && nativeEvent.progress >= 0.8) {
            setPageLoaded(true);
            sendNotification("✅ Page is ready to use!");
          }
        }}
      />

      {/* Bottom buttons */}
      <View
        style={[
          styles.btnRow,
          {
            paddingBottom: Math.max(
              insets.bottom,
              Platform.OS === "android" ? 20 : 12
            ),
          },
        ]}
      >
        <Button
          mode="contained"
          labelStyle={styles.btnLabel}
          onPress={() => sendNotification("Hello from Button 1!")}
        >
          Notify 1
        </Button>
        <Button
          mode="contained-tonal"
          labelStyle={styles.btnLabel}
          onPress={() => sendNotification("Button 2 pressed 🚀")}
        >
          Notify 2
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212" },
  header: { backgroundColor: "#121212" },
  title: { color: "#fff" },
  webview: { flex: 1 },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: "#1c1c1c",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  btnLabel: {
    color: "#fff",
    fontWeight: "600",
  },
});

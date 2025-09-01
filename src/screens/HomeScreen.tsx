import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Platform,
} from "react-native";
import { Appbar, Text, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { LinearGradient } from "expo-linear-gradient";
import { Image } from "expo-image";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { colors } from "../theme/colors";  

type NavProp = NativeStackNavigationProp<RootStackParamList, "Home">;

const VIDEO_URL = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";
const VIDEO_THUMB =
  "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg";

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<NavProp>();
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    Notifications.requestPermissionsAsync().catch(() => {});

    // when user taps the notification, navigate
    const sub = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.screen === "Video") {
          navigation.navigate("Video", {
            videoUrl: data.videoUrl as string,
            title: data.title as string,
          });
        }
      }
    );

    return () => sub.remove();
  }, [navigation]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const sendPlayAndNavigate = async () => {
    // notification (delayed 2–3s)
    const delay = Math.floor(Math.random() * 2) + 2;
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "▶️ Watch Big Buck Bunny",
        body: "Tap to return to the Video Player",
        data: {
          screen: "Video",
          videoUrl: VIDEO_URL,
          title: "Big Buck Bunny",
        },
      },
      trigger: { seconds: delay, channelId: "default" },
    });

    // immediately navigate
    navigation.navigate("Video", {
      videoUrl: VIDEO_URL,
      title: "Big Buck Bunny",
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={[ "bottom"]}>
     
      <Appbar.Header mode="center-aligned" style={styles.header}>
        <Appbar.Content title="EdTech Stream" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 160 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#fff"
          />
        }
      >
        
        <View style={styles.heroCard}>
          <View style={styles.heroMedia}>
            <Image
              source={{ uri: VIDEO_THUMB }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              transition={200}
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.6)"]}
              style={StyleSheet.absoluteFill}
            />
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={sendPlayAndNavigate} 
              style={styles.playCenter}
            >
              <Ionicons name="play-circle" size={78} color="#ffffff" />
            </TouchableOpacity>

            <View style={styles.heroTextWrap}>
              <Text style={styles.heroTitle}>Big Buck Bunny</Text>
              <Text style={styles.heroSubtitle}>
                Animated short • 10 min • HD
              </Text>
            </View>
          </View>

          <View style={styles.actionRow}>
            <Button
              mode="contained"
              onPress={sendPlayAndNavigate}
              style={styles.primaryBtn}
              labelStyle={styles.primaryLabel}
              icon="play"
            >
              Play
            </Button>
            <Button
              mode="outlined"
              textColor="#fff"
              style={styles.secondaryBtn}
              icon="information"
              onPress={() =>
                Notifications.scheduleNotificationAsync({
                  content: {
                    title: "No Info Available 📭",
                    body: "We don’t have extra details for this video right now. Stay tuned!",
                  },
                  trigger: null, 
                })
              }
            >
              Info
            </Button>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: Math.max(
              insets.bottom,
              Platform.OS === "android" ? 12 : 0
            ),
          },
        ]}
      >
        <Button
          mode="contained"
          onPress={() => navigation.navigate("WebView")}
          style={styles.bottomButton}
          labelStyle={{ fontSize: 16, fontWeight: "600", color: "#fff" }}
          icon="web"
        >
          Go to WebView
        </Button>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: { backgroundColor: colors.background, elevation: 0 },
  headerTitle: { color: colors.text, fontWeight: "700", fontSize: 18 },

  heroCard: {
    marginTop: 12,
    marginHorizontal: 12,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.surface,
    elevation: 4,
  },
  heroMedia: {
    width: "100%",
    aspectRatio: 16 / 9,
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#000", 
  },
  playCenter: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -39 }, { translateY: -39 }],
  },
  heroTextWrap: {
    position: "absolute",
    left: 16,
    right: 16,
    bottom: 14,
  },
  heroTitle: { color: colors.text, fontSize: 22, fontWeight: "800" },
  heroSubtitle: { color: colors.subtitle, fontSize: 13, marginTop: 4 },

  actionRow: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
  },
  primaryBtn: { flex: 1, backgroundColor: colors.primary, borderRadius: 10 },
  primaryLabel: { color: colors.text, fontWeight: "700" },
  secondaryBtn: { flex: 1, borderColor: colors.text, borderRadius: 10 },

  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingTop: 8,
    backgroundColor: colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    elevation: 8,
  },
  bottomButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 6,
  },
});

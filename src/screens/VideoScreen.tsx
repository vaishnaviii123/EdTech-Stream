import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  useWindowDimensions,
} from "react-native";
import { IconButton } from "react-native-paper";
import { Video, ResizeMode } from "expo-av";
import * as ScreenOrientation from "expo-screen-orientation";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../../App";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";  

type VideoRoute = RouteProp<RootStackParamList, "Video">;
type Nav = NativeStackNavigationProp<RootStackParamList, "Video">;

const streamAlternatives = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
];

export default function VideoScreen(): React.JSX.Element {
  const route = useRoute<VideoRoute>();
  const navigation = useNavigation<Nav>();
  const { videoUrl } = route.params;

  const { width: screenW, height: screenH } = useWindowDimensions();

  const videoRef = useRef<Video | null>(null);
  const [src, setSrc] = useState<string>(videoUrl ?? streamAlternatives[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [fullscreen, setFullscreen] = useState<boolean>(false);

  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      ).catch(() => {});
    };
  }, []);

  useEffect(() => {
    Animated.timing(controlsOpacity, {
      toValue: controlsVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [controlsVisible]);

  const showControls = () => {
    setControlsVisible(true);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => setControlsVisible(false), 3000);
  };

  const onTapVideo = () => {
    if (controlsVisible) {
      setControlsVisible(false);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    } else {
      showControls();
    }
  };

  const onStatusUpdate = (status: any) => {
    if (!status) return;
    if (status.isLoaded) {
      setIsPlaying(!!status.isPlaying);
    }
  };

  const togglePlay = async () => {
    try {
      const s = await videoRef.current?.getStatusAsync();
      if (s?.isLoaded) {
        if (s.isPlaying) {
          await videoRef.current?.pauseAsync();
        } else {
          if (s.positionMillis === s.durationMillis) {
            await videoRef.current?.setPositionAsync(0);
          }
          await videoRef.current?.playAsync();
        }
      }
    } catch (err) {
      console.warn("togglePlay error", err);
    }
  };

  const toggleMute = async () => {
    try {
      await videoRef.current?.setIsMutedAsync(!muted);
      setMuted((m) => !m);
    } catch (err) {
      console.warn("toggleMute error", err);
    }
  };

  const switchStream = async () => {
    const currentIndex = streamAlternatives.indexOf(src);
    const next =
      streamAlternatives[(currentIndex + 1) % streamAlternatives.length];
    setSrc(next);
    try {
      await videoRef.current?.loadAsync(
        { uri: next },
        { shouldPlay: true, progressUpdateIntervalMillis: 500 }
      );
    } catch (err) {
      console.warn("switch stream failed", err);
    }
  };

  const handleBack = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    navigation.goBack();
  };

  const toggleFullscreen = async () => {
    if (!videoRef.current) return;

    try {
      if (fullscreen) {
        await videoRef.current.dismissFullscreenPlayer();
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.PORTRAIT_UP
        );
        setFullscreen(false);
      } else {
        await videoRef.current.presentFullscreenPlayer();
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
        setFullscreen(true);
      }
    } catch (err) {
      console.warn("fullscreen error", err);
    }
  };

  useEffect(() => {
    let active = true;

    const playOnMount = async () => {
      try {
        if (videoRef.current) {
          await videoRef.current.loadAsync(
            { uri: src },
            {
              shouldPlay: true,
              isMuted: muted,
              progressUpdateIntervalMillis: 500,
            },
            true
          );
          if (active) {
            await videoRef.current.playAsync();
          }
        }
      } catch (err) {
        console.warn("auto play failed", err);
      }
    };

    playOnMount();

    return () => {
      active = false;
      if (videoRef.current) {
        videoRef.current.stopAsync().catch(() => {});
        videoRef.current.unloadAsync().catch(() => {});
      }
    };
  }, [src]);

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={onTapVideo}>
        <View
          style={[styles.videoWrapper, { width: screenW, height: screenH }]}
        >
          <Video
            ref={videoRef}
            source={{ uri: src }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            isMuted={muted}
            onPlaybackStatusUpdate={onStatusUpdate}
            useNativeControls={false}
            progressUpdateIntervalMillis={500}
          />

          <Animated.View
            style={[styles.controlsOverlay, { opacity: controlsOpacity }]}
          >
            <View style={styles.topRow}>
              <IconButton
                icon="arrow-left"
                size={28}
                onPress={handleBack}
                iconColor="#fff"
                style={styles.backBtn}
              />
            </View>

            <View style={styles.centerRow}>
              <IconButton
                icon={isPlaying ? "pause-circle" : "play-circle"}
                size={54}
                onPress={togglePlay}
                iconColor="#fff"
              />
            </View>

            <View style={styles.bottomRightRow}>
              <IconButton
                icon={muted ? "volume-off" : "volume-high"}
                size={28}
                onPress={toggleMute}
                iconColor="#fff"
              />
              <IconButton
                icon="refresh"
                size={28}
                onPress={switchStream}
                iconColor="#fff"
              />
              <IconButton
                icon={fullscreen ? "fullscreen-exit" : "fullscreen"}
                size={28}
                onPress={toggleFullscreen}
                iconColor="#fff"
              />
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  videoWrapper: {
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.background,
  },
  controlsOverlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "space-between",
    padding: 12,
  },
  topRow: { flexDirection: "row", justifyContent: "flex-start" },
  backBtn: { marginLeft: 4 },
  centerRow: { flex: 1, justifyContent: "center", alignItems: "center" },
  bottomRightRow: { flexDirection: "row", justifyContent: "flex-end" },
});

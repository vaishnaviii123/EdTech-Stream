import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  Text as RnText,
} from 'react-native';
import { Appbar, IconButton, Button } from 'react-native-paper';
import { Video, ResizeMode } from 'expo-av';
import * as Notifications from 'expo-notifications';
import * as ScreenOrientation from 'expo-screen-orientation';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type VideoRoute = RouteProp<RootStackParamList, 'Video'>;
type Nav = NativeStackNavigationProp<RootStackParamList, 'Video'>;

const { width: screenW } = Dimensions.get('window');
const streamAlternatives = [
  'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  'https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8',
];

export default function VideoScreen(): React.JSX.Element {
  const route = useRoute<VideoRoute>();
  const navigation = useNavigation<Nav>();
  const { videoUrl, title } = route.params;

  const videoRef = useRef<Video | null>(null);
  const [src, setSrc] = useState<string>(videoUrl ?? streamAlternatives[0]);
  const [loading, setLoading] = useState<boolean>(true);
  const [buffering, setBuffering] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [muted, setMuted] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const controlsOpacity = useRef(new Animated.Value(1)).current;
  const [notifyDelay, setNotifyDelay] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const startedNotifiedRef = useRef(false);
  const endedNotifiedRef = useRef(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await Notifications.requestPermissionsAsync();
      } catch { }
    })();

    return () => {
      // Always restore portrait when leaving screen
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT).catch(() => { });
    };
  }, []);

  // fade controls
  useEffect(() => {
    Animated.timing(controlsOpacity, {
      toValue: controlsVisible ? 1 : 0,
      duration: 240,
      useNativeDriver: true,
    }).start();
  }, [controlsVisible, controlsOpacity]);

  // auto-hide controls
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

  // notifications
  const scheduleStartNotification = async (titleText: string) => {
    if (startedNotifiedRef.current) return;
    startedNotifiedRef.current = true;
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Enjoy this video 🎬', body: titleText ?? '' },
      trigger: { seconds: notifyDelay, repeats: false } as Notifications.TimeIntervalTriggerInput,
    });
  };

  const scheduleEndNotification = async (titleText: string) => {
    if (endedNotifiedRef.current) return;
    endedNotifiedRef.current = true;
    await Notifications.scheduleNotificationAsync({
      content: { title: 'Hope you enjoyed! 🍿', body: titleText ?? '' },
      trigger: { seconds: notifyDelay, repeats: false } as Notifications.TimeIntervalTriggerInput,
    });
  };

  const onStatusUpdate = (status: any) => {
    if (!status) return;
    if (status.isLoaded) {
      setIsPlaying(!!status.isPlaying);
      setBuffering(!!status.isBuffering);
      if (status.isPlaying && !startedNotifiedRef.current) {
        scheduleStartNotification(title);
      }
      if (status.didJustFinish) {
        scheduleEndNotification(title);
      }
    }
  };

  // controls
  const togglePlay = async () => {
    try {
      const s = await videoRef.current?.getStatusAsync();
      if (s?.isLoaded) {
        if (s.isPlaying) {
          await videoRef.current?.pauseAsync();
        } else {
          // If video is not playing, reset position and play
          if (s.positionMillis === s.durationMillis) {
            await videoRef.current?.setPositionAsync(0);  // Restart video
          }
          await videoRef.current?.playAsync();
        }
      }
    } catch (err) {
      console.warn('togglePlay error', err);
    }
  };


  const toggleMute = async () => {
    try {
      await videoRef.current?.setIsMutedAsync(!muted);
      setMuted((m) => !m);
    } catch (err) {
      console.warn('toggleMute error', err);
    }
  };

  const seekBy = async (deltaMs: number) => {
    try {
      const s = await videoRef.current?.getStatusAsync();
      if (s?.isLoaded) {
        const next = Math.max(0, (s.positionMillis ?? 0) + deltaMs);
        await videoRef.current?.setPositionAsync(next);
      }
    } catch (err) {
      console.warn('seek error', err);
    }
  };



const exitFullscreen = async () => {
  try {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP); // Fix rotation
    await videoRef.current?.dismissFullscreenPlayer();
    setIsFullscreen(false);
  } catch (err) {
    console.warn('exit fullscreen err', err);
  }
};

const goFullscreen = async () => {
  try {
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    await videoRef.current?.presentFullscreenPlayer();
    setIsFullscreen(true);
  } catch (err) {
    console.warn('fullscreen err', err);
  }
};

const handleBack = async () => {
  if (isFullscreen) {
    await exitFullscreen(); // just exit fullscreen first
  } else {
    // If in landscape, exit and set portrait mode
    await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    navigation.goBack();
  }
};



  const switchStream = async () => {
    const alternatives = streamAlternatives;
    const currentIndex = alternatives.indexOf(src);
    const next = alternatives[(currentIndex + 1) % alternatives.length];
    setSrc(next);
    try {
      await videoRef.current?.loadAsync(
        { uri: next },
        { shouldPlay: true, progressUpdateIntervalMillis: 500 }
      );
      startedNotifiedRef.current = false;
      endedNotifiedRef.current = false;
    } catch (err) {
      console.warn('switch stream failed', err);
    }
  };

  const cycleNotifyDelay = () => {
    const options = [1, 5, 10, 30];
    const idx = options.indexOf(notifyDelay);
    setNotifyDelay(options[(idx + 1) % options.length]);
  };


  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction color="white" onPress={handleBack} />
        <Appbar.Content title={title} titleStyle={styles.title} />
        <Button mode="contained-tonal" compact onPress={cycleNotifyDelay} style={styles.delayBtn}>
          Notify {notifyDelay}s
        </Button>
      </Appbar.Header>

      <TouchableWithoutFeedback onPress={onTapVideo}>
        <View style={styles.videoWrapper}>
          {(loading || buffering) && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#E50914" />
              <RnText style={styles.loadingText}>
                {buffering ? 'Buffering...' : 'Loading...'}
              </RnText>
            </View>
          )}

          <Video
            ref={videoRef}
            source={{ uri: src }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay
            isMuted={muted}
            onLoadStart={() => setLoading(true)}
            onLoad={() => setLoading(false)}
            onPlaybackStatusUpdate={onStatusUpdate}
            useNativeControls={false}
            progressUpdateIntervalMillis={500}
          />

          {/* custom controls */}
          <Animated.View style={[styles.controlsOverlay, { opacity: controlsOpacity }]}>
            <View style={styles.centerRow}>
              <IconButton
                icon="rewind-10" // Using correct icon name for rewind
                size={36}
                onPress={() => seekBy(-10000)}
                iconColor="#fff"
              />
              <IconButton
                icon={isPlaying ? 'pause-circle' : 'play-circle'}
                size={54}
                onPress={togglePlay}
                iconColor="#fff"
              />
              <IconButton
                icon="fast-forward-10" // Using correct icon name for fast forward
                size={36}
                onPress={() => seekBy(10000)}
                iconColor="#fff"
              />
            </View>

            <View style={styles.bottomRightRow}>
              <IconButton
                icon={muted ? 'volume-off' : 'volume-high'}
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
                icon={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
                size={28}
                onPress={isFullscreen ? exitFullscreen : goFullscreen}
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
  container: { flex: 1, backgroundColor: '#121212' },
  header: { backgroundColor: '#121212' },
  title: { color: '#fff' },
  videoWrapper: {
    width: '100%',
    height: (screenW * 9) / 16,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  loadingText: { color: '#fff', marginTop: 8 },
  controlsOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'space-between',
    padding: 12,
  },
  centerRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomRightRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  delayBtn: { marginRight: 8, backgroundColor: '#2a2a2a' },
});

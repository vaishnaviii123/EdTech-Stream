import React, { useState } from 'react';
import { View, StyleSheet, ImageBackground, ScrollView, RefreshControl } from 'react-native';
import { Appbar, Avatar, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { LinearGradient } from 'expo-linear-gradient';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const VIDEO_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const VIDEO_THUMB = 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg';

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<NavProp>();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={styles.container}>
      {/* Top App Bar */}
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="web" color="white" onPress={() => navigation.navigate('WebView')} />
        <Appbar.Content title="EdTech Stream" titleStyle={styles.title} />
        <Avatar.Icon size={36} icon="account" style={styles.avatar} />
      </Appbar.Header>

      {/* Scrollable Content */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
      >
        {/* Featured Video Section */}
        <ImageBackground source={{ uri: VIDEO_THUMB }} style={styles.hero}>
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            <Text style={styles.heroTitle}>Big Buck Bunny</Text>
            <View style={styles.actions}>
              <Button
                mode="contained"
                icon="play"
                onPress={() => navigation.navigate('Video', { videoUrl: VIDEO_URL, title: 'Big Buck Bunny' })}
                style={styles.playButton}
                labelStyle={{ color: '#fff' }}
              >
                Play
              </Button>
              <Button
                mode="outlined"
                icon="information"
                textColor="#fff"
                style={styles.infoButton}
              >
                Info
              </Button>
            </View>
          </LinearGradient>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { backgroundColor: '#121212' },
  title: { color: '#fff', fontWeight: '700' },
  avatar: { backgroundColor: '#E50914' },

  hero: {
    height: 400,
    justifyContent: 'flex-end',
  },
  gradient: {
    padding: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  playButton: {
    flex: 1,
    backgroundColor: '#E50914',
  },
  infoButton: {
    flex: 1,
    borderColor: '#fff',
  },
});

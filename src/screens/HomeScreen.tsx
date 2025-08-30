import React, { useState } from 'react';
import { View, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Appbar, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import VideoCard from '../components/VideoCard';

type NavProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

// Assignment video + its own thumbnail
const VIDEO_URL = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const VIDEO_THUMB = 'https://peach.blender.org/wp-content/uploads/title_anouncement.jpg';
const videos = [
  {
    id: '1',
    title: 'Big Buck Bunny',
    thumbnail: VIDEO_THUMB,
    url: VIDEO_URL,
  },
];

export default function HomeScreen(): React.JSX.Element {
  const navigation = useNavigation<NavProp>();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000); // simulate refresh
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Action icon="web" color="white" onPress={() => navigation.navigate('WebView')} />
        <Appbar.Content title="EdTech Stream" titleStyle={styles.title} />
        <Avatar.Icon size={36} icon="account" style={styles.avatar} />
      </Appbar.Header>

      <FlatList
        data={videos}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 24 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />
        }
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            onPress={() =>
              navigation.navigate('Video', { videoUrl: item.url, title: item.title })
            }
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { backgroundColor: '#121212' },
  title: { color: '#fff', fontWeight: '700' },
  avatar: { backgroundColor: '#E50914' },
});

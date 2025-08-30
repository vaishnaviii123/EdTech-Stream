import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, Text, IconButton } from 'react-native-paper';

interface Props {
  title: string;
  thumbnail: string;
  onPress: () => void;
}

export default function VideoCard({ title, thumbnail, onPress }: Props): React.JSX.Element {
  return (
    <Card onPress={onPress} style={styles.card}>
      <View>
        <Card.Cover source={{ uri: thumbnail }} style={styles.cover} />
        <IconButton icon="play-circle" size={46} style={styles.playIcon} iconColor="#fff" onPress={onPress} />
      </View>
      <Card.Content style={styles.content}>
        <Text variant="titleMedium" style={styles.title}>
          {title}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 12,
    marginTop: 12,
    backgroundColor: '#1c1c1c',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  cover: {
    height: 200,
    backgroundColor: '#000',
  },
  playIcon: {
    position: 'absolute',
    right: 16,
    bottom: 40,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  content: {
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  title: {
    color: '#fff',
  },
});

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Appbar, Button } from 'react-native-paper';
import { WebView } from 'react-native-webview';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

type Nav = NativeStackNavigationProp<RootStackParamList, 'WebView'>;

export default function WebViewScreen(): React.JSX.Element {
    const navigation = useNavigation<Nav>();

    useEffect(() => {
        Notifications.requestPermissionsAsync().catch(() => { });
    }, []);

    const sendNotification = async (msg: string) => {
        await Notifications.scheduleNotificationAsync({
            content: { title: 'Notification 🔔', body: msg },
            trigger: { seconds: 3, repeats: false } as Notifications.TimeIntervalTriggerInput
        });
    };

    return (
        <View style={styles.container}>
            <Appbar.Header style={styles.header}>
                <Appbar.BackAction color="white" onPress={() => navigation.goBack()} />
                <Appbar.Content title="WebView Page" titleStyle={styles.title} />
            </Appbar.Header>

            <WebView source={{ uri: 'https://reactnative.dev/' }} style={styles.webview} />

            <View style={styles.btnRow}>
                <Button mode="contained" onPress={() => sendNotification("Hello from Button 1!")}>
                    Notify 1
                </Button>
                <Button mode="contained-tonal" onPress={() => sendNotification("Button 2 pressed 🚀")}>
                    Notify 2
                </Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212' },
    header: { backgroundColor: '#121212' },
    title: { color: '#fff' },
    webview: { flex: 1 },
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 25,
        backgroundColor: '#1c1c1c',
    },
});

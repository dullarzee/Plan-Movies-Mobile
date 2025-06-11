//import { useFonts } from "expo-font";
import { Audio } from "expo-av";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native";

export default function RootLayout() {
    /*const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });*/

    useEffect(() => {
        Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
        },);
    },[]);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
            <Stack screenOptions={{ headerShown: false }}></Stack>
        </SafeAreaView>
    );
}

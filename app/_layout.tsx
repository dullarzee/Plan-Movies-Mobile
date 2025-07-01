//import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import SelectedMovieProvider from "./lib/contexts";

export default function RootLayout() {
    /*const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });*/

    return (
        <>
            <SafeAreaView
                style={[
                    styles.SafeAreaView,
                    { flex: 1, backgroundColor: "white" },
                ]}
            >
                <StatusBar barStyle="light-content" />
                <SelectedMovieProvider>
                    <Stack screenOptions={{ headerShown: false }}></Stack>
                </SelectedMovieProvider>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    SafeAreaView: {
        paddingTop:
            Platform.OS === "android"
                ? StatusBar.currentHeight -5
                : Platform.OS === "ios"
                ? 15
                : 0,
    },
});

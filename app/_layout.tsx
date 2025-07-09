//import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { Platform, SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SelectedMovieProvider from "./lib/contexts";

export default function RootLayout() {
    /*const [loaded] = useFonts({
        SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    });*/

    return (
        <>
            <SafeAreaView
                style={[
                    styles.safeAreaView,
                    { flex: 1, backgroundColor: "white" },
                ]}
            >
                <GestureHandlerRootView style={{ flex: 1 }}>
                    <StatusBar barStyle="light-content" />
                    <SelectedMovieProvider>
                        <Stack screenOptions={{ headerShown: false }}></Stack>
                    </SelectedMovieProvider>
                </GestureHandlerRootView>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    safeAreaView: {
        paddingTop:
            Platform.OS === "android" && StatusBar.currentHeight
                ? StatusBar.currentHeight - 5
                : Platform.OS === "ios"
                ? 15
                : 0,
    },
});

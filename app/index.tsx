import { Link } from "expo-router";
import { StyleSheet, Text, View, Button, Pressable } from "react-native";

export default function StartupScreen() {
    return (
        <>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 10,
                }}
            >
                <Text style={styles.welcomeHeader}>
                    Welcome to Plan Movies!
                </Text>

                <Link href="./home" style={styles.button}>
                    <Text style={{ fontSize: 20, color: "black" }}>Enter</Text>
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    welcomeHeader: {
        fontSize: 29,
        color: "rgba(235, 0, 0, 1)",
        fontWeight: "500",
        textAlign: "center",
    },
    button: {
        backgroundColor: "rgba(235, 0, 0, 1)",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        margin: 7,
        fontSize: 16,
        borderWidth: 1,
    },
});

import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function StartupScreen() {
    return (
        <>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text style={styles.welcomeHeader}>
                    Welcome to Plan Movies!
                </Text>

                <Link href="./home">
                    <TouchableOpacity style={styles.button}>
                        <Text style={{ color: "white" }}>Enter App</Text>
                    </TouchableOpacity>
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
    },
});

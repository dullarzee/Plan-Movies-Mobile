import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, StyleSheet, Text, View } from "react-native";

export default function ContinueWatchingCard() {
    return (
        <View style={styles.outermost}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    //resizeMode="contain"
                    source={require("../assets/images/theyClonedTyrone.jpg")}
                />
                <Text style={styles.duration}>
                    <Ionicons
                        name="time-outline"
                        style={{ marginTop: 3 }}
                        size={13}
                    />
                    2h 15m
                </Text>
            </View>
            <View>
                <Text style={styles.movieTitle}>They Cloned Tyrone</Text>
            </View>
            <Text style={styles.genre}>Sci-Fi</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    outermost: {
        flex: 1,
        width: 130,
        borderWidth: 2,
        borderColor: "#cfcfcf",
        borderRadius: 10,
        padding: 8,
    },
    imageContainer: {
        position: "relative",
        width: "100%",
        height: "67%",
        backgroundColor: "#e9e9e9",
        borderRadius: 8,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        objectFit: "contain",
    },
    duration: {
        position: "absolute",
        bottom: "5%",
        right: "5%",
        paddingVertical: 3,
        paddingHorizontal: 8,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 12,
        fontWeight: "500",
        fontSize: 13,
    },
    movieTitle: {
        fontSize: 12,
        fontWeight: "500",
    },
    genre: {
        color: "gray",
        fontSize: 12,
    },
});

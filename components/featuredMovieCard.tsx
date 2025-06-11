import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function FeaturedMovieCard({
    title,
    image,
    catchPhrase,
}: {
    title: string;
    image: ImageSourcePropType;
    catchPhrase: string;
}) {
    return (
        <View style={styles.featured}>
            <Image
                style={styles.featuredImage}
                resizeMode="cover"
                source={image}
            />
            <LinearGradient
                colors={["rgba(0, 0, 0, 0.75)", "rgba(0, 0, 0, 0)"]}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0.4 }}
                style={styles.featuredImageOverlay}
            >
                <Text style={styles.movieTitle}>Featured: {title}</Text>
                <View>
                    <Text style={styles.subHeading}>{catchPhrase}</Text>
                </View>
                <View style={styles.watchNowButton}>
                    <Ionicons name="play-outline" size={20} color="white" />
                    <Text style={[styles.watchNowText]}>Watch Now</Text>
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    featured: {
        width: "100%",
        height: 200,
        marginVertical: 15,
        position: "relative",
    },
    featuredImage: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
    },
    featuredImageOverlay: {
        width: "100%",
        height: "100%",
        bottom: 0,
        position: "absolute",
        paddingHorizontal: 13,
        paddingTop: "25%",
        borderRadius: 13,
        alignItems: "flex-start",
    },
    movieTitle: {
        fontSize: 21,
        fontWeight: "500",
        color: "white",
        lineHeight: 25,
    },
    subHeading: {
        fontSize: 15,
        color: "white",
        fontWeight: "500",
    },
    watchNowText: {
        color: "white",
    },
    watchNowButton: {
        paddingVertical: 7,
        paddingHorizontal: 14,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 6,
        marginVertical: 5,
    },
});

import Ionicons from "@expo/vector-icons/Ionicons";
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function TrendingMoviesCard({
    title,
    image,
    genre,
}: {
    title: string;
    image: ImageSourcePropType;
    genre: string;
}) {
    return (
        <View style={styles.outermost}>
            <View style={styles.imageContainer}>
                <Image source={image} style={styles.image} />
            </View>
            <View style={styles.detailsContainer}>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.genre}>{genre}</Text>
                </View>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star-outline" color="gold" />
                    <Text>9.2</Text>
                </View>
            </View>
            <View style={styles.play}>
                <Ionicons name="play-outline" size={21} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outermost: {
        width: "100%",
        height: 100,
        borderWidth: 1,
        borderColor: "#c9c9c9",
        flexDirection: "row",
        padding: 9,
        borderRadius: 8,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowColor: "rgba(0,0,0,0.3)",
        shadowOpacity: 0.17,
        elevation: 5,
    },
    imageContainer: {
        flex: 3,
    },
    image: {
        height: "100%",
        width: "100%",
        borderRadius: 8,
    },
    detailsContainer: {
        flex: 5,
        paddingHorizontal: 5,
        justifyContent: "space-around",
    },
    title: {
        fontWeight: "500",
        fontSize: 15,
    },
    genre: {
        color: "rgba(0,0,0,0.7)",
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 3,
    },
    play: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
    },
});

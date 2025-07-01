import { mainMovieTypes } from "@/app/(tabs)/home";
import { SelectedMovie } from "@/app/lib/contexts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { useContext } from "react";
import {
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function TrendingMoviesCard({
    id,
    title,
    imageUrl,
    genres,
    rating,
    videoUrl,
    date_created,
    time_created,
}: mainMovieTypes) {
    const { setMainMovieData, setMovieType } = useContext(SelectedMovie);
    const router = useRouter();
    const index = genres.indexOf(",");
    const genre = genres.slice(0, index);

    const handlePress = () => {
        const data = {
            id: id,
            title: title,
            imageUrl: imageUrl,
            genres: genres,
            rating: rating,
            videoUrl: videoUrl,
            date_created: date_created,
            time_created: time_created,
        };
        setMainMovieData(data);
        setMovieType("mainMovie");
        setTimeout(() => {
            router.push("/watch");
        });
    };
    return (
        <View style={styles.outermost}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
            </View>
            <View style={styles.detailsContainer}>
                <View>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.genre}>{genre}</Text>
                </View>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star-outline" color="gold" />
                    <Text>{rating}</Text>
                </View>
            </View>
            <Pressable onPress={handlePress} style={styles.play}>
                <Ionicons name="play-outline" size={21} />
            </Pressable>
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
        backgroundColor: "white",
        ...Platform.select({
            ios: {
                shadowOffset: { width: 0, height: 6 },
                shadowColor: "#a9a9a9",
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            web: {
                shadowOffset: { width: 0, height: 6 },
                shadowColor: "#a9a9a9",
                shadowOpacity: 0.3,
                shadowRadius: 5,
            },
            android: {
                elevation: 5,
            },
        }),
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

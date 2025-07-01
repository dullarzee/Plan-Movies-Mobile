import { mainMovieTypes } from "@/app/(tabs)/home";
import { SelectedMovie } from "@/app/lib/contexts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function FeaturedMovieCard({
    id,
    title,
    imageUrl,
    videoUrl,
    date_created,
    time_created,
    genres,
    catchPhrase,
    featuredMovieCardWidth,
    index,
}: mainMovieTypes) {
    const { setMainMovieData, setMovieType } = useContext(SelectedMovie);
    const router = useRouter();
    const handlePress = () => {
        const data = {
            id: id,
            title: title,
            imageUrl: imageUrl,
            videoUrl: videoUrl,
            date_created: date_created,
            time_created: time_created,
            genres: genres,
        };
        setMainMovieData(data);
        setMovieType("mainMovie");
        setTimeout(() => {
            router.push("/watch");
        }, 200);
    };
    return (
        <View
            style={styles.featured}
            onLayout={(event) => {
                featuredMovieCardWidth!.current =
                    event.nativeEvent.layout.width;
            }}
        >
            <Image
                style={styles.featuredImage}
                resizeMode="cover"
                source={{ uri: imageUrl }}
            />
            <LinearGradient
                colors={["rgba(0, 0, 0, 0.75)", "rgba(0, 0, 0, 0)"]}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0.4 }}
                style={styles.featuredImageOverlay}
            >
                <Text style={styles.movieTitle} numberOfLines={2}>
                    <Text
                        style={{
                            color: "gold",
                            fontWeight: "600",
                        }}
                    >
                        Featured:
                    </Text>{" "}
                    {title}
                </Text>
                <View>
                    <Text style={styles.subHeading} numberOfLines={1}>
                        {catchPhrase}
                    </Text>
                </View>
                <TouchableOpacity
                    onPress={handlePress}
                    style={styles.watchNowButton}
                >
                    <Ionicons name="play-outline" size={20} color="white" />
                    <Text style={[styles.watchNowText]}>Watch Now</Text>
                </TouchableOpacity>
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
        justifyContent: "space-between",
        paddingBottom: 15,
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

import { seasonMoviesTypes } from "@/app/(tabs)/home";
import { SelectedMovie } from "@/app/lib/contexts";
import { useRouter } from "expo-router";
import { useContext } from "react";
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SeasonMovieCard({
    title,
    movieImage,
    entireData,
    seasonsLength,
    episodesLength,
}: {
    movieImage: string;
    title: string;
    entireData: seasonMoviesTypes;
    seasonsLength: number;
    episodesLength: number;
}) {
    const { setMovieData } = useContext(SelectedMovie);
    const router = useRouter();
    const handlePress = () => {
        setMovieData(entireData);
        setTimeout(() => {
            router.push("/seasonMovieDetailsScreen");
        }, 200);
    };
    return (
        <TouchableOpacity onPress={handlePress}>
            <View style={styles.outermost}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: movieImage }} />
                </View>
                <View
                    style={{
                        width: 2,
                        backgroundColor: "rgb(245, 133, 42)",
                        height: "90%",
                        //marginTop: 4,
                        alignSelf: "center",
                    }}
                />
                <View style={styles.movieDetails}>
                    <Text style={styles.movieName} numberOfLines={1}>
                        {title}
                    </Text>
                    <Text style={styles.seasonsQuestion}>
                        Seasons:
                        <Text style={styles.seasonsAnswer}>
                            {" "}
                            {seasonsLength}
                        </Text>
                    </Text>
                    <Text style={styles.episodesQuestion}>
                        Episodes:
                        <Text style={styles.episodesAnswer}>
                            {" "}
                            {episodesLength}
                        </Text>
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    outermost: {
        flexDirection: "row",
        width: "100%",
        height: 100,
        borderWidth: 1,
        borderColor: "#c5c5c5",
        borderRadius: 9,
        padding: 12,
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
        gap: 10,
    },
    imageContainer: {
        width: "30%",
        height: "100%",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
    },
    movieDetails: {
        flex: 1,
    },
    movieName: {
        color: "#444444",
        fontSize: 15,
        fontWeight: "600",
    },
    seasonsQuestion: {
        color: "#777777",
        fontSize: 14,
        fontWeight: "500",
    },
    seasonsAnswer: {
        color: "rgb(0, 200,0)",
    },
    episodesQuestion: {
        color: "#777777",
        fontSize: 14,
        fontWeight: "500",
    },
    episodesAnswer: {
        color: "rgb(0,200, 0)",
    },
});

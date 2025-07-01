import { mainMovieTypes } from "@/app/(tabs)/home";
import { SelectedMovie } from "@/app/lib/contexts";
import { useRouter } from "expo-router";
import { useContext } from "react";
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PopularMoviesCard({
    id,
    title,
    genres,
    imageUrl,
    videoUrl,
    date_created,
    time_created,
}: mainMovieTypes) {
    const arr: string[] | undefined = genres?.split(",");
    const { setMainMovieData, setMovieType } = useContext(SelectedMovie);
    const router = useRouter();
    const { width } = Dimensions.get("window");

    const handlePress = () => {
        const data = {
            id: id,
            title: title,
            genres: genres,
            imageUrl: imageUrl,
            videoUrl: videoUrl,
            date_created: date_created,
            time_created: time_created,
        };
        setMainMovieData(data);
        setMovieType("mainMovie");
        setTimeout(() => {
            router.push("/watch");
        }, 300);
    };

    return (
        //<Link href="/watch">
        <TouchableOpacity onPress={handlePress}>
            <View
                style={[
                    styles.outermost,
                    { minWidth: width < 370 ? 150 : 170 },
                ]}
            >
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{ uri: imageUrl }} />
                </View>
                <View>
                    <Text style={styles.movieTitle} numberOfLines={1}>
                        {title}
                    </Text>
                </View>
                <Text style={styles.genre}>{arr[0]}</Text>
            </View>
        </TouchableOpacity>
        // </Link>
    );
}

const styles = StyleSheet.create({
    outermost: {
        //flexBasis: 140,
        flexShrink: 0,
        flex: 1,
        //width: 150,
        flexGrow: 1,
        maxWidth: 200,
        minHeight: 190,
        maxHeight: 210,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: "#e1e1e1",
        padding: 9,
    },
    imageContainer: {
        width: "100%",
        height: "70%",
        borderRadius: 9,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 9,
    },
    movieTitle: {
        fontSize: 14,
    },
    genre: {
        color: "#818181",
        fontSize: 13,
    },
});

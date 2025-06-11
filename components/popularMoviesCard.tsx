import { Image, StyleSheet, Text, View } from "react-native";

export default function PopularMoviesCard() {
    return (
        <View style={styles.outermost}>
            <View style={styles.imageContainer}>
                <Image
                    style={styles.image}
                    source={require("../assets/images/planktonThemovie.jpg")}
                />
            </View>
            <View>
                <Text style={styles.movieTitle}>Plankton, The Movie</Text>
            </View>
            <Text style={styles.genre}>Animation</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    outermost: {
        flexBasis: 140,
        flexGrow: 1,
        maxWidth: 200,
        height: 180,
        //maxHeight: 210,
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

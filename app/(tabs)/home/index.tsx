import { featuredMovies } from "@/app/lib/data";
import ContinueWatchingCard from "@/components/continueWatchingCard";
import FeaturedMovieCard from "@/components/featuredMovieCard";
import PopularMoviesCard from "@/components/popularMoviesCard";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function Home() {
    const [index, setIndex] = useState(0);
    const [index2, setIndex2] = useState("");
    const [greetings, setGreetings] = useState("");

    const time = Number(new Date().toTimeString().slice(0, 2));

    /*useEffect(()=>{
        setTimeout(() => {
            setIndex((prev) => (prev + 1));
            //setIndex2("-" + index + "00%");
        }, 400);
    },[index]);*/

    useEffect(() => {
        if (time > 0 && time < 12) {
            setGreetings("Good Morning");
        } else if (time > 12 && time < 18) {
            setGreetings("Good Afternoon");
        } else if (time > 18 && time < 24) {
            setGreetings("Good Evening");
        }
    }, [time]);

    return (
        <View style={styles.outermost}>
            <ScrollView style={styles.outermost2}>
                <View style={styles.greetingsContainer}>
                    <view>
                        <View>
                            <Text style={styles.greeting}>{greetings}</Text>
                        </View>
                        <Text style={styles.subGreeting}>
                            What would you like to watch?
                        </Text>
                    </view>
                    <View style={styles.user}></View>
                </View>
                <View style={styles.featuredMoviesContainer}>
                    <View
                        style={[
                            styles.featuredMoviesCarousel,
                            {
                                transform: [
                                    { translateX: index },
                                    { translateY: 0 },
                                ],
                            },
                        ]}
                    >
                        {featuredMovies.map((it) => {
                            return <FeaturedMovieCard key={it.id} {...it} />;
                        })}
                    </View>
                </View>

                <View style={{ height: 8 }}></View>
                <View>
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: "500",
                            marginBottom: 10,
                        }}
                    >
                        Continue Watching
                    </Text>
                    <ScrollView
                        style={styles.continueWatchingContainer}
                        horizontal
                        contentContainerStyle={{ columnGap: 8 }}
                    >
                        <ContinueWatchingCard />
                        <ContinueWatchingCard />
                        <ContinueWatchingCard />
                        <ContinueWatchingCard />
                    </ScrollView>
                </View>

                <View style={{ height: 20 }}></View>

                <View>
                    <Text
                        style={{
                            fontSize: 17,
                            fontWeight: "500",
                            marginBottom: 10,
                        }}
                    >
                        Popular Movies
                    </Text>
                </View>

                <View style={styles.popularMoviesContainer}>
                    <PopularMoviesCard />
                    <PopularMoviesCard />
                    <PopularMoviesCard />
                    <PopularMoviesCard />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    outermost: {
        backgroundColor: "white",
        flex: 1,
        paddingBottom: 65,
    },
    outermost2: {
        flex: 1,
        padding: 13,
    },
    greetingsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    greeting: {
        fontSize: 27,
        fontWeight: "700",
    },
    subGreeting: {
        color: "gray",
        fontSize: 16,
    },
    user: {
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "#e9e9e9",
    },
    featuredMoviesContainer: {
        overflow: "hidden",
    },
    featuredMoviesCarousel: {
        flexDirection: "row",
        //transform: [{ translateX: `100%` }, { translateY: 0 }],
    },
    continueWatchingContainer: {
        width: "100%",
        height: 150,
        flexDirection: "row",
    },
    popularMoviesContainer: {
        justifyContent: "center",
        gap: 10,
        flexDirection: "row",
        flexWrap: "wrap",
    },
});

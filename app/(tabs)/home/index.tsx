import Supabase from "@/app/lib/supabase";
import ContinueWatchingCard from "@/components/continueWatchingCard";
import FeaturedMovieCard from "@/components/featuredMovieCard";
import { HomePageLoadingSkeleton } from "@/components/loadingSkeletons";
import PopularMoviesCard from "@/components/popularMoviesCard";
import SeasonMovieCard from "@/components/seasonMovieCard";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import {
    Animated,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export interface mainMovieTypes {
    //data fetched from database
    id: number | null;
    title: string;
    genres: string;
    rating?: number;
    videoUrl: string;
    imageUrl: string;
    date_created: string;
    time_created: string;
    catchPhrase?: string;
    isTrending?: boolean;
    isPopular?: boolean;
    isFeatured?: boolean;

    //data(types) not from database but needed to satisfy typescript
    featuredMovieCardWidth?: RefObject<number>;
    index?: number;
}

type mainMovieState = {
    all: mainMovieTypes[];
    featuredMovies: mainMovieTypes[];
    trendingMovies: mainMovieTypes[];
    popularMovies: mainMovieTypes[];
};
export interface seasonMoviesTypes {
    id: number;
    imageUrl: string;
    title: string;
    MSM_seasons: {
        id: number;
        season: number;
        title: string;
        MSM_episodes: {
            id: number;
            title: string;
            episode: number;
            videoUrl: string;
            date_created: string;
            timeCreated: string;
        }[];
    }[];
}

export default function Home() {
    const translateAnim = useRef<Animated.Value>(new Animated.Value(0)).current;
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [threshold, setThreshold] = useState<number>(6);
    const [loading, setLoading] = useState({
        mainMovies: true,
        seasonMovies: true,
    });
    const [mainMovies, setMainMovies] = useState<mainMovieState>({
        all: [],
        featuredMovies: [],
        popularMovies: [],
        trendingMovies: [],
    });
    const [seasonMovies, setSeasonMovies] =
        useState<PostgrestSingleResponse<seasonMoviesTypes[]>>();
    const translateTimeoutRef = useRef(0);
    const featuredMovieCardWidth = useRef<number>(0);
    const episodesCummulative = useRef<number>(0);
    const greetingsRef = useRef<string>("");

    useEffect(() => {
        Animated.timing(translateAnim, {
            toValue: -currentIndex * featuredMovieCardWidth.current,
            duration: 500,
            useNativeDriver: Platform.OS !== "web" && true,
        }).start();
    }, [currentIndex]);

    useEffect(() => {
        clearTimeout(translateTimeoutRef.current);
        translateTimeoutRef.current = setTimeout(() => {
            if (mainMovies.featuredMovies.length > 0) {
                setCurrentIndex(
                    (prev) => (prev + 1) % mainMovies.featuredMovies.length
                );
            }
        }, 3000);
    }, [currentIndex, mainMovies.featuredMovies.length]);

    useEffect(() => {
        const fetchSeasonMovies = async () => {
            try {
                const data = await Supabase.from("mobile-season-movies")
                    .select(`*, MSM_seasons(*, MSM_episodes(*))`)
                    .order("title", { ascending: false })
                    .order("season", {
                        referencedTable: "MSM_seasons",
                        ascending: true,
                    })
                    .order("episode", {
                        referencedTable: "MSM_seasons.MSM_episodes",
                        ascending: true,
                    });
                setSeasonMovies(
                    () => data as PostgrestSingleResponse<seasonMoviesTypes[]>
                );
            } catch (error) {
                console.log("error fetching seasons movies:", error);
            }
        };
        fetchSeasonMovies();
    }, []);

    useEffect(() => {
        const fetchMainMovies = async () => {
            try {
                const { data } = await Supabase.from(
                    "mobile-main-table"
                ).select("*");

                const allData: mainMovieTypes[] = data as mainMovieTypes[];
                let trending: mainMovieTypes[] | null = allData.filter(
                    (movie) => movie.isTrending
                );
                let popular: mainMovieTypes[] | null = allData.filter(
                    (movie) => movie.isPopular
                );
                let featured: mainMovieTypes[] | null = allData.filter(
                    (movie) => movie.isFeatured
                );

                setMainMovies(() => ({
                    all: allData,
                    featuredMovies: [...featured],
                    trendingMovies: [...trending],
                    popularMovies: [...popular],
                }));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(() => ({
                    mainMovies: false,
                    seasonMovies: false,
                }));
            }
        };
        fetchMainMovies();
    }, []);

    const time = Number(new Date().toTimeString().slice(0, 2));
    useEffect(() => {
        console.log("time:", time);
        if (time > 0 && time < 12) {
            greetingsRef.current = "Good Morning";
        } else if (time > 12 && time < 18) {
            greetingsRef.current = "Good Afternoon";
        } else if (time > 18 && time < 24) {
            greetingsRef.current = "Good Evening";
        }
    });

    const calcEpisodes = useCallback((it: seasonMoviesTypes): number => {
        let cummulative: number = 0;
        it.MSM_seasons.map((episode) => {
            episodesCummulative.current += episode.MSM_episodes.length;
            cummulative = episodesCummulative.current;
        });
        episodesCummulative.current = 0;
        return cummulative;
    }, []);

    const handleMoreButton = () => {
        setThreshold((prev) => prev + 2);
    };

    if (!loading.mainMovies) {
        return (
            <View style={styles.outermost}>
                <ScrollView style={styles.outermost2}>
                    <View style={styles.greetingsContainer}>
                        <View>
                            <View>
                                <Text style={styles.greeting}>
                                    {greetingsRef.current}
                                </Text>
                            </View>
                            <Text style={styles.subGreeting}>
                                What would you like to watch?
                            </Text>
                        </View>
                        <View style={styles.user}></View>
                    </View>
                    <View style={styles.featuredMoviesContainer}>
                        <Animated.View
                            style={[
                                styles.featuredMoviesCarousel,
                                {
                                    transform: [
                                        { translateX: translateAnim },
                                        { translateY: 0 },
                                    ],
                                },
                            ]}
                        >
                            {mainMovies.featuredMovies.map((it, index) => {
                                return (
                                    <FeaturedMovieCard
                                        key={it.id}
                                        {...it}
                                        featuredMovieCardWidth={
                                            featuredMovieCardWidth
                                        }
                                        index={index}
                                    />
                                );
                            })}
                        </Animated.View>
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
                    <View>
                        <View style={styles.popularMoviesContainer}>
                            {mainMovies.popularMovies
                                .slice(0, threshold)
                                .map((movie) => {
                                    return (
                                        <PopularMoviesCard
                                            key={movie.id}
                                            {...movie}
                                        />
                                    );
                                })}
                        </View>
                        {!(threshold >= mainMovies.popularMovies.length) && (
                            <TouchableOpacity onPress={handleMoreButton}>
                                <Text style={styles.moreButton}>More</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{ height: 30 }} />
                    <View>
                        <View>
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: "500",
                                    marginBottom: 10,
                                }}
                            >
                                Season Movies
                            </Text>
                        </View>
                        <View style={styles.seasonMoviesContainer}>
                            {seasonMovies?.data?.map((it) => (
                                <SeasonMovieCard
                                    key={it.id}
                                    entireData={it}
                                    title={it.title}
                                    movieImage={it.imageUrl}
                                    seasonsLength={it.MSM_seasons.length}
                                    episodesLength={calcEpisodes(it)}
                                />
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    } else {
        return <HomePageLoadingSkeleton />;
    }
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
    },
    continueWatchingContainer: {
        width: "100%",
        height: 178,
        flexDirection: "row",
        paddingVertical: 14,
    },
    popularMoviesContainer: {
        justifyContent: "center",
        gap: 10,
        flexDirection: "row",
        flexWrap: "wrap",
    },
    seasonMoviesContainer: {
        justifyContent: "center",
        gap: 10,
    },
    moreButton: {
        flexDirection: "row",
        color: "white",
        fontSize: 18,
        backgroundColor: "rgb(245, 133, 42)",
        borderRadius: 9,
        paddingVertical: 9,
        paddingHorizontal: 15,
        width: "40%",
        textAlign: "center",
        alignSelf: "flex-end",
        marginVertical: 14,
    },
});

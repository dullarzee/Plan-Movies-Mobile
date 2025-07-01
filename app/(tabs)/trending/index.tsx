import Supabase from "@/app/lib/supabase";
import TrendingMoviesCard from "@/components/trendingMoviesCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { Dispatch, useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { mainMovieTypes } from "../home";

export default function TrendingScreen() {
    const [trendingData, setTrendingData] = useState<mainMovieTypes[]>([]);
    const [threshold, setThreshold] = useState<number>(6);

    useEffect(() => {
        const fetchIt = async () => {
            try {
                const { data } = await Supabase.from("mobile-main-table")
                    .select("*")
                    .eq("isTrending", true);
                setTrendingData(() => data as mainMovieTypes[]);
                console.log("trending:", data);
                console.log("trendingData state:", trendingData);
            } catch (error) {
                console.error("failed in getting trending movies:", error);
            }
        };
        fetchIt();
    }, []);

    return (
        <View style={styles.outermost}>
            <FlatList
                data={trendingData.slice(0, threshold)}
                renderItem={({ item }) => <TrendingMoviesCard {...item} />}
                contentContainerStyle={styles.CCS1}
                ListHeaderComponent={<TrendingListHeader />}
                ListFooterComponent={
                    <TrendingListFooter
                        threshold={threshold}
                        trendingData={trendingData}
                        setThreshold={setThreshold}
                    />
                }
            />
        </View>
    );
}

export function TrendingListHeader() {
    return (
        <View style={styles.trendingListHeaderContainer}>
            <Text style={{ fontSize: 25, fontWeight: "bold" }}>
                Trending Now
            </Text>
            <View style={styles.hotBadge}>
                <Ionicons name="trending-up" size={14} color="gold" />
                <Text>Hot</Text>
            </View>
        </View>
    );
}
export function TrendingListFooter({
    threshold,
    trendingData,
    setThreshold,
}: {
    threshold: number;
    trendingData: mainMovieTypes[];
    setThreshold: Dispatch<React.SetStateAction<number>>;
}) {
    if (threshold !== trendingData.length)
        return (
            <LinearGradient
                colors={["rgb(206, 25, 252)", "rgb(243, 14, 193)"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.footerOutermost}
            >
                <Text style={styles.footerText1}>Trending This Week</Text>
                <Text style={styles.footerText2}>
                    Don&apos;t miss out on the most popular movies everyone is
                    talking about!
                </Text>
                <Pressable onPress={() => setThreshold(trendingData.length)}>
                    <Text style={styles.footerButton}>View All Trending</Text>
                </Pressable>
            </LinearGradient>
        );
}

const styles = StyleSheet.create({
    outermost: {
        flex: 1,
        backgroundColor: "white",
        marginBottom: 70,
    },
    CCS1: {
        rowGap: 13,
        padding: 14,
    },
    trendingListHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    hotBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: "#c5c5c5",
        borderRadius: 9999,
        columnGap: 5,
    },
    footerOutermost: {
        height: 150,
        width: "100%",
        borderRadius: 8,
        padding: 14,
        alignItems: "flex-start",
    },
    footerText1: {
        fontWeight: "bold",
        fontSize: 17,
        color: "white",
        marginBottom: 9,
    },
    footerText2: {
        fontSize: 14,
        color: "white",
    },
    footerButton: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        backgroundColor: "white",
        borderRadius: 7,
        marginVertical: 7,
    },
});

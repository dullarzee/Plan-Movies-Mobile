import { trendingMovies } from "@/app/lib/data";
import TrendingMoviesCard from "@/components/trendingMoviesCard";
import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

export default function TrendingScreen() {
    return (
        <View style={styles.outermost}>
            <FlatList
                data={trendingMovies.slice(0, 5)}
                renderItem={({ item }) => <TrendingMoviesCard {...item} />}
                contentContainerStyle={styles.CCS1}
                ListHeaderComponent={<TrendingListHeader />}
                ListFooterComponent={<TrendingListFooter />}
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
export function TrendingListFooter() {
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
            <Pressable>
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

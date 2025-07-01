import BackButton from "@/components/backButton";
import { useRouter } from "expo-router";
import { useContext, useRef } from "react";
import {
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SelectedMovie } from "./lib/contexts";

const Episode = ({ item }: { item: string }) => {
    const router = useRouter();
    const { selectedSeason, setEpisodeData, setMovieType } =
        useContext(SelectedMovie);

    //seperating concatenated id from episode string
    let array: string[] = item.split(" ");
    const id: number = Number(array[2]);
    array.pop();
    const episode = array.join(" ");

    const handleEpisodePress = async (item: number) => {
        selectedSeason.MSM_seasons.map((seasons) => {
            seasons.MSM_episodes.map((episode) => {
                if (episode.id === id) {
                    setEpisodeData({
                        id: episode.id,
                        title: episode.title,
                        episode: episode.episode,
                        videoUrl: episode.videoUrl,
                        date_created: episode.date_created,
                        time_created: episode.timeCreated,
                        imageUrl: selectedSeason.imageUrl,
                    });
                    setMovieType("seasonMovie");
                    setTimeout(() => {
                        router.push("/watch");
                    }, 200);
                }
            });
        });
    };
    return (
        <TouchableOpacity
            onPress={() => handleEpisodePress(id)}
            style={styles.episodeCont}
        >
            <Text style={styles.episode}>{episode}</Text>
        </TouchableOpacity>
    );
};

const SectionHeader = ({ season }: { season: string }) => {
    return (
        <View
            style={{
                width: "100%",
                backgroundColor: "#e7e7e7",
                paddingVertical: 5,
                paddingHorizontal: 7,
                borderRadius: 5,
            }}
        >
            <Text style={styles.sectionHeader}>{season}</Text>
        </View>
    );
};
const ItemSeperator: React.FC = () => {
    return (
        <View
            style={{
                width: "92%",
                alignSelf: "center",
                height: 1,
                backgroundColor: "#d7d7d7",
            }}
        />
    );
};
export default function SeasonMovieDetails() {
    //accessing saved movie context for clicked season movie
    const { selectedSeason } = useContext(SelectedMovie);
    //ref for storing data from remote database, rearranged so to fit sectionlist criteria
    const reArrangedDataRef = useRef([{ season: 0, data: [""] }]);
    //iterator for doing the sorting/re-arranging
    selectedSeason.MSM_seasons.map((season, index) => {
        const Season: number = season.season;
        let arr: string[] = new Array(season.MSM_episodes.length).fill("");
        season.MSM_episodes.map((episode, index) => {
            arr[index] = `Episode ${episode.episode} ${episode.id}`;
        });
        const episodes: string[] = [...arr];
        reArrangedDataRef.current[index] = { season: Season, data: episodes };
    });

    //as per the limitations of using a sectionlist, i had to concatenate the id
    // of each episodes, that will be used to retrieve the data for the episode on click
    //  of the episode, to the end of each episodes and later extracted it from the episode string
    return (
        <View style={styles.outermost}>
            <View style={{ paddingTop: 13, paddingLeft: 13 }}>
                <BackButton />
            </View>
            {
                <SectionList
                    sections={reArrangedDataRef.current}
                    renderItem={({ item }) => <Episode item={item} />}
                    renderSectionHeader={({ section }) => (
                        <SectionHeader season={`Season ${section.season}`} />
                    )}
                    keyExtractor={(item) => item}
                    ListHeaderComponent={
                        <Text style={styles.movieName}>
                            {selectedSeason.title}
                        </Text>
                    }
                    ItemSeparatorComponent={() => <ItemSeperator />}
                    contentContainerStyle={{ padding: 14 }}
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    outermost: {
        flex: 1,
    },
    movieName: {
        fontSize: 24,
        fontWeight: "600",
        color: "red",
        marginBottom: 8,
    },
    sectionHeader: {
        fontSize: 19,
        fontWeight: "600",
        color: "#555555",
    },
    episodeCont: {
        padding: "2.5%",
        width: "95%",
        alignSelf: "center",
    },
    episode: {
        fontSize: 15,
        color: "#999999",
        fontWeight: "500",
    },
});

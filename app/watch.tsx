import BackButton from "@/components/backButton";
import VideoProgressBar from "@/components/videoProgressBar";
import VolumeBar from "@/components/volumeBar";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEventListener } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Easing,
    GestureResponderEvent,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SelectedMovie } from "./lib/contexts";

//i noticed when there is dragging to seek to a particular time,
// the state resets to their default value so if u see code you dont understand,
// i might be using some logic to circumvent that problem

export type myVideoPlayerStates = {
    isPlaying: boolean;
    volume: number;
    duration: number;
    currentTime: number;
    isLoading: boolean;
    isFullScreen: boolean;
    isMuted: boolean;
    isDragging: boolean;
};

export let setMyVideoPlayerStates: React.Dispatch<
    React.SetStateAction<{
        isPlaying: boolean;
        volume: number;
        duration: number;
        currentTime: number;
        isLoading: boolean;
        isFullScreen: boolean;
        isMuted: boolean;
        isDragging: boolean;
    }>
>;

export default function Watch() {
    const { selectedEpisode, movieType, mainMovieSelected } =
        useContext(SelectedMovie);
    const [videoPlayerStates, setVideoPlayerStates] = useState({
        isPlaying: false,
        volume: 1.0,
        duration: 0,
        currentTime: 0,
        isLoading: true,
        isFullScreen: false,
        isMuted: false,
        isDragging: false,
    });

    const [visible, setVisible] = useState<boolean>(true);
    const opacity = useRef(new Animated.Value(1)).current;
    const hideTimeoutRef = useRef<NodeJS.Timeout | null | number>(null);
    const playPauseRef = useRef([]);
    const [likeStatus, setLikeStatus] = useState<string>("");
    const videoKey = useRef("video player").current;

    //initializing a video player from expo-video
    const player = useVideoPlayer(
        movieType === "seasonMovie"
            ? selectedEpisode.videoUrl
            : mainMovieSelected.videoUrl,
        //"https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_10mb.mp4" ,
        (player) => {
            player.play();
            player.volume = 1.0;
            player.muted = false;
            player.loop = true;
        }
    );

    // Fade in controls
    const showControls = () => {
        setVisible(true);
        Animated.timing(opacity, {
            toValue: 1,
            duration: 250,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();

        // Reset hide timeout
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        if (player.status === "readyToPlay" && player.playing)
            hideTimeoutRef.current = setTimeout(hideControls, 3000); // 3 seconds
    };

    // Fade out controls
    const hideControls = () => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
        }).start(() => setVisible(false));
    };

    // Show on first mount
    useEffect(() => {
        showControls();
        if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

        if (
            !player.playing ||
            player.status !== "readyToPlay" ||
            videoPlayerStates.isDragging
        )
            opacity.setValue(1);
        else {
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);

            hideTimeoutRef.current = setTimeout(hideControls, 3000); // 3 seconds
        }

        return () => {
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, [player.playing, player.status, videoPlayerStates.isDragging]);

    const handleOverlayPress = (e: GestureResponderEvent) => {
        e.stopPropagation();
        showControls();
        if (!player.playing)
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };

    //a ref to the video player
    const videoRef = useRef(null);
    const overlayRef = useRef<LinearGradient>(null);
    console.log("component rendered");

    //function for formatting time into a usable format
    const formatCurrentTime = (): string => {
        if (player.currentTime > 3600 && player.currentTime < 86400) {
            const hours = Math.floor(player.currentTime / 3600);
            const minutes = Math.floor((player.currentTime % 3600) / 60);
            const seconds = Math.floor((player.currentTime % 3600) % 60);
            return `${String(hours).padStart(2, "0")}:${String(
                minutes
            ).padStart(2, "00")}:${String(seconds).padStart(2, "0")}`;
        } else if (player.currentTime <= 3600) {
            let hours: number = Math.floor(player.currentTime / 60);
            let seconds: number = Math.floor(player.currentTime % 60);
            if (seconds === 60) {
                hours = hours + 1;
                seconds = 0;
            }
            return `${String(hours).padStart(2, "00")}:${String(
                seconds
            ).padStart(2, "0")}`;
        } else {
            return "";
        }
    };

    //function for formatting duration of video into a usable format
    const formatDuration = (): string => {
        if (player.duration > 3600 && player.duration < 86400) {
            const hours = Math.floor(player.duration / 3600);
            const minutes = Math.floor((player.duration % 3600) / 60);
            const seconds = Math.floor((player.duration % 3600) % 60);
            return `${String(hours).padStart(2, "0")}:${String(
                minutes
            ).padStart(2, "00")}:${String(seconds).padStart(2, "0")}`;
        } else if (player.duration <= 3600) {
            const minutes = Math.floor(player.duration / 60);
            const seconds = Math.floor(player.duration % 60);
            return `${String(minutes).padStart(2, "00")}:${String(
                seconds
            ).padStart(2, "0")}`;
        }
        return "00:00";
    };

    const formatDate = (date: string): string => {
        const arr = date.split("-").reverse();
        //converting day
        let arr0: number[] = new Array(3).fill(0);
        arr0[0] = Number(arr[0]);
        arr0[1] = Number(arr[1]);
        arr0[2] = Number(arr[2]);
        let temp;
        if (arr0[0] === 1) temp = `${arr0[0]}st`;
        else if (arr0[0] === 2) temp = `${arr0[0]}nd`;
        else if (arr0[0] === 3) temp = `${arr0[0]}rd`;
        else temp = `${arr0[0]}th`;

        //converting month
        arr0[1] = Number(arr[1]);
        let temp1;
        if (arr0[1] === 1) temp1 = "Jan";
        else if (arr0[1] === 2) temp1 = "Feb";
        else if (arr0[1] === 3) temp1 = "Mar";
        else if (arr0[1] === 4) temp1 = "Apr";
        else if (arr0[1] === 5) temp1 = "May";
        else if (arr0[1] === 6) temp1 = "Jun";
        else if (arr0[1] === 7) temp1 = "Jul";
        else if (arr0[1] === 8) temp1 = "Aug";
        else if (arr0[1] === 9) temp1 = "Sep";
        else if (arr0[1] === 10) temp1 = "Oct";
        else if (arr0[1] === 11) temp1 = "Nov";
        else if (arr0[1] === 12) temp1 = "Dec";
        return `${temp} ${temp1} ${arr0[2]}`;
    };

    //event listener for status changes like changes in loading states e.t.c
    useEventListener(player, "statusChange", (payload) => {
        if (payload.status !== "readyToPlay") {
            console.log("not ready to play");
            setVideoPlayerStates((prev) => ({
                ...prev,
                isLoading: true,
                duration: player.duration,
            }));
            opacity.setValue(1);
        } else {
            setVideoPlayerStates((prev) => ({
                ...prev,
                isLoading: false,
                duration: player.duration,
            }));
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
            hideTimeoutRef.current = setTimeout(showControls, 3000);
        }
    });

    return (
        <View style={styles.outermost}>
            <View style={styles.headerBar}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <BackButton />
                    <Text style={styles.logo}>Plan Movies</Text>
                </View>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={21} color="#898989" />
                    <View style={styles.avatar}></View>
                </View>
            </View>

            <View
                style={styles.videoContainer}
                onStartShouldSetResponder={() => true}
                collapsable={false}
            >
                <VideoView
                    ref={videoRef}
                    key={videoKey}
                    player={player}
                    style={styles.video}
                    contentFit="contain"
                    nativeControls={false}
                ></VideoView>
                <TouchableOpacity
                    style={[styles.pressableOverlay]}
                    onPress={handleOverlayPress}
                >
                    <LinearGradient
                        ref={overlayRef}
                        style={styles.videoOverlay}
                        colors={[
                            "rgba(25,25,25, 0.9)",
                            "rgba(220,220, 220, 0)",
                        ]}
                        start={{ x: 0.5, y: 1 }}
                        end={{ x: 0.5, y: 0.8 }}
                    >
                        <Animated.View
                            pointerEvents={visible ? "auto" : "none"}
                            style={[
                                styles.animatedOverlay,
                                { opacity: opacity },
                            ]}
                        >
                            <View style={styles.loadingIndicatorContainer}>
                                {player.status !== "readyToPlay" ? (
                                    <ActivityIndicator
                                        size={30}
                                        color="#e50000"
                                    />
                                ) : (
                                    <TouchableOpacity
                                        onPress={() =>
                                            player.playing === false
                                                ? player.play()
                                                : player.pause()
                                        }
                                        style={styles.largePlayPauseButton}
                                    >
                                        {player.playing ? (
                                            <Ionicons
                                                name="pause"
                                                size={30}
                                                color="#f5f5f5"
                                            />
                                        ) : (
                                            <Ionicons
                                                name="play"
                                                size={30}
                                                color="#f5f5f5"
                                            />
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>
                            <VideoProgressBar
                                videoPlayerStates={videoPlayerStates}
                                setVideoPlayerStates={setVideoPlayerStates}
                                player={player}
                            />

                            <View style={styles.controlsContainer}>
                                <View
                                    style={{
                                        justifyContent: "space-between",
                                        flexDirection: "row",
                                        width: "23.5%",
                                    }}
                                >
                                    <Ionicons
                                        name="play-skip-back"
                                        size={18}
                                        color="white"
                                    />
                                    <TouchableOpacity
                                        ref={playPauseRef.current[1]}
                                        onPress={() =>
                                            player.playing === false
                                                ? player.play()
                                                : player.pause()
                                        }
                                    >
                                        {player.playing === false ? (
                                            <Ionicons
                                                name="play"
                                                size={18}
                                                color="white"
                                            />
                                        ) : (
                                            <Ionicons
                                                name="pause"
                                                size={18}
                                                color="white"
                                            />
                                        )}
                                    </TouchableOpacity>
                                    <Ionicons
                                        name="play-skip-forward"
                                        size={18}
                                        color="white"
                                    />
                                </View>

                                <VolumeBar player={player} />

                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        columnGap: 10,
                                    }}
                                >
                                    <View style={styles.timeContainer}>
                                        <Text style={styles.currentTime}>
                                            {formatCurrentTime()}
                                        </Text>
                                        <Text style={{ color: "white" }}>
                                            /
                                        </Text>
                                        <Text style={styles.duration}>
                                            {formatDuration()}
                                        </Text>
                                    </View>
                                    <Ionicons
                                        name="settings-outline"
                                        size={18}
                                        color="white"
                                    />
                                    <MaterialIcons
                                        name="fullscreen"
                                        size={23}
                                        color="white"
                                    />
                                </View>
                            </View>
                        </Animated.View>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <View style={{ marginVertical: 10 }}>
                <Text style={styles.mainTitle}>
                    {movieType === "seasonMovie"
                        ? selectedEpisode.title
                        : mainMovieSelected.title}
                </Text>
                {movieType === "seasonMovie" &&
                    selectedEpisode.episode !== null && (
                        <Text
                            style={{ color: "rgb(220, 0, 0)" }}
                        >{`Episode ${selectedEpisode.episode}`}</Text>
                    )}
            </View>
            <View style={styles.extraInfoContainer}>
                <View style={styles.avatarPoster}>
                    <Image
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 9999,
                        }}
                        source={{
                            uri:
                                movieType === "seasonMovie"
                                    ? selectedEpisode.imageUrl
                                    : mainMovieSelected.imageUrl,
                        }}
                    />
                </View>
                <View>
                    <Text style={{ color: "#888888", fontSize: 14 }}>
                        {movieType === "seasonMovie"
                            ? formatDate(selectedEpisode.date_created)
                            : formatDate(mainMovieSelected.date_created)}
                    </Text>
                    <Text
                        style={{
                            color: "#888888",
                            fontSize: 11,
                        }}
                    >
                        {movieType === "seasonMovie"
                            ? selectedEpisode.time_created
                            : mainMovieSelected.time_created}
                    </Text>
                </View>
                <View style={styles.likeUnlikeContainer}>
                    <TouchableOpacity onPress={() => setLikeStatus("liked")}>
                        <Ionicons
                            name="thumbs-up"
                            color={likeStatus === "liked" ? "#d70000" : "white"}
                            size={20}
                        />
                    </TouchableOpacity>
                    <View
                        style={{
                            borderWidth: 1,
                            borderColor: "#666666",
                            height: "100%",
                            width: 0,
                        }}
                    ></View>
                    <TouchableOpacity onPress={() => setLikeStatus("disliked")}>
                        <Ionicons
                            name="thumbs-down"
                            color={
                                likeStatus === "disliked" ? "#d70000" : "white"
                            }
                            size={20}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={{ flexDirection: "row" }}>
                <View style={styles.shareContainer}>
                    <Ionicons name="share-outline" color={"white"} size={20} />
                    <Text style={{ color: "white" }}>Share</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outermost: {
        flex: 1,
        padding: 14,
        backgroundColor: "#f5f5f5",
    },
    headerBar: {
        flexDirection: "row",
        height: 40,
        width: "100%",
        justifyContent: "space-between",
    },
    logo: {
        fontSize: 19,
        fontWeight: "500",
        color: "rgba(220, 0, 0, 1)",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 10,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 9999,
        backgroundColor: "#c9c9c9",
    },
    videoContainer: {
        position: "relative",
        height: 190,
        justifyContent: "center",
        borderRadius: 12,
        marginTop: 12,
        overflow: "hidden",
        zIndex: 2,
    },
    video: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
        opacity: 1,
    },
    videoOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: 12,
        justifyContent: "flex-end",
        zIndex: 20,
        opacity: 1,
    },
    animatedOverlay: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    },
    pressableOverlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    controlsContainer: {
        flexDirection: "row",
        height: 40,
        width: "100%",
        alignItems: "center",
        columnGap: 10,
        justifyContent: "space-between",
        paddingHorizontal: "5%",
    },
    volumeContainer: {
        width: "28%",
        flexDirection: "row",
        alignItems: "center",
    },
    volumeBar: {
        flexDirection: "row",
        width: "80%",
        height: 4,
        backgroundColor: "#b9b9b9",
        alignItems: "center",
    },
    volumeSlider: {
        width: 10,
        height: 10,
        borderRadius: 9999,
        backgroundColor: "white",
    },
    timeContainer: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 2,
        color: "white",
        fontWeight: "400",
    },
    currentTime: {
        color: "white",
        fontWeight: "400",
    },
    duration: {
        color: "white",
        fontWeight: "400",
    },
    loadingIndicatorContainer: {
        height: "70%",
        justifyContent: "center",
        alignItems: "center",
    },
    largePlayPauseButton: {
        padding: 10,
        borderRadius: 9999,
        width: 50,
        height: 50,
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    mainTitle: {
        fontSize: 21,
        color: "#333333",
        fontWeight: "500",
    },
    extraInfoContainer: {
        flexDirection: "row",
        columnGap: 10,
        alignItems: "center",
    },
    avatarPoster: {
        borderRadius: 9999,
        width: 40,
        height: 40,
        backgroundColor: "#d5d5d5",
        marginVertical: 10,
        borderColor: "#c90000",
    },
    likeUnlikeContainer: {
        flexDirection: "row",
        padding: 8,
        backgroundColor: "#b2b2b2",
        borderRadius: 9999,
        columnGap: 15,
    },
    shareContainer: {
        flexDirection: "row",
        backgroundColor: "#a100f9",
        borderRadius: 9999,
        padding: 7,
        alignItems: "center",
        columnGap: 3,
    },
});

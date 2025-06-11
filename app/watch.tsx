import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEventListener } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    PanResponder,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function Watch() {
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
    const [progressWidth, setProgressWidth] = useState(0);
    const [dragValue, setDragValue] = useState(0);
    const accumulatedDragValueRef = useRef(0);

    //initializing a video player from expo-video
    const player = useVideoPlayer(
        "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_10mb.mp4" /*require("../assets/videos/SampleVideo_720x480_5mb.mp4")*/,
        (player) => {
            player.play();
            player.volume = 1.0;
            player.muted = false;
            player.loop = true;
        }
    );
    useEffect(() => {
        if (dragValue < 0)
            setProgressWidth((prevWidth) => Math.max(prevWidth - dragValue, 0));
        else if (dragValue > 0)
            setProgressWidth((prevWidth) =>
                Math.min(prevWidth + dragValue, 100)
            );
    }, [dragValue]);

    //a ref to the video player
    const videoRef = useRef(null);

    //A ref for holding the progress bar width after the onLayout event has fired
    const progressBarWidth = useRef<number>(0);

    //a panresponder configuration for initialing the progress bar thumb/slider to respond to drag gestures
    const videoProgressPan = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e) => {
                setVideoPlayerStates({
                    ...videoPlayerStates,
                    isDragging: true,
                });
                console.log("access granted");
                const touchX = e.nativeEvent.locationX;
                const percentage = Math.max(
                    0,
                    Math.min(100, (touchX / progressBarWidth.current) * 100)
                );
                setDragValue(() => percentage);
            },

            onPanResponderMove: (e) => {
                console.log(e.nativeEvent.locationX);
                const touchX = e.nativeEvent.locationX;
                const percentage = (touchX / progressBarWidth.current) * 100;
                setDragValue(() => percentage);
                accumulatedDragValueRef.current =
                    accumulatedDragValueRef.current + percentage;
                console.log(accumulatedDragValueRef.current);
                console.log("drag value:", dragValue);
            },

            onPanResponderRelease: () => {
                console.log("touch released");
                setVideoPlayerStates({
                    ...videoPlayerStates,
                    isDragging: false,
                });
                //accumulatedDragValueRef.current = 0;
                console.log(
                    "accumulated drag",
                    accumulatedDragValueRef.current
                );
            },
        })
    ).current;

    //function for formatting time into a usable format
    const formatCurrentTime = (): string => {
        if (videoPlayerStates.currentTime > 86400) {
            return "0";
        } else if (videoPlayerStates.currentTime <= 3600) {
            const hours = Math.floor(videoPlayerStates.currentTime / 60);
            const seconds = Math.ceil(videoPlayerStates.currentTime % 60);
            return `${String(hours).padStart(2, "00")}:${String(
                seconds
            ).padStart(2, "0")}`;
        } else {
            return "";
        }
    };

    //function for formatting duration of video into a usable format
    const formatDuration = (): string => {
        if (videoPlayerStates.duration > 86400) {
            return "0";
        } else if (videoPlayerStates.duration <= 3600) {
            const hours = Math.floor(videoPlayerStates.duration / 60);
            const seconds = Math.floor(videoPlayerStates.duration % 60);
            return `${String(hours).padStart(2, "00")}:${String(
                seconds
            ).padStart(2, "0")}`;
        }
        return "";
    };

    //event listener fo status changes like changes in loading states e.t.c
    useEventListener(player, "statusChange", (payload) => {
        if (payload.status !== "readyToPlay") {
            console.log("not ready to play");
            setVideoPlayerStates({
                ...videoPlayerStates,
                isLoading: true,
            });
        } else {
            setVideoPlayerStates({
                ...videoPlayerStates,
                isLoading: false,
                duration: player.duration,
            });
        }
    });
    useEventListener(player, "timeUpdate", (payload) => {
        setVideoPlayerStates({
            ...videoPlayerStates,
            currentTime: payload.currentTime,
        });
    });

    useEffect(() => {
        const subscriptions = [
            player.addListener("playingChange", ({ isPlaying }) => {
                setVideoPlayerStates({
                    ...videoPlayerStates,
                    isPlaying: isPlaying,
                });
            }),
        ];

        //interval function for setting current time, progress width in UI e.t.c
        const currentTimeIntervalId = setInterval(() => {
            if (
                player.playing &&
                player.status === "readyToPlay" &&
                !videoPlayerStates.isDragging
            ) {
                setProgressWidth(
                    () => (player.currentTime / player.duration) * 100
                );
                setVideoPlayerStates({
                    ...videoPlayerStates,
                    currentTime: player.currentTime,
                });
            }
        }, 1000);

        return () => {
            subscriptions.map((sub) => {
                sub.remove();
            });
            clearInterval(currentTimeIntervalId);
        };
    });
    return (
        <View style={styles.outermost}>
            <View style={styles.headerBar}>
                <Text style={styles.logo}>Plan Movies</Text>
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={21} color="#898989" />
                    <View style={styles.avatar}></View>
                </View>
            </View>
            <View style={styles.videoContainer}>
                <VideoView
                    ref={videoRef}
                    player={player}
                    style={styles.video}
                    contentFit="contain"
                    nativeControls={false}
                ></VideoView>
                <LinearGradient
                    style={styles.videoOverlay}
                    colors={["rgba(25,25,25, 0.9)", "rgba(220,220, 220, 0)"]}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0.8 }}
                >
                    <View style={styles.loadingIndicatorContainer}>
                        {videoPlayerStates.isLoading ? (
                            <ActivityIndicator size={30} color="#f5f5f5" />
                        ) : (
                            <Pressable
                                onPress={() =>
                                    player.playing === false
                                        ? player.play()
                                        : player.pause()
                                }
                                style={styles.largePlayPauseButton}
                            >
                                {videoPlayerStates.isPlaying ? (
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
                            </Pressable>
                        )}
                    </View>
                    <View style={styles.videoProgressContainer}>
                        <View
                            style={styles.videoProgressBar}
                            onLayout={(event) => {
                                progressBarWidth.current =
                                    event.nativeEvent.layout.width;
                            }}
                        >
                            <View
                                style={[
                                    styles.videoProgressBar2,
                                    { width: `${progressWidth}%` },
                                ]}
                            ></View>
                            <View
                                style={[
                                    styles.videoProgressSlider,
                                    {
                                        transform: [
                                            {
                                                scale: videoPlayerStates.isDragging
                                                    ? 1.4
                                                    : 1,
                                            },
                                        ],
                                    },
                                ]}
                                {...videoProgressPan.panHandlers}
                            ></View>
                        </View>
                    </View>
                    <View style={styles.controlsContainer}>
                        <View
                            style={{
                                columnGap: "15%",
                                flexDirection: "row",
                                //width: "85%",
                            }}
                        >
                            <Ionicons
                                name="play-skip-back"
                                size={18}
                                color="white"
                            />
                            <Pressable
                                onPress={() =>
                                    player.playing === false
                                        ? player.play()
                                        : player.pause()
                                }
                            >
                                {videoPlayerStates.isPlaying === false ? (
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
                            </Pressable>
                            <Ionicons
                                name="play-skip-forward"
                                size={18}
                                color="white"
                            />
                        </View>
                        <View style={styles.volumeContainer}>
                            <Ionicons
                                name="volume-low"
                                size={18}
                                color="white"
                            />
                            <View style={styles.volumeBar}>
                                <View style={styles.volumeSlider}></View>
                            </View>
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                columnGap: "10%",
                            }}
                        >
                            <View style={styles.timeContainer}>
                                <Text style={styles.currentTime}>
                                    {formatCurrentTime()}
                                </Text>
                                <Text style={{ color: "white" }}>/</Text>
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
                </LinearGradient>
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
    },
    video: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
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
    videoProgressContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        height: 10,
        justifyContent: "center",
        columnGap: "3%",
    },
    videoProgressBar: {
        flexDirection: "row",
        alignItems: "center",
        width: "93%",
        height: 3,
        backgroundColor: "#b9b9b9",
    },
    videoProgressBar2: {
        height: "100%",
        backgroundColor: "red",
    },
    videoProgressSlider: {
        width: 10,
        height: 10,
        borderRadius: 9999,
        backgroundColor: "rgba(255, 0, 0,1)",
    },
    controlsContainer: {
        flexDirection: "row",
        height: 40,
        width: "100%",
        alignItems: "center",
        paddingHorizontal: 5,
        columnGap: 8,
        justifyContent: "space-evenly",
        paddingRight: "5%",
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
});

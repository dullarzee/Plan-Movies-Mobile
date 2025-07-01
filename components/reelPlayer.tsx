import { reelsDataTypes as reelPlayerPropTypes } from "@/app/(tabs)/reels";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { useEventListener } from "expo";
import { LinearGradient } from "expo-linear-gradient";
import { useVideoPlayer, VideoPlayer, VideoView } from "expo-video";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    GestureResponderEvent,
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function ReelPlayer({
    userName,
    desc,
    avatarUrl,
    likes,
    comments,
    videoUrl,
    sound,
    index,
    currentViewedIndex,
}: reelPlayerPropTypes) {
    const isFocused = useIsFocused();
    const [isLiked, setIsLiked] = useState(false);
    const [reelPlayerStates, setReelPlayerStates] = useState({
        isPlaying: false,
    });
    const playPauseAnimFade = useRef(new Animated.Value(1)).current;
    const playPauseAnimScale = useRef(new Animated.Value(1)).current;

    const { width, height } = Dimensions.get("window");

    const player: VideoPlayer = useVideoPlayer(
        videoUrl,
        (player: VideoPlayer) => {
            player.loop = true;
            player.muted = false;
        }
    );
    const hidePlayPause = () => {
        Animated.parallel([
            Animated.timing(playPauseAnimFade, {
                toValue: 0,
                duration: 250,
                useNativeDriver: false,
            }),
            Animated.timing(playPauseAnimScale, {
                toValue: 1.4,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start();
    };

    useEffect(() => {
        if (index === currentViewedIndex) {
            player.play();
            player.currentTime = 0;
            setReelPlayerStates((prev) => ({
                ...prev,
                isPlaying: true,
            }));
        } else {
            player.pause();
            setReelPlayerStates((prev) => ({
                ...prev,
                isPlaying: false,
            }));
        }
    }, [currentViewedIndex, index]);

    useEffect(() => {
        if (isFocused) player.play();
        else player.pause();
    }, [isFocused]);
    useEffect(() => {
        if (reelPlayerStates.isPlaying) {
            hidePlayPause();
        } else {
            playPauseAnimFade.setValue(1);
            playPauseAnimScale.setValue(1);
        }
    }, [reelPlayerStates.isPlaying]);

    const formatStat = (it: number): string => {
        if (String(it).length === 5) {
            return `${String(it).slice(0, 2)}.${String(it).charAt(2)}k`;
        } else if (String(it).length === 6) {
            return `${String(it).slice(0, 3)}.${String(it).charAt(3)}k`;
        } else if (String(it).length === 7) {
            return `${String(it).slice(0, 1)}.${String(it).charAt(1)}M`;
        } else if (String(it).length === 8) {
            return `${String(it).slice(0, 2)}.${String(it).charAt(2)}M`;
        } else if (String(it).length === 9) {
            return `${String(it).slice(0, 3)}.${String(it).charAt(3)}M`;
        } else if (String(it).length === 10) {
            return `${String(it).slice(0, 1)}.${String(it).charAt(1)}b`;
        } else if (String(it).length === 11) {
            return `${String(it).slice(0, 2)}.${String(it).charAt(2)}b`;
        } else if (String(it).length === 12) {
            return `${String(it).slice(0, 3)}.${String(it).charAt(3)}b`;
        } else return `${it}`;
    };

    console.log("component rendered");

    const handleOverlayPress = (e: GestureResponderEvent) => {
        e.stopPropagation();
        if (player.playing) {
            player.pause();
            setReelPlayerStates((prev) => ({
                ...prev,
                isPlaying: false,
            }));
        } else {
            player.play();
            setReelPlayerStates((prev) => ({
                ...prev,
                isPlaying: true,
            }));
        }

        console.log(player.playing);
    };
    return (
        <View style={[styles.outermost, { height: height - 60 }]}>
            <VideoView
                player={player}
                contentFit="contain"
                style={styles.video}
                nativeControls={false}
            />
            <Pressable
                style={styles.pressableOverlay}
                onPress={handleOverlayPress}
            ></Pressable>
            <View style={styles.unInteractableIconsOverlay}>
                <Animated.View
                    style={[
                        styles.playPauseButton,
                        {
                            opacity: playPauseAnimFade,
                            transform: [{ scale: playPauseAnimScale }],
                        },
                    ]}
                >
                    <Ionicons
                        name={
                            reelPlayerStates.isPlaying
                                ? "pause-sharp"
                                : "play-sharp"
                        }
                        size={40}
                        color="white"
                    />
                </Animated.View>
            </View>
            <LinearGradient
                colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.1)", "rgba(0,0,0,0)"]}
                start={{ x: 0.5, y: 1 }}
                end={{ x: 0.5, y: 0.2 }}
                style={styles.interactableIconsOverlay}
            >
                <View style={styles.videoDetails}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            columnGap: 5,
                        }}
                    >
                        <View style={styles.userAvatar}>
                            <Image
                                source={
                                    typeof avatarUrl === "string"
                                        ? { uri: avatarUrl }
                                        : avatarUrl
                                }
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: 9999,
                                }}
                            />
                        </View>
                        <Text style={styles.userName}>{`@${userName}`}</Text>
                    </View>
                    <View>
                        <Text style={styles.description} numberOfLines={3}>
                            {desc}
                        </Text>
                    </View>
                    <View style={{ alignSelf: "baseline" }}>
                        <Text style={styles.soundDetails}>
                            Sound - <Text>{sound}</Text>
                        </Text>
                    </View>
                </View>
                <View style={styles.socialsInteractionContainer}>
                    <Pressable
                        onPress={handleOverlayPress}
                        style={{ flex: 1 }}
                    />
                    <View style={styles.innerSocialsContainer}>
                        <View>
                            <Pressable onPress={() => setIsLiked(!isLiked)}>
                                <View style={styles.iconEnvelope}>
                                    <Ionicons
                                        name={
                                            isLiked ? "heart" : "heart-outline"
                                        }
                                        size={21}
                                        color={
                                            isLiked
                                                ? "rgb(244, 0, 73)"
                                                : "white"
                                        }
                                    />
                                </View>
                            </Pressable>
                            <Text style={styles.likesCount}>
                                {formatStat(likes)}
                            </Text>
                        </View>
                        <View>
                            <View style={styles.iconEnvelope}>
                                <Ionicons
                                    name={"chatbubble-outline"}
                                    size={21}
                                    color="white"
                                />
                            </View>
                            <Text style={styles.commentsCount}>
                                {formatStat(comments)}
                            </Text>
                        </View>
                        <View>
                            <View style={styles.iconEnvelope}>
                                <Ionicons
                                    name={"share-outline"}
                                    size={21}
                                    color="white"
                                />
                            </View>
                        </View>
                        <View>
                            <View style={styles.iconEnvelope}>
                                <Ionicons
                                    name={"bookmark-outline"}
                                    size={21}
                                    color="white"
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </LinearGradient>
            <View style={styles.loadingIndicator}>
                <LoadingIndicator player={player} screenWidth={width} />
            </View>
        </View>
    );
}

export function LoadingIndicator({
    player,
    screenWidth,
}: {
    player: VideoPlayer;
    screenWidth: number;
}) {
    const [loading, setLoading] = useState<boolean>(true);
    const loadingAnim = useRef(new Animated.Value(0)).current;
    if (player.status !== "readyToPlay") {
        Animated.loop(
            Animated.timing(loadingAnim, {
                toValue: screenWidth,
                duration: 700,
                useNativeDriver: false,
            })
        ).start();
    }
    useEventListener(player, "statusChange", (payload) => {
        if (payload.status === "readyToPlay") setLoading(() => false);
        else setLoading(() => true);
    });

    if (loading)
        return (
            <View
                style={{
                    flex: 1,
                    height: 4,
                    alignItems: "center",
                    zIndex: 20,
                }}
            >
                <Animated.View
                    style={{
                        width: loadingAnim,
                        height: 3,
                        backgroundColor: "#ffffff",
                    }}
                />
            </View>
        );
}

const styles = StyleSheet.create({
    outermost: {
        position: "relative",
        //borderWidth: 2,
        //borderColor: "red",
    },
    video: {
        width: "100%",
        height: "100%",
        backgroundColor: "#222222",
    },
    pressableOverlay: {
        position: "absolute",
        //borderWidth: 1,
        //borderColor: "blue",
        width: "80%",
        height: "70%",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 5,
    },
    videoDetails: {
        width: "80%",
        height: "29%",
        padding: 10,
        zIndex: 5,
        justifyContent: "space-evenly",
    },
    socialsInteractionContainer: {
        width: "20%",
        height: "100%",
        justifyContent: "flex-end",
        zIndex: 5,
    },
    userAvatar: {
        width: 40,
        height: 40,
        //backgroundColor: "#888888",
        borderRadius: 9999,
    },
    userName: {
        color: "white",
        fontSize: 15,
        fontWeight: "500",
    },
    description: {
        color: "#f5f5f5",
        fontSize: 13,
    },
    soundDetails: {
        color: "white",
    },
    iconEnvelope: {
        width: 41,
        height: 41,
        borderRadius: 9999,
        backdropFilter: "blur",
        backgroundColor: "rgba(255,255,255,0.2)",
        //borderWidth: 2,
        //borderColor: "white",
        alignItems: "center",
        justifyContent: "center",
    },
    innerSocialsContainer: {
        width: "100%",
        height: "60%",
        alignItems: "center",
        justifyContent: "space-evenly",
    },
    likesCount: {
        color: "white",
        textAlign: "center",
    },
    commentsCount: {
        color: "white",
        textAlign: "center",
    },
    playPauseButton: {
        width: 60,
        height: 60,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 9999,
    },
    interactableIconsOverlay: {
        zIndex: 3,
        flexDirection: "row",
        width: "100%",
        height: "100%",
        position: "absolute",
        alignItems: "flex-end",
        //backgroundColor: "pink",
    },
    unInteractableIconsOverlay: {
        width: "100%",
        height: "100%",
        position: "absolute",
        zIndex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    loadingIndicator: {
        position: "absolute",
        top: "99%",
        width: "100%",
    },
});

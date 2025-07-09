import type { myVideoPlayerStates } from "@/app/watch";
import { setMyVideoPlayerStates } from "@/app/watch";
import { VideoPlayer } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function VideoProgressBar({
    videoPlayerStates,
    setVideoPlayerStates,
    player,
}: {
    videoPlayerStates: myVideoPlayerStates;
    setVideoPlayerStates: typeof setMyVideoPlayerStates;
    player: VideoPlayer;
}) {
    const [isDragging, setIsDragging] = useState(false);
    const currentProgressWidth = useSharedValue(0);
    const progressBarWidth = useSharedValue(0);
    const currentStartX = useSharedValue(0);

    useEffect(() => {
        const subscriptions = [
            player.addListener("playingChange", ({ isPlaying }) => {
                setVideoPlayerStates((prev) => ({
                    ...prev,
                    isPlaying: isPlaying,
                }));
            }),
        ];

        //interval function for setting current time, progress width in UI e.t.c
        const currentTimeIntervalId = setInterval(() => {
            if (
                player.playing &&
                player.status === "readyToPlay" &&
                !isDragging
            ) {
                currentProgressWidth.value =
                    (player.currentTime / player.duration) *
                    progressBarWidth.value;
                setVideoPlayerStates((prev) => ({
                    ...prev,
                    currentTime: player.currentTime,
                    duration: player.duration,
                }));
            }
        }, 100);

        return () => {
            subscriptions.map((sub) => {
                sub.remove();
            });
            clearInterval(currentTimeIntervalId);
        };
    });

    const handleSeeking = () => {
        try {
            const newPos =
                (currentProgressWidth.value / progressBarWidth.value) *
                player.duration;
            const newTime = newPos - player.currentTime;
            player.seekBy(newTime);
        } catch (error) {
            console.log("failed to seek to time:", error);
        }
    };

    const setOutsideState = (state: boolean) => {
        setVideoPlayerStates((prev) => ({
            ...prev,
            isDragging: state,
        }));
    };

    //Gesture API for configuring functions to call on gesture event
    const handleDragStart = Gesture.Pan()
        .onStart(() => {
            currentStartX.value = currentProgressWidth.value;
            runOnJS(setIsDragging)(true);
            runOnJS(setOutsideState)(true);
        })
        .onUpdate((e) => {
            currentProgressWidth.value = Math.max(
                0,
                Math.min(
                    currentStartX.value + e.translationX,
                    progressBarWidth.value
                )
            );
        })
        .onEnd(() => {
            runOnJS(setIsDragging)(false);

            runOnJS(handleSeeking)();
            runOnJS(setOutsideState)(false);
        })
        .minDistance(0) // Allow immediate response
        .maxPointers(1) // Only allow single touch
        .runOnJS(false);

    const thumbSlider = useAnimatedStyle(() => {
        return {
            transform: [{ scale: videoPlayerStates.isDragging ? 1.4 : 1 }],
        };
    });
    const progressFill = useAnimatedStyle(() => {
        return {
            width: currentProgressWidth.value,
        };
    });

    return (
        <View style={styles.videoProgressContainer}>
            <View
                style={styles.videoProgressBar}
                onLayout={(event) => {
                    progressBarWidth.value = event.nativeEvent.layout.width;
                }}
            >
                <Animated.View style={[styles.progressFill, progressFill]} />

                <GestureDetector gesture={handleDragStart}>
                    <Animated.View
                        style={[styles.videoProgressSlider, thumbSlider]}
                    ></Animated.View>
                </GestureDetector>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    progressFill: {
        height: "100%",
        backgroundColor: "red",
    },
    videoProgressSlider: {
        width: 13,
        height: 13,
        borderRadius: 9999,
        backgroundColor: "rgba(255, 0, 0,1)",
    },
});

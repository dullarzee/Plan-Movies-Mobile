import type { myVideoPlayerStates } from "@/app/watch";
import { setMyVideoPlayerStates } from "@/app/watch";
import { VideoPlayer } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { PanResponder, StyleSheet, View } from "react-native";

export default function VideoProgressBar({
    videoPlayerStates,
    setVideoPlayerStates,
    player,
}: {
    videoPlayerStates: myVideoPlayerStates;
    setVideoPlayerStates: typeof setMyVideoPlayerStates;
    player: VideoPlayer;
}) {
    const [progressWidth, setProgressWidth] = useState(0);
    const [dragValue, setDragValue] = useState(0);

    useEffect(() => {
        setProgressWidth((prevWidth) => Math.min(prevWidth + dragValue, 100));
    }, [dragValue]);

    //A ref for holding the progress bar width after the onLayout event has fired
    const progressBarWidth = useRef<number>(0);
    const accumulatedDragValueRef = useRef(0);

    //a panresponder configuration for initializing the progress bar thumb/slider to respond to drag gestures
    const videoProgressPan = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: (e) => {
                setVideoPlayerStates((prev) => ({
                    ...prev,
                    isDragging: true,
                }));
                console.log("access granted");
                const touchX = e.nativeEvent.locationX;
                const percentage = Math.max(
                    0,
                    Math.min(100, (touchX / progressBarWidth.current) * 100)
                );
                setDragValue(() => percentage);
            },

            onPanResponderMove: (e, gestureState) => {
                //console.log("e.nativelocationX:", e.nativeEvent.locationX);
                const touchX = e.nativeEvent.locationX;
                const percentage = (touchX / progressBarWidth.current) * 100;
                setDragValue(() => percentage);
                accumulatedDragValueRef.current =
                    (gestureState.dx / progressBarWidth.current) * 100;
                console.log(
                    "accumulated drag value in responder move:",
                    accumulatedDragValueRef.current
                );
                setVideoPlayerStates((prev) => ({
                    ...prev,
                    duration: player.duration,
                    currentTime: player.currentTime,
                }));
            },

            onPanResponderRelease: () => {
                setVideoPlayerStates((prev) => ({
                    ...prev,
                    isLoading: false,
                    isDragging: false,
                }));
                if (player.playing) {
                    setVideoPlayerStates((prev) => ({
                        ...prev,
                        isPlaying: player.playing,
                    }));
                } else {
                    setVideoPlayerStates((prev) => ({
                        ...prev,
                        isPlaying: false,
                    }));
                }

                console.log(
                    "accumulated drag",
                    accumulatedDragValueRef.current
                );
                const seconds =
                    (accumulatedDragValueRef.current / 100) * player.duration;
                seekForward(seconds);
                console.log("seconds in responder release:", seconds);
            },
        })
    ).current;

    const seekForward = (seconds: number) => {
        player.seekBy(seconds);
        console.log("tried seeking by", seconds, "seconds");

        accumulatedDragValueRef.current = 0;
    };

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
                !videoPlayerStates.isDragging
            ) {
                setProgressWidth(
                    () => (player.currentTime / player.duration) * 100
                );
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
    return (
        <View style={styles.videoProgressContainer}>
            <View
                style={styles.videoProgressBar}
                onLayout={(event) => {
                    progressBarWidth.current = event.nativeEvent.layout.width;
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
});

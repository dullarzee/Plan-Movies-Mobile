import Ionicons from "@expo/vector-icons/Ionicons";
import { VideoPlayer } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

export default function VolumeBar({ player }: { player: VideoPlayer }) {
    const [volume, setVolume] = useState<number>(player.muted ? 0 : 100);
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const currentVolume = useSharedValue(player.muted ? 0 : 100);
    const volumeBarWidth = useSharedValue(0);
    const startX = useSharedValue(0);

    const thumbSlider = useAnimatedStyle(() => {
        return {
            transform: [{ scale: isDragging ? 1.25 : 1 }],
        };
    });
    const volumeFill = useAnimatedStyle(() => {
        return {
            width: currentVolume.value,
        };
    });

    const handleVolume = () => {
        player.volume = Math.max(
            0,
            Math.min(currentVolume.value / volumeBarWidth.value, 1)
        );
        setVolume(player.volume * 100);
    };

    const handleDrag = Gesture.Pan()
        .onStart(() => {
            startX.value = currentVolume.value;
            runOnJS(setIsDragging)(true);
        })
        .onUpdate((e) => {
            currentVolume.value = Math.max(
                0,
                Math.min(startX.value + e.translationX, volumeBarWidth.value)
            );

            runOnJS(handleVolume)();
        })
        .onEnd(() => {
            runOnJS(setIsDragging)(false);
        })
        .minDistance(0) // Allow immediate response
        .maxPointers(1) // Only allow single touch
        .runOnJS(false);

    return (
        <View style={styles.volumeContainer}>
            <View style={styles.volumeIcon}>
                <Ionicons
                    name={
                        player.muted || volume === 0
                            ? "volume-mute-outline"
                            : volume > 0 && volume <= 30
                            ? "volume-low"
                            : volume > 30 && volume <= 70
                            ? "volume-medium"
                            : "volume-high"
                    }
                    size={18}
                    color="white"
                />
            </View>
            <View
                style={[styles.volumeBar]}
                onLayout={(e) => {
                    volumeBarWidth.value = e.nativeEvent.layout.width;
                }}
            >
                <Animated.View
                    style={[styles.volumeBarFill, volumeFill]}
                ></Animated.View>
                <GestureDetector gesture={handleDrag}>
                    <Animated.View
                        style={[styles.volumeSlider, thumbSlider]}
                    ></Animated.View>
                </GestureDetector>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    volumeContainer: {
        width: 75,
        flexDirection: "row",
        alignItems: "center",
        columnGap: 3,
    },
    volumeIcon: {
        flex: 1,
    },
    volumeBar: {
        flex: 3,
        flexDirection: "row",
        height: 4,
        backgroundColor: "#b9b9b9",
        alignItems: "center",
    },
    volumeBarFill: {
        backgroundColor: "white",
        height: "100%",
        maxWidth: "100%",
    },
    volumeSlider: {
        position: "relative",
        left: -5,
        width: 10,
        height: 10,
        borderRadius: 9999,
        backgroundColor: "white",
    },
});

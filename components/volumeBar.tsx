import Ionicons from "@expo/vector-icons/Ionicons";
import { VideoPlayer } from "expo-video";
import { useEffect, useRef, useState } from "react";
import { PanResponder, StyleSheet, View } from "react-native";

export default function VolumeBar({ player }: { player: VideoPlayer }) {
    const [dragValue, setDragValue] = useState<number>(0);
    const [volume, setVolume] = useState<number>(player.muted ? 0 : 100);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    useEffect(() => {
        setVolume((prevValue) =>
            Math.max(0, Math.min(prevValue + dragValue, 100))
        );
        player.volume = volume / 100;
        //console.log(volume);
        if (volume === 0) player.muted = true;
        else player.muted = false;
    }, [dragValue]);

    const volumeBarWidth = useRef<number>(0);
    const volumeSliderPan = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                console.log("access granted");
                setIsDragging(true);
            },
            onPanResponderMove: (e, gestureState) => {
                const touchX = e.nativeEvent.locationX;
                const percentage = (touchX / volumeBarWidth.current) * 100;
                setDragValue(() => percentage);
                console.log("player volume:", player.volume);
                console.log("is player muted?", player.muted);
            },
            onPanResponderRelease: () => {
                setIsDragging(false);
            },
        })
    ).current;

    return (
        <View style={styles.volumeContainer}>
            <Ionicons
                name={
                    player.muted
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
            <View
                style={[styles.volumeBar]}
                onLayout={(e) => {
                    volumeBarWidth.current = e.nativeEvent.layout.width;
                    console.log(volumeBarWidth.current);
                }}
            >
                <View
                    style={[styles.volumeBarFill, { width: `${volume}%` }]}
                ></View>
                <View
                    style={[
                        styles.volumeSlider,
                        { transform: [{ scale: isDragging ? 1.3 : 1 }] },
                    ]}
                    {...volumeSliderPan.panHandlers}
                ></View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    volumeContainer: {
        width: 75,
        flexDirection: "row",
        alignItems: "center",
    },
    volumeBar: {
        flexDirection: "row",
        width: "65%",
        height: 4,
        backgroundColor: "#b9b9b9",
        alignItems: "center",
    },
    volumeBarFill: {
        backgroundColor: "white",
        height: "100%",
    },
    volumeSlider: {
        width: 10,
        height: 10,
        borderRadius: 9999,
        backgroundColor: "white",
    },
});

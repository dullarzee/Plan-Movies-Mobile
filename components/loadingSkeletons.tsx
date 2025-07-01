import { useEffect, useRef } from "react";
import { Animated, Platform, View } from "react-native";

export function HomePageLoadingSkeleton() {
    return (
        <View style={{ flex: 1, padding: 13 }}>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <View style={{ flex: 1, rowGap: 5 }}>
                    <LoadingBlock width="40%" height={30} />
                    <LoadingBlock width="65%" height={15} />
                </View>
                <LoadingBlock width={45} height={45} rounded />
            </View>

            <View style={{ marginVertical: 15 }}>
                <LoadingBlock width="100%" height={200} />
            </View>
            <View
                style={{
                    flex: 1,
                    flexWrap: "wrap",
                    gap: 11,
                    flexDirection: "row",
                    justifyContent: "center",
                }}
            >
                {[...Array(4)].map((_, index) => {
                    return (
                        <LoadingBlock
                            key={`key ${index}`}
                            width={150}
                            height={180}
                        />
                    );
                })}
            </View>
        </View>
    );
}

export function LoadingBlock({
    width = "50%",
    height = 22,
    rounded = false,
}: {
    width: number | `${number}%`;
    height?: number;
    rounded?: boolean;
}) {
    const opacityAnim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        const animId = Animated.loop(
            Animated.sequence([
                Animated.timing(opacityAnim, {
                    toValue: 0.9,
                    duration: 1000,
                    useNativeDriver: Platform.OS !== "web",
                }),
                Animated.timing(opacityAnim, {
                    toValue: 0.4,
                    duration: 1000,
                    useNativeDriver: Platform.OS !== "web",
                }),
            ])
        );
        animId.start();

        return () => animId.stop();
    }, [opacityAnim]);
    return (
        <>
            <Animated.View
                style={{
                    opacity: opacityAnim,
                    width: width,
                    height: height,
                    borderRadius: rounded ? 9999 : 8,
                    backgroundColor: "#e7e7e7",
                }}
            ></Animated.View>
        </>
    );
}

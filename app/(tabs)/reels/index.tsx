import Supabase from "@/app/lib/supabase";
import ReelPlayer from "@/components/reelPlayer";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import {
    Dimensions,
    FlatList,
    NativeScrollEvent,
    NativeSyntheticEvent,
    StatusBar,
    StyleSheet,
    View,
} from "react-native";

export interface reelsDataTypes {
    id: number;
    userName: string;
    desc: string;
    avatarUrl: string | number;
    likes: number;
    comments: number;
    videoUrl: string;
    sound: string;
    index: number;
    currentViewedIndex: number;
}

export default function ReelsTab() {
    const [currentViewedIndex, setCurrentViewedIndex] = useState<number>(0);
    const [reels, setReels] = useState<
        PostgrestSingleResponse<reelsDataTypes[]> | any
    >();
    const { height } = Dimensions.get("window");

    useEffect(() => {
        async function fetchIt() {
            try {
                const { data } = await Supabase.from(
                    "mobile-reel-table"
                ).select("*");
                setReels(data?.slice(1) as reelsDataTypes[]);
                console.log("successfully got reels");
                console.log("data:", data);
            } catch (error) {
                console.log("error fetching reels", error);
            }
        }
        fetchIt();
    }, []);

    const handleScrolling = (
        e: NativeSyntheticEvent<NativeScrollEvent>
    ): void => {
        const offsetY: number = e.nativeEvent.contentOffset.y;
        const index: number = Math.round(offsetY / height);

        if (
            index !== currentViewedIndex &&
            index >= 0 &&
            index < reels.length
        ) {
            setCurrentViewedIndex(() => index);
            console.log("scrolling:", offsetY);
        }
    };

    const handleScrollEnd = (
        e: NativeSyntheticEvent<NativeScrollEvent>
    ): void => {
        const offsetY: number = e.nativeEvent.contentOffset.y;
        const index: number = Math.round(offsetY / height);
        setCurrentViewedIndex(() => index);
        console.log("scroll end:", offsetY);
        console.log("reached momentum scroll end");
    };
    return (
        <View style={styles.outermost}>
            <StatusBar barStyle={"dark-content"} />
            {
                <FlatList
                    data={reels}
                    renderItem={({ item, index }) => (
                        <ReelPlayer
                            {...item}
                            currentViewedIndex={currentViewedIndex}
                            index={index}
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    style={styles.flatList}
                    pagingEnabled={true}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={height - 55}
                    snapToAlignment="start"
                    decelerationRate={"fast"}
                    onScroll={handleScrolling}
                    onMomentumScrollEnd={handleScrollEnd}
                    maxToRenderPerBatch={2}
                    scrollEventThrottle={17}
                    onScrollAnimationEnd={() =>
                        console.log("reached scroll animation end")
                    }
                />
            }
        </View>
    );
}

const styles = StyleSheet.create({
    outermost: {
        flex: 1,
        marginBottom: 62,
    },
    flatList: {
        flex: 1,
    },
});

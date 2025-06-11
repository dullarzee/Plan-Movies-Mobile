import { FlatList, Image } from "react-native";
import { moviesData } from "../app/videos";

export default function VideoThumbNail() {
    return (
        <FlatList
            style={{
                width: "100%",
                flex: 1,
            }}
            contentContainerStyle={{
                alignItems: "center",
                flexGrow: 1,
                gap: 14,
            }}
            data={moviesData}
            renderItem={({ item }) => (
                <Image
                    style={{ width: 300, height: 200 }}
                    source={require("../assets/images/blueDonut.webp")}
                ></Image>
            )}
        />
    );
}

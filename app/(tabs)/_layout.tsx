import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

export default function AppLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "white",
                headerShown: false,
                tabBarActiveBackgroundColor: "gray",
                tabBarStyle: {
                    position: "absolute",
                    height: 62,
                    padding: 4,
                    paddingHorizontal: 6,
                },
                tabBarItemStyle: {},
            }}
        >
            <Tabs.Screen
                name="home/index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home-outline" color={color} size={21} />
                    ),
                }}
            />

            <Tabs.Screen
                name="trending/index"
                options={{
                    title: "Trending",
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="trending-up" color={color} size={21} />
                    ),
                }}
            />

            <Tabs.Screen
                name="settings/index"
                options={{
                    title: "Settings",
                    tabBarIcon: ({ color }) => (
                        <AntDesign name="setting" color={color} size={21} />
                    ),
                }}
            />
        </Tabs>
    );
}

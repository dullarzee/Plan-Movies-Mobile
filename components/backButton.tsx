import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";

export default function BackButton() {
    const [canGoBack, setCanGoBack] = useState<boolean | null>(null);
    const navigation = useNavigation();
    useEffect(() => {
        setCanGoBack(navigation.canGoBack());
    }, []);
    if (canGoBack)
        return (
            <TouchableOpacity
                style={{
                    width: 24,
                    alignItems: "center",
                    justifyContent: "center",
                }}
                onPress={() => navigation.goBack()}
            >
                <Ionicons
                    name="chevron-back"
                    size={24}
                    color="rgba(190,0,0,1)"
                />
            </TouchableOpacity>
        );
}

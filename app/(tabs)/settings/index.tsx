import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View, StyleSheet, Button, Switch } from "react-native";

export default function MainApp() {
    return (
        <View style={styles.outermost}>
            <Text style={styles.heading}>Settings</Text>

            <View style={styles.userContainer}>
                <View
                    style={{
                        flex: 1,
                        alignItems: "center",
                    }}
                >
                    <View style={styles.userImage}></View>
                </View>
                <View style={{ flex: 3, gap: 4 }}>
                    <Text style={styles.userName}>Guest</Text>
                    <Text style={styles.userEmail}>Guest@example.com</Text>
                    <View style={styles.signInButton}>Sign In</View>
                </View>
            </View>

            <View style={styles.preferencesContainer}>
                <Text
                    style={{ fontSize: 20, color: "black", marginVertical: 10 }}
                >
                    Preferences
                </Text>
                <View style={styles.preferencesOptions}>
                    <View style={styles.preferenceOption}>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Ionicons
                                name="alarm-outline"
                                size={20}
                                color={"black"}
                            />
                        </View>
                        <View style={{ flex: 5 }}>
                            <Text style={{ fontSize: 18, color: "black" }}>
                                Notifications
                            </Text>
                            <Text style={{ fontSize: 14, color: "#a1a1a1" }}>
                                Get updates about new releases
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Switch />
                        </View>
                    </View>

                    <View className="optionsDivider" />

                    <View style={styles.preferenceOption}>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Ionicons
                                name="moon-outline"
                                size={20}
                                color={"black"}
                            />
                        </View>
                        <View style={{ flex: 5 }}>
                            <Text style={{ fontSize: 18, color: "black" }}>
                                Dark Mode
                            </Text>
                            <Text style={{ fontSize: 14, color: "#a1a1a1" }}>
                                Switch to Dark theme
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Switch />
                        </View>
                    </View>
                    <View className="optionsDivider" />

                    <View style={styles.preferenceOption}>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Ionicons
                                name="download-outline"
                                size={20}
                                color={"black"}
                            />
                        </View>
                        <View style={{ flex: 5 }}>
                            <Text style={{ fontSize: 18, color: "black" }}>
                                Auto Download
                            </Text>
                            <Text style={{ fontSize: 14, color: "#a1a1a1" }}>
                                Download for offline Viewing
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Switch />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outermost: {
        flex: 1,
        padding: 20,
        backgroundColor: "white",
    },
    heading: {
        fontSize: 30,
    },
    userContainer: {
        flexDirection: "row",
        width: "100%",
        padding: 11,
        borderWidth: 1,
        borderColor: "#d5d5d5",
        marginVertical: 15,
        borderRadius: 12,
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 9999,
        backgroundColor: "#d5d5d5",
    },
    userName: {
        fontSize: 22,
        color: "black",
    },
    userEmail: {
        fontSize: 16,
        color: "#a1a1a1",
    },
    signInButton: {
        color: "black",
        backgroundColor: "white",
        paddingVertical: 7,
        paddingHorizontal: 13,
        borderRadius: 9,
    },
    preferencesContainer: {
        width: "100%",
    },
    preferencesOptions: {
        width: "100%",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#d7d7d7",
        backgroundColor: "white",
        padding: 11,
    },
    preferenceOption: {
        flexDirection: "row",
        paddingVertical: 13,
    },
    optionsDivider: {
        width: "100%",
        height: 2,
        backgroundColor: "#d7d7d7",
    },
});

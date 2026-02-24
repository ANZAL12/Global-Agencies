import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { TouchableOpacity, Text, View } from "react-native";

export default function PromoterTabLayout() {
    const { logout } = useAuth();

    return (
        <Tabs
            screenOptions={{
                headerRight: () => (
                    <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                        <MaterialIcons name="logout" size={24} color="#f00" />
                    </TouchableOpacity>
                ),
                tabBarActiveTintColor: "#1976d2",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                    tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="upload"
                options={{
                    title: "Upload Sale",
                    tabBarIcon: ({ color }) => <MaterialIcons name="add-circle" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="sales"
                options={{
                    title: "My Sales",
                    tabBarIcon: ({ color }) => <MaterialIcons name="list" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="announcements"
                options={{
                    title: "Announcements",
                    tabBarIcon: ({ color }) => <MaterialIcons name="announcement" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}

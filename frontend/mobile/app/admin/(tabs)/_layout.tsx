import { Tabs } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../../../context/AuthContext";
import { TouchableOpacity } from "react-native";

export default function AdminTabLayout() {
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
                headerShown: true,
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
                name="sales"
                options={{
                    title: "All Sales",
                    tabBarIcon: ({ color }) => <MaterialIcons name="list" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="announcement"
                options={{
                    title: "New Announcement",
                    tabBarIcon: ({ color }) => <MaterialIcons name="add-alert" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="add-promoter"
                options={{
                    title: "Add Promoter",
                    tabBarIcon: ({ color }) => <MaterialIcons name="person-add" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="promoters"
                options={{
                    title: "Promoters",
                    tabBarIcon: ({ color }) => <MaterialIcons name="people" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="logs"
                options={{
                    title: "Logs",
                    tabBarIcon: ({ color }) => <MaterialIcons name="history" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}

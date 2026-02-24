import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

function RootLayoutNav() {
  const { isAuthenticated, isLoading, role } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'login';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login
      router.replace('/login');
    } else if (isAuthenticated) {
      // Role-based routing
      if (role === 'admin') {
        if (segments[0] !== 'admin') {
          router.replace('/admin');
        }
      } else if (role === 'promoter') {
        if (segments[0] !== 'promoter') {
          router.replace('/promoter');
        }
      }
    }
  }, [isAuthenticated, isLoading, segments, role]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

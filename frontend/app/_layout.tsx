import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import "@/global.css";

// void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "rubik-regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "rubik-semibold": require("../assets/fonts/Rubik-SemiBold.ttf"),
    "rubik-bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "rubik-extrabold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "rubik-light": require("../assets/fonts/Rubik-Light.ttf"),
    "rubik-medium": require("../assets/fonts/Rubik-Medium.ttf"),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    } // lade Bildschirm anzeigen bis Font geladen ist
  }, [fontsLoaded]);

  // if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AppProvider>
    </AuthProvider>
  );
}

import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "./src/context/ThemeContext";
import TravelPlannerScreen from "./src/screens/TravelPlannerScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <TravelPlannerScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

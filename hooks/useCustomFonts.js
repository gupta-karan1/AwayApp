import { useEffect, useState } from "react";
import * as Font from "expo-font";
import {
  Mulish_400Regular,
  Mulish_500Medium,
  Mulish_800ExtraBold,
  Mulish_700Bold,
  Mulish_900Black,
  Mulish_300Light,
  Mulish_600SemiBold,
  Mulish_200ExtraLight,
} from "@expo-google-fonts/mulish";
import * as SplashScreen from "expo-splash-screen";

export const useCustomFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      await SplashScreen.preventAutoHideAsync();
      await Font.loadAsync({
        "Mulish-Regular": Mulish_400Regular,
        "Mulish-Medium": Mulish_500Medium,
        "Mulish-Bold": Mulish_700Bold,
        "Mulish-ExtraBold": Mulish_800ExtraBold,
        "Mulish-Black": Mulish_900Black,
        "Mulish-Light": Mulish_300Light,
        "Mulish-SemiBold": Mulish_600SemiBold,
        "Mulish-ExtraLight": Mulish_200ExtraLight,
      });
      await SplashScreen.hideAsync();
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);

  const onLayoutRootView = async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  };

  return { fontsLoaded, onLayoutRootView };
};

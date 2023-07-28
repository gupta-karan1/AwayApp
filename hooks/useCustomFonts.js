//defines a custom React Hook called useCustomFonts, which is designed to load and manage custom fonts in an Expo project. It also handles the SplashScreen behavior during the font loading process.

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

  // The useEffect hook is used to load the custom fonts and hide the SplashScreen when the component is mounted.
  useEffect(() => {
    // The loadFonts function is an asynchronous function that loads the custom fonts using the Font.loadAsync function from the Expo Font library.
    const loadFonts = async () => {
      // The SplashScreen.preventAutoHideAsync function is used to prevent the SplashScreen from automatically hiding when the app is ready to be displayed. This is done to ensure that the SplashScreen is displayed until the custom fonts have been loaded.
      await SplashScreen.preventAutoHideAsync();

      // The Font.loadAsync function is used to load the custom fonts. It takes an object containing the fonts to be loaded as an argument.
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

      // The SplashScreen.hideAsync function is used to hide the SplashScreen when the custom fonts have been loaded.
      await SplashScreen.hideAsync();

      // The fontsLoaded state variable is set to true using the setFontsLoaded function to indicate that the fonts have been loaded.
      setFontsLoaded(true);
    };

    // The loadFonts function is called when the component is mounted.
    loadFonts();
  }, []);

  // The onLayoutRootView function is an asynchronous function that hides the SplashScreen when the custom fonts have been loaded.
  const onLayoutRootView = async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync(); // The SplashScreen.hideAsync function is used to hide the SplashScreen when the custom fonts have been loaded.
    }
  };

  return { fontsLoaded, onLayoutRootView };
};

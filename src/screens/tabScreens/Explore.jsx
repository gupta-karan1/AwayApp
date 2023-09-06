import { StyleSheet, ScrollView, SafeAreaView } from "react-native";

import { useCustomFonts } from "../../../hooks/useCustomFonts";
import DestinationFeed from "../../components/ExploreComp/DestinationFeed";
import FeaturedArticle from "../../components/ExploreComp/FeaturedArticle";
import CategoryFeed from "../../components/ExploreComp/CategoryFeed";
import ExplorePrompt from "../../components/ExploreComp/ExplorePrompt";

const Explore = () => {
  // Load custom fonts using the useCustomFonts hook
  const { fontsLoaded, onLayoutRootView } = useCustomFonts();

  // If fonts are not loaded, return null to avoid rendering
  if (!fontsLoaded) {
    return null;
  }

  return (
    // Wrap the content in SafeAreaView and handle onLayout event for the root view
    <SafeAreaView onLayout={onLayoutRootView}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <ExplorePrompt />
        <DestinationFeed />
        <FeaturedArticle />
        <CategoryFeed articleCategory="Things to do" />
        <CategoryFeed articleCategory="Food & Drink" />
        <CategoryFeed articleCategory="Places to Stay" />
        <CategoryFeed articleCategory="Style & Culture" />
        <CategoryFeed articleCategory="Wildlife & Nature" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;

const styles = StyleSheet.create({});

// SUMMARY: Explore Screen with various content related to destinations, featured articles, and categories. It first loads the custom fonts using the useCustomFonts hook and ensures the fonts are ready before rendering the content. The component then displays a scrollable view containing DestinationFeed, FeaturedArticle, and multiple CategoryFeed components

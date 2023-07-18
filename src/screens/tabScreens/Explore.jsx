import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import DestinationFeed from "../../components/ExploreComp/DestinationFeed";
import FeaturedArticle from "../../components/ExploreComp/FeaturedArticle";
import CategoryFeed from "../../components/ExploreComp/CategoryFeed";
import { useCustomFonts } from "../../../hooks/useCustomFonts";

const Explore = () => {
  const { fontsLoaded, onLayoutRootView } = useCustomFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView onLayout={onLayoutRootView}>
      <ScrollView>
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

import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import DestinationFeed from "../../components/ExploreComp/DestinationFeed";
import FeaturedArticle from "../../components/ExploreComp/FeaturedArticle";
import CategoryFeed from "../../components/ExploreComp/CategoryFeed";

const Explore = () => {
  return (
    <SafeAreaView>
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

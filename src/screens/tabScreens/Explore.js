import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import React from "react";
import ExploreFeed from "../../components/ExploreFeed";

const Explore = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <ExploreFeed />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Explore;

const styles = StyleSheet.create({});

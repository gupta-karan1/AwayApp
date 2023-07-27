import { StyleSheet, Text, ScrollView, View } from "react-native";
import React from "react";

const Plan = () => {
  return (
    <View showsVerticalScrollIndicator={false} style={styles.container}>
      <Text>Plan</Text>
    </View>
  );
};

export default Plan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

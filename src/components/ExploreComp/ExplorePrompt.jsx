import { StyleSheet, Text, View, Pressable } from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import GlobalStyles from "../../GlobalStyles";
import { useNavigation } from "@react-navigation/native";

const ExplorePrompt = () => {
  const navigation = useNavigation();
  return (
    <Pressable
      style={styles.emptyContainer}
      onPress={() => navigation.navigate("TripsStackGroup")}
    >
      <View style={styles.promptMsg}>
        <Entypo name="location" size={24} color="#EFFBB7" />
        <View>
          <Text style={[GlobalStyles.bodyMediumBold, styles.text]}>
            Travel on Your Mind?
          </Text>
          <Text style={[GlobalStyles.labelMediumMedium, styles.text]}>
            Start planning a trip
          </Text>
        </View>
        <AntDesign name="arrowright" size={24} color="#EFFBB7" />
      </View>
    </Pressable>
  );
};

export default ExplorePrompt;

const styles = StyleSheet.create({
  emptyContainer: {
    backgroundColor: "#63725A",
    padding: 20,
    borderRadius: 10,
    marginHorizontal: 15,
    marginTop: 15,
  },
  promptMsg: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  text: {
    color: "#EFFBB7",
  },
});

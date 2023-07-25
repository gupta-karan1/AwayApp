import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  Pressable,
  Button,
  TouchableOpacity,
} from "react-native";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import GlobalStyles from "../../GlobalStyles";
import { FontAwesome } from "@expo/vector-icons";
import usePlaceScreen from "../../../hooks/usePlaceScreen";

const PlaceScreen = ({ route }) => {
  const { pathId } = route.params;
  const { loading, singlePlaceData } = usePlaceScreen(pathId);

  // const [singlePlaceData, setSinglePlaceData] = useState({});
  // const [loading, setLoading] = useState(true);
  const [showFullText, setShowFullText] = useState(false);
  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  // const getSinglePlaceData = async () => {
  //   try {
  //     const docRef = doc(FIREBASE_DB, pathId);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       const data = docSnap.data();
  //       setSinglePlaceData(data);
  //     } else {
  //       console.log("No such document!");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const formatPlaceHours = () => {
    if (singlePlaceData.placeHours) {
      const hoursArray = singlePlaceData.placeHours
        .split(",")
        .map((item) => item.trim());
      return hoursArray.join("\n");
    }
    return "";
  };

  // useEffect(() => {
  //   getSinglePlaceData();
  // }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image
            source={{ uri: singlePlaceData.placeImage }}
            style={styles.image}
          />
          <Text style={[GlobalStyles.bodySmallRegular, styles.subtitleText]}>
            {singlePlaceData.placeCategory}
          </Text>
          <Text style={[GlobalStyles.titleLargeRegular, styles.titleText]}>
            {singlePlaceData.placeTitle}
          </Text>

          {showFullText ? (
            <View>
              <Text style={[GlobalStyles.bodySmallRegular, styles.bodyText]}>
                {singlePlaceData.placeDescription || ""}
              </Text>
              <TouchableOpacity onPress={toggleFullText}>
                <Text style={[styles.para, GlobalStyles.bodySmallRegular]}>
                  Read Less
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={[GlobalStyles.bodySmallRegular, styles.bodyText]}>
                {singlePlaceData.placeDescription &&
                  singlePlaceData.placeDescription.slice(0, 200)}
                {"... "}
              </Text>
              <TouchableOpacity onPress={toggleFullText}>
                <Text style={[GlobalStyles.bodySmallRegular, styles.para]}>
                  Read More
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {singlePlaceData.placeAddress && (
            <View style={styles.iconContainer}>
              <FontAwesome
                style={[styles.icon, styles.AddressIcon]}
                name="map-marker"
                size={20}
                color="grey"
              />
              <Text
                style={[
                  GlobalStyles.bodySmallRegular,
                  styles.bodyText,
                  styles.iconText,
                ]}
              >
                {singlePlaceData.placeAddress}
              </Text>
            </View>
          )}

          {singlePlaceData.placeContact && (
            <View style={styles.iconContainer}>
              <FontAwesome
                style={styles.icon}
                name="phone"
                size={18}
                color="grey"
              />
              <Text
                style={[
                  GlobalStyles.bodySmallRegular,
                  styles.bodyText,
                  styles.iconText,
                ]}
              >
                {singlePlaceData.placeContact}
              </Text>
            </View>
          )}
          {singlePlaceData.placeHours && (
            <View style={styles.iconContainer}>
              <FontAwesome
                style={styles.icon}
                name="clock-o"
                size={18}
                color="grey"
              />
              <Text
                style={[
                  GlobalStyles.bodySmallRegular,
                  styles.bodyText,
                  styles.iconText,
                ]}
              >
                {formatPlaceHours()}
              </Text>
            </View>
          )}
          <View style={styles.button}>
            <Button title="Save Place" onPress={() => {}} />
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default PlaceScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  image: {
    height: 250,
    borderRadius: 5,
    marginBottom: 15,
    // width: 200,
  },
  subtitleText: {
    marginTop: 5,
    marginBottom: 10,
  },
  titleText: {
    marginBottom: 10,
    fontSize: 25,
  },
  bodyText: {
    overflow: "hidden",
    // width: 350,
    maxWidth: 340,
    marginBottom: 5,
  },
  icon: {
    marginRight: 15,
  },
  AddressIcon: {
    marginRight: 18,
  },
  iconText: {
    maxWidth: 300,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  para: {
    marginTop: 10,
    marginBottom: 30,
    textDecorationLine: "underline",
  },
  button: {
    marginVertical: 10,
  },
});

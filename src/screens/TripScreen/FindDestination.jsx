import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useState, useEffect, useCallback } from "react";
import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import GlobalStyles from "../../GlobalStyles";
import useArticleData from "../../../hooks/useDestinationScreen";
import FindArticleCard from "../../components/TripsComp/FindArticleCard";
import { useFocusEffect } from "@react-navigation/native";

// Component to render destination content for Find screen, passing pathId and tripLocation props
const FindDestination = ({ tripLocation }) => {
  // State variables to store destination data and loading state
  const [destinationData, setDestinationData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchTripLocation, setSearchTripLocation] = useState(tripLocation);
  // pathId for article data based on tripLocation. Lowercase to match database.
  const [pathId, setPathId] = useState(
    `destinations/${searchTripLocation.toLowerCase()}/articles`
  );

  // Function to fetch destination data from Firebase based on tripLocation
  const getDestinationData = async () => {
    try {
      // Query destinations collection group where the destinationName matches tripLocation
      // Extract the first letter and capitalize it
      const firstLetterCapitalized = searchTripLocation.charAt(0).toUpperCase();

      // Join the capitalized letter with the rest of the text
      const capitalizedLocation =
        firstLetterCapitalized + searchTripLocation.slice(1);
      const destinationRef = query(
        collectionGroup(FIREBASE_DB, "destinations"),
        where("destinationName", "==", capitalizedLocation)
      );
      // query reference to destinationRef
      const q = query(destinationRef);
      // getDocs to asynchronously fetch documents that match the query
      const querySnapshot = await getDocs(q);

      //   const data = querySnapshot.docs[0].data();

      // Loop through query results for each document and set destinationData state variable
      querySnapshot.forEach((doc) => {
        setDestinationData(doc.data());
      });
      // console.log(destinationData);

      // Handle errors
    } catch (error) {
      console.log("Error:" + error);
      Alert.alert("Error", error.message);
      // Regardless of result set loading to false
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle search input
  const handleSearch = (event) => {
    const text = event.nativeEvent.text;
    setSearchTripLocation(text);
    setPathId(`destinations/${text.toLowerCase()}/articles`);

    // console.log(text);
  };
  const { loading, articleData } = useArticleData(pathId);

  // useEffect to call getDestinationData whenever searchTripLocation changes
  useEffect(() => {
    getDestinationData();
  }, [searchTripLocation]);

  // State variable to toggle text description
  const [showFullText, setShowFullText] = useState(false);

  // Function to toggle text description
  const toggleFullText = () => {
    setShowFullText(!showFullText);
  };

  // ArticleCard component for Find Destination screen with path prop
  const renderArticleCard = ({ item }) => {
    return (
      <FindArticleCard
        key={item.articleId}
        articleItem={item}
        path={`${pathId}/${item.articleId}/places`}
      />
    );
  };

  return (
    <View>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={articleData}
          renderItem={renderArticleCard}
          keyExtractor={(item) => item.articleId} // extract unique key for each item
          numColumns={2} // display items in 2 columns
          columnWrapperStyle={{
            justifyContent: "space-between", //items spaced evenly
          }}
          contentContainerStyle={{ paddingHorizontal: 15 }} // add padding to left and right
          ListHeaderComponent={
            <View>
              <TextInput
                style={styles.input}
                placeholder="Search Destination"
                onSubmitEditing={handleSearch}
              />
              {isLoading ? (
                <ActivityIndicator />
              ) : (
                <View>
                  <Text
                    style={[GlobalStyles.bodySmallRegular, styles.subtitleText]}
                  >
                    {destinationData.country}
                  </Text>
                  <Text
                    style={[GlobalStyles.titleLargeRegular, styles.titleText]}
                  >
                    {destinationData.destinationName}
                  </Text>
                  {showFullText ? (
                    <View>
                      <Text
                        style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                      >
                        {destinationData.description}
                      </Text>
                      <TouchableOpacity onPress={toggleFullText}>
                        <Text
                          style={[styles.para, GlobalStyles.bodySmallRegular]}
                        >
                          Read Less
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      <Text
                        style={[GlobalStyles.bodySmallRegular, styles.bodyText]}
                      >
                        {destinationData.description?.slice(0, 50)}
                        {"... "}
                      </Text>
                      <TouchableOpacity onPress={toggleFullText}>
                        <Text
                          style={[GlobalStyles.bodySmallRegular, styles.para]}
                        >
                          Read More
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          }
          // hide scroll indicator
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default FindDestination;

const styles = StyleSheet.create({
  image: {
    height: 250,
    // width: 365,
    marginTop: 20,
    borderRadius: 5,
  },
  subtitleText: {
    marginTop: 30,
    marginBottom: 10,
  },
  titleText: {
    marginBottom: 10,
    fontSize: 25,
  },
  bodyText: {
    overflow: "hidden",
    maxWidth: 350,
  },
  para: {
    marginTop: 10,
    marginBottom: 30,
    textDecorationLine: "underline",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 15,
  },
});

// SUMMARY: This code sets up the destination screen in the Find section of the Trip Plan. It fetches the destination data from Firebase using the tripLocation prop, where the tripLocation matches the destinationName. It also uses the useArticleData hook to fetch the article data from Firebase using the pathId. It renders an ArticleCardDestination component for each article in the articleData state variable. It renders the cards in a grid format using FlatList. The ListHeader Component is used to display the destination data.

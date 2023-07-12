import { StyleSheet, Text, View, StatusBar, FlatList } from 'react-native'
import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";
import PlaceCard from "../components/PlaceCard";

const ArticleScreen = ({ route }) => {
  const { pathId } = route.params;

  const [placeData, setPlaceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPlaceData = async () => {
    const querySnapshot = await getDocs(collection(FIREBASE_DB, pathId));
    const data = querySnapshot.docs.map((doc) => doc.data());
    setPlaceData(data);
  };

  useEffect(() => {
    getPlaceData();
    setLoading(false);
  }, []);

  return (
    <View style={styles.constainer}>
      {loading && <Text>Loading...</Text>}
      
        {!loading && (
          <FlatList
            data={placeData}
            renderItem={({ item }) => (
              <PlaceCard
            key={item.placeId}
            address={item.placeAddress}
            category={item.placeCategory}
            contact={item.placeContact}
            description={item.placeDescription}
            googleMap={item.placeGoogleMapLink}
            hours={item.placeHours}
            image={item.placeImage}
            lattitude={item.placeLattitude}
            longitude={item.placeLongitude}
            saved={item.placeSaved}
            title={item.placeTitle}
            website={item.placeWebsite}
            path={`${pathId}/${item.placeId}`}
          />
            )}
            keyExtractor={(item) => item.placeId}
          />
        )}
    </View>
  )
}

export default ArticleScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: StatusBar.currentHeight || 0,
  },
});
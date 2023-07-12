import { StyleSheet, Text, View } from 'react-native'
import { useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../../firebaseConfig";

const PlaceScreen = ({ route }) => {
    const { pathId } = route.params;

    const [singlePlaceData, setSinglePlaceData] = useState({});
    const [loading, setLoading] = useState(true);

    const getSinglePlaceData = async () => {
        const docRef = doc(FIREBASE_DB, pathId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const data = docSnap.data()
            setSinglePlaceData(data)
        } else {
            console.log("No such document!")
        }
    }

    useEffect(() => {
        getSinglePlaceData();
        setLoading(false);
    }, []);

  return (
    <View>
        {!loading && (
            <View>
            <Text>{singlePlaceData.placeTitle}</Text>
            <Text>{singlePlaceData.placeAddress}</Text>
            <Text>{singlePlaceData.placeCategory}</Text>
            <Text>{singlePlaceData.placeContact}</Text>
            <Text>{singlePlaceData.placeDescription}</Text>
            <Text>{singlePlaceData.placeGoogleMapLink}</Text>
            <Text>{singlePlaceData.placeHours}</Text>
            <Text>{singlePlaceData.placeImage}</Text>
            <Text>{singlePlaceData.placeLattitude}</Text>
            <Text>{singlePlaceData.placeLongitude}</Text>
            <Text>{singlePlaceData.placeSaved}</Text>
            <Text>{singlePlaceData.placeTitle}</Text>
            <Text>{singlePlaceData.placeWebsite}</Text>
            </View>
        ) }
    </View>
  )
}

export default PlaceScreen

const styles = StyleSheet.create({})
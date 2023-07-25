import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

const usePlaceScreen = (pathId) => {
  const [singlePlaceData, setSinglePlaceData] = useState({});
  const [loading, setLoading] = useState(true);

  const getSinglePlaceData = async () => {
    try {
      const docRef = doc(FIREBASE_DB, pathId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setSinglePlaceData(data);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSinglePlaceData();
  }, [pathId]);

  return { loading, singlePlaceData };
};

export default usePlaceScreen;

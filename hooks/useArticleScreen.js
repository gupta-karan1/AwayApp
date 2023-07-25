import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

const useArticleScreen = (pathId) => {
  const [placeData, setPlaceData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getPlaceData = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, pathId));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setPlaceData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getPlaceData();
  }, [pathId]);

  return {
    loading,
    placeData,
  };
};

export default useArticleScreen;

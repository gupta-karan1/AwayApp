import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

const useDestinationScreen = (pathId) => {
  const [articleData, setArticleData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getArticleData = async () => {
    try {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, pathId));
      const data = querySnapshot.docs.map((doc) => doc.data());
      setArticleData(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getArticleData();
  }, [pathId]);

  return { loading, articleData };
};

export default useDestinationScreen;

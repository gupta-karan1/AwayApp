import { useState, useEffect } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

const useDestinationFeed = () => {
  const [loading, setLoading] = useState(true);
  const [destinationData, setDestinationData] = useState([]);

  const getDestinationData = async () => {
    try {
      const destRef = collection(FIREBASE_DB, "destinations");
      //   const q = query(destRef);
      const q = query(destRef, limit(2));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => doc.data());
      setDestinationData(data);
    } catch (error) {
      console.error("Error fetching explore data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getDestinationData();
  }, []);

  return { loading, destinationData };
};

export default useDestinationFeed;

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

// display articles on the destination screen based on the pathId prop passed to it.

const useDestinationScreen = (pathId) => {
  // custom React Hook that fetches data from the Firestore database based on the provided pathId.
  const [articleData, setArticleData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getArticleData = async () => {
    // an asynchronous function that fetches data from the Firestore collection based on the provided pathId.

    try {
      const querySnapshot = await getDocs(collection(FIREBASE_DB, pathId)); // The getDocs function is used to fetch the documents from the collection based on the query created earlier.

      const data = querySnapshot.docs.map((doc) => doc.data()); // The data is then extracted from the querySnapshot using the map function to retrieve the actual data from each document using doc.data().

      setArticleData(data); // The data retrieved from the collection is stored in the articleData state variable using the setArticleData function.

      setLoading(false); // The loading state variable is set to false using the setLoading function to indicate that the data has been fetched.
    } catch (error) {
      console.log(error);

      throw error; // The error is thrown so that it can be handled by the component that calls the useDestinationScreen hook.
    } finally {
      setLoading(false); // The loading state variable is set to false using the setLoading function to indicate that the data has been fetched.
    }
  };

  useEffect(() => {
    //The useEffect hook is used to trigger the getArticleData function whenever the pathId dependency changes. This ensures that the data is fetched whenever the pathId prop passed to the hook changes.

    getArticleData();
  }, [pathId]);

  return { loading, articleData };
};

export default useDestinationScreen;

import { useState, useEffect } from "react"; // These are used to manage state and side effects in functional components.
import { collection, getDocs } from "firebase/firestore"; // imported from the Firebase Firestore library. These are used to interact with the Firestore database and retrieve documents from a collection.
import { FIREBASE_DB } from "../firebaseConfig"; // It represents the Firebase Firestore database instance

// display articles on the destination screen based on the pathId prop passed to it.

const useDestinationScreen = (pathId) => {
  // custom React Hook that fetches data from the Firestore database based on the provided pathId.
  const [articleData, setArticleData] = useState([]); // This state variable holds an array that will contain the data fetched from the Firestore collection. It is initialized as an empty array.
  const [loading, setLoading] = useState(true); // This state variable holds a boolean value that indicates whether the data is still being fetched from the database. It is initialized as true.

  const getArticleData = async () => {
    // an asynchronous function that fetches data from the Firestore collection based on the provided pathId.

    try {
      //uses a try-catch block to handle any errors that may occur during the data retrieval process.
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

  return { loading, articleData }; // The loading state variable is returned from the hook so that it can be used to display a loading indicator while the data is being fetched.
};

export default useDestinationScreen; // The useDestinationScreen hook is exported so that it can be used in other parts of the application.

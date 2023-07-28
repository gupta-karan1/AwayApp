//defines a custom React Hook called useArticleScreen, which is designed to fetch data from a Firebase Firestore collection based on a provided pathId.

import { useState, useEffect } from "react"; // These are used to manage state and side effects in functional components.

import { collection, getDocs } from "firebase/firestore"; // imported from the Firebase Firestore library. These are used to interact with the Firestore database and retrieve documents from a collection.

import { FIREBASE_DB } from "../firebaseConfig"; //  It represents the Firebase Firestore database instance

//Custom hooks enable code reuse and logic separation in React components.
const useArticleScreen = (pathId) => {
  const [placeData, setPlaceData] = useState([]); //This state variable holds an array that will contain the data fetched from the Firestore collection. It is initialized as an empty array.

  const [loading, setLoading] = useState(true); // This state variable holds a boolean value that indicates whether the data is still being fetched from the database. It is initialized as true.

  // an asynchronous function that fetches data from the Firestore collection based on the provided pathId.
  const getPlaceData = async () => {
    //uses a try-catch block to handle any errors that may occur during the data retrieval process.
    try {
      // Inside the try block, it uses the getDocs function to fetch the documents from the specified collection
      const querySnapshot = await getDocs(collection(FIREBASE_DB, pathId));

      // The data is then extracted from the querySnapshot using the map function to retrieve the actual data from each document using doc.data().

      const data = querySnapshot.docs.map((doc) => doc.data());
      // The data retrieved from the collection is stored in the placeData state variable using the setPlaceData function.
      setPlaceData(data);

      // The loading state variable is set to false using the setLoading function to indicate that the data has been fetched.
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //The useEffect hook is used to trigger the getPlaceData function whenever the pathId dependency changes. This ensures that the data is fetched whenever the pathId prop passed to the hook changes.
  useEffect(() => {
    getPlaceData();
  }, [pathId]);

  // The loading state variable is returned from the hook so that it can be used to display a loading indicator while the data is being fetched.
  // The placeData state variable is returned from the hook so that it can be used to display the data fetched from the Firestore collection.
  return {
    loading,
    placeData,
  };
};

export default useArticleScreen;

//Overall, this custom hook encapsulates the data fetching logic for a specific Firestore collection based on the provided pathId. It is designed to be used in React components, allowing them to fetch and manage data from Firestore easily and consistently.

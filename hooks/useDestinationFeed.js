import { useState, useEffect } from "react";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { FIREBASE_DB } from "../firebaseConfig";

// custom React Hook that fetches destinations data from the Firestore database for the explore page. It is used to display destinations from the Firestore collection.
const useDestinationFeed = () => {
  const [loading, setLoading] = useState(true);

  const [destinationData, setDestinationData] = useState([]);

  const getDestinationData = async () => {
    // an asynchronous function that fetches data from the Firestore collection

    try {
      const destRef = collection(FIREBASE_DB, "destinations"); // The collection function is used to create a reference to the destinations collection in the Firestore database.

      //   const q = query(destRef); // use without limit for production

      const q = query(destRef, limit(3)); // limit for testing purposes only - remove for production
      // const q = query(destRef); // limit for testing purposes only - remove for production

      const querySnapshot = await getDocs(q); // The getDocs function is used to fetch the documents from the collection based on the query created earlier.

      const data = querySnapshot.docs.map((doc) => doc.data()); // The data is then extracted from the querySnapshot using the map function to retrieve the actual data from each document using doc.data().

      setDestinationData(data); // The data retrieved from the collection is stored in the destinationData state variable using the setDestinationData function.
    } catch (error) {
      console.error("Error fetching explore data:", error);

      // The error is thrown so that it can be handled by the component that calls the useDestinationFeed hook.
      throw error;
    } finally {
      // The loading state variable is set to false using the setLoading function to indicate that the data has been fetched.
      setLoading(false);
    }
  };

  // The useEffect hook is used to trigger the getDestinationData function whenever component is mounted. This ensures that the data is fetched whenever the component is mounted.
  useEffect(() => {
    getDestinationData();
  }, []);

  return { loading, destinationData };
};

export default useDestinationFeed;

// SUMMARY: Overall, this custom hook encapsulates the data fetching logic for the destinations collection. It is designed to be used in React components, allowing them to fetch and manage data from Firestore easily and consistently.

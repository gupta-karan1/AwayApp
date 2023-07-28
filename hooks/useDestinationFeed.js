import { useState, useEffect } from "react"; // These are used to manage state and side effects in functional components.
import { collection, getDocs, limit, query } from "firebase/firestore"; // imported from the Firebase Firestore library. These are used to interact with the Firestore database and retrieve documents from a collection.
import { FIREBASE_DB } from "../firebaseConfig"; //  It represents the Firebase Firestore database instance

// custom React Hook that fetches destinations data from the Firestore database for the explore page. It is used to display destinations from the Firestore collection.
const useDestinationFeed = () => {
  const [loading, setLoading] = useState(true); // This state variable holds a boolean value that indicates whether the data is still being fetched from the database. It is initialized as true.

  const [destinationData, setDestinationData] = useState([]); // This state variable holds an array that will contain the data fetched from the Firestore collection. It is initialized as an empty array.

  const getDestinationData = async () => {
    // an asynchronous function that fetches data from the Firestore collection

    //uses a try-catch block to handle any errors that may occur during the data retrieval process.
    try {
      const destRef = collection(FIREBASE_DB, "destinations"); // The collection function is used to create a reference to the destinations collection in the Firestore database.

      //   const q = query(destRef); // use without limit for production

      const q = query(destRef, limit(2)); // limit for testing purposes only - remove for production

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

  // The loading state variable is returned from the hook so that it can be used to display a loading indicator while the data is being fetched.
  // The destinationData state variable is returned from the hook so that it can be used to display the data fetched from the Firestore collection.
  return { loading, destinationData };
};

// The useDestinationFeed hook is exported so that it can be used in other parts of the application.
export default useDestinationFeed;

//Overall, this custom hook encapsulates the data fetching logic for the destinations collection. It is designed to be used in React components, allowing them to fetch and manage data from Firestore easily and consistently.

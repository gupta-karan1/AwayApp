// Used to fetch data for the explore page from the Firestore database. It is used to display articles from the Firestore collection based on the articleCategory prop passed to it.

import { useState, useEffect } from "react"; // These are used to manage state and side effects in functional components.
import {
  getDocs,
  limit,
  query,
  collectionGroup,
  where,
} from "firebase/firestore"; // imported from the Firebase Firestore library. These are used to interact with the Firestore database and retrieve documents from a collection.
import { FIREBASE_DB } from "../firebaseConfig"; //  It represents the Firebase Firestore database instance

const useCategoryFeed = (articleCategory) => {
  // custom React Hook that fetches data from the Firestore database based on the provided articleCategory.
  const [loading, setLoading] = useState(true); // This state variable holds a boolean value that indicates whether the data is still being fetched from the database. It is initialized as true.
  const [categoryData, setCategoryData] = useState([]); // This state variable holds an array that will contain the data fetched from the Firestore collection. It is initialized as an empty array.

  const getCategoryData = async () => {
    // an asynchronous function that fetches data from the Firestore collection based on the provided articleCategory.

    //uses a try-catch block to handle any errors that may occur during the data retrieval process.
    try {
      // The query function is used to create a query that fetches documents from the articles collection based on the articleCategory prop passed to the hook.

      const articlesRef = query(
        collectionGroup(FIREBASE_DB, "articles"),
        where("articleCategory", "==", articleCategory)
      );
      // limit is used to limit the number of documents fetched from the collection. This is useful for testing purposes, but it should be removed for production.
      const q = query(articlesRef, limit(2)); // limit for testing purposes only - remove for production

      // const q = query(articlesRef); // use without limit for production
      const querySnapshot = await getDocs(q); // The getDocs function is used to fetch the documents from the collection based on the query created earlier.

      // The data is then extracted from the querySnapshot using the map function to retrieve the actual data from each document using doc.data().
      const data = querySnapshot.docs.map((doc) => doc.data());

      // The data retrieved from the collection is stored in the categoryData state variable using the setCategoryData function.
      setCategoryData(data);
    } catch (error) {
      console.error("Error fetching explore data:", error);
      throw error; // The error is thrown so that it can be handled by the component that calls the useCategoryFeed hook.
    } finally {
      // The loading state variable is set to false using the setLoading function to indicate that the data has been fetched.
      setLoading(false);
    }
  };

  //The useEffect hook is used to trigger the getCategoryData function whenever the articleCategory dependency changes. This ensures that the data is fetched whenever the articleCategory prop passed to the hook changes.
  useEffect(() => {
    getCategoryData();
  }, [articleCategory]);

  // The loading state variable is returned from the hook so that it can be used to display a loading indicator while the data is being fetched.
  // The categoryData state variable is returned from the hook so that it can be used to display the data fetched from the Firestore collection.
  return { loading, categoryData };
};

// The useCategoryFeed hook is exported so that it can be used in other parts of the application.
export default useCategoryFeed;

// Overall, this custom hook encapsulates the data fetching logic for a specific Firestore collection based on the provided articleCategory. It is designed to be used in React components, allowing them to fetch and manage data from Firestore easily and consistently.

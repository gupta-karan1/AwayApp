import { StyleSheet, StatusBar } from "react-native";
import Navigation from "./Navigation";

// refer this for firestore functions: https://firebase.google.com/docs/firestore/query-data/get-data

export default function App() {
  // const [allData, setAllData] = useState([]); // this is the array of all the data from the firestore database

  // const db = getFirestore(app); // this is the firestore database
  // // console.log(db);

  // // get all documents from a collection
  // const getAllDocs = async () => {
  //   const querySnapshot = await getDocs(collection(db, "Destinations"));

  //   const data = querySnapshot.docs.map((doc) => doc.data());
  //   console.log("Destinations", data);
  // };

  // const getAllDocs = async () => {
  //   const querySnapshot = await getDocs(
  //     collection(db, "Destinations", "Lisbon", "Articles")
  //   );
  //   // convert the data into an array of objects
  //   const data = querySnapshot.docs.map((doc) => doc.data());
  //   console.log("Articles", data);
  // };
  // const getAllDocs = async () => {
  //   const querySnapshot = await getDocs(
  //     collection(
  //       db,
  //       "Destinations",
  //       "Lisbon",
  //       "Articles",
  //       "Article 1",
  //       "Places"
  //     )
  //   );
  //   // convert the data into an array of objects
  //   const data = querySnapshot.docs.map((doc) => doc.data());
  //   console.log("Places", data);
  //   setAllData(data);
  // };

  // useEffect(() => {
  //   getAllDocs();
  // }, []);

  return <Navigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: StatusBar.currentHeight || 0,
  },
});

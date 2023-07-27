// import React, { createContext, useContext, useState, useEffect } from "react";
// import {
//   getDocs,
//   collection,
//   query,
//   where,
//   doc,
//   orderBy,
// } from "firebase/firestore";
// import { FIREBASE_DB } from "../firebaseConfig";
// import { AuthContext } from "./AuthContext";

// const TripContext = createContext();

// export const useTripContext = () => useContext(TripContext);

// const TripProvider = ({ children }) => {
//   const [tripData, setTripData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [userId, setUserId] = useState("");
//   const { user } = useContext(AuthContext);

//   useEffect(() => {
//     getUserTripData();
//   }, []);

//   const getUserTripData = async () => {
//     try {
//       setLoading(true);
//       const q = query(
//         collection(FIREBASE_DB, "users"),
//         where("userId", "==", user.uid)
//       );
//       const querySnapshot1 = await getDocs(q);
//       //create reference to this doc
//       const userRef = doc(FIREBASE_DB, "users", querySnapshot1.docs[0].id);
//       setUserId(userRef);

//       const tripQuery = query(
//         collection(userRef, "trips"),
//         orderBy("startDate", "asc")
//       );

//       const querySnapshot2 = await getDocs(tripQuery);
//       const data = querySnapshot2.docs.map((doc) => doc.data());
//       setTripData(data);
//     } catch (error) {
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <TripContext.Provider value={{ tripData, loading, userId }}>
//       {children}
//     </TripContext.Provider>
//   );
// };

// export default TripProvider;

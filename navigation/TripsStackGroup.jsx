import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Trips from "../src/screens/tabScreens/Trips";

const TripsStack = createNativeStackNavigator();

const TripsStackGroup = () => {
  return (
    <TripsStack.Navigator
      initialRouteName="Trips"
      screenOptions={{
        headerTitleAlign: "center",
        // headerTitleStyle: { fontFamily: "Mulish-Bold" },
      }}
    >
      <TripsStack.Screen name="Trips" component={Trips} />
    </TripsStack.Navigator>
  );
};

export default TripsStackGroup;

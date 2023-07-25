import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Trips from "../screens/tabScreens/Trips";
import CreateTripForm from "../screens/TripScreen/CreateTripForm";
import TripPlan from "../screens/TripScreen/TripPlan";
import { useNavigation } from "@react-navigation/native";

const TripsStack = createNativeStackNavigator();

const TripsStackGroup = () => {
  const Navigation = useNavigation();
  return (
    <TripsStack.Navigator
      initialRouteName="Trips"
      screenOptions={{
        headerTitleAlign: "center",
        // headerTitleStyle: { fontFamily: "Mulish-Bold" },
      }}
    >
      <TripsStack.Screen name="Trips" component={Trips} />
      <TripsStack.Screen name="CreateTripForm" component={CreateTripForm} />
      <TripsStack.Screen name="TripPlan" component={TripPlan} />
    </TripsStack.Navigator>
  );
};

export default TripsStackGroup;

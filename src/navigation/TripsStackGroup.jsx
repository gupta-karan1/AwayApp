import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Trips from "../screens/tabScreens/Trips";
import CreateTripForm from "../screens/TripScreen/CreateTripForm";
import TripPlan from "../screens/TripScreen/TripPlan";
import { useNavigation } from "@react-navigation/native";
import { Pressable, Text } from "react-native";

const TripsStack = createNativeStackNavigator();

const TripsStackGroup = () => {
  const Navigation = useNavigation();
  return (
    <TripsStack.Navigator
      initialRouteName="Trips"
      screenOptions={{
        headerTitleAlign: "center",
        animation: "slide_from_right",
        // headerTitleStyle: { fontFamily: "Mulish-Bold" },
      }}
    >
      <TripsStack.Screen
        name="Trips"
        component={Trips}
        options={{
          headerTitle: "My Trips",
        }}
      />
      <TripsStack.Screen
        name="CreateTripForm"
        component={CreateTripForm}
        options={{
          headerTitle: "Create New Trip",
          animation: "slide_from_bottom",
        }}
      />
      <TripsStack.Screen
        name="TripPlan"
        component={TripPlan}
        options={{
          headerTitle: "Trip Plan",

          headerLeft: () => (
            <Pressable onPress={() => Navigation.navigate("Trips")}>
              <Text>Back</Text>
            </Pressable>
          ),
        }}
      />
    </TripsStack.Navigator>
  );
};

export default TripsStackGroup;

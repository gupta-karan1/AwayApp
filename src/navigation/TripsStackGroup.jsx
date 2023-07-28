import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Trips from "../screens/tabScreens/Trips";
import CreateTripForm from "../screens/TripScreen/CreateTripForm";
import TripPlan from "../screens/TripScreen/TripPlan";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// TripsStackGroup is a stack navigator that contains the Trips, CreateTripForm, and TripPlan screens.
const TripsStack = createNativeStackNavigator(); // The createNativeStackNavigator function is used to create a stack navigator.

const TripsStackGroup = () => {
  const Navigation = useNavigation(); // The useNavigation hook is used to access the navigation prop of the TripsStackGroup component.
  return (
    <TripsStack.Navigator
      initialRouteName="Trips"
      screenOptions={{
        headerTitleAlign: "center",
        animation: "slide_from_right", // The animation prop is used to set the animation for the screen transitions.
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
          animation: "slide_from_bottom", // The animation prop is used to set the animation for the screen transitions.
        }}
      />
      <TripsStack.Screen
        name="TripPlan"
        component={TripPlan}
        options={{
          headerTitle: "Trip Plan",
          headerLeft: () => (
            // The headerLeft prop is used to set the headerLeft component for the screen.
            <Pressable onPress={() => Navigation.navigate("Trips")}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </Pressable>
          ),
        }}
      />
    </TripsStack.Navigator>
  );
};

export default TripsStackGroup;

// Overall this stack navigator is used to display the Trips, CreateTripForm, and TripPlan screens. It is used to display the screens in a stack, allowing the user to navigate between them. It is also used to set the screen options for the screens in the stack.

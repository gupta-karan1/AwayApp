import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Trips from "../screens/tabScreens/Trips";
import CreateTripForm from "../screens/TripScreen/CreateTripForm";
import TripPlan from "../screens/TripScreen/TripPlan";
import GlobalStyles from "../GlobalStyles";
// import SavePlaceModal from "../screens/ExploreScreen/SavePlaceModal";
// TripsStackGroup is a stack navigator that contains the Trips, CreateTripForm, and TripPlan screens.

const TripsStack = createNativeStackNavigator(); // The createNativeStackNavigator function is used to create a stack navigator.

const TripsStackGroup = () => {
  return (
    <TripsStack.Navigator
      initialRouteName="Trips"
      screenOptions={{
        headerTitleAlign: "center",
        animation: "slide_from_right",
        // headerTitleStyle: { fontFamily: "Mulish-Bold" },
        headerTintColor: "#63725A",
        headerTitleStyle: GlobalStyles.titleLargeBold,
        headerBackTitle: "Back",
      }}
    >
      <TripsStack.Screen
        name="Trips"
        component={Trips}
        options={{
          headerTitle: "Trips",
        }}
      />

      <TripsStack.Screen
        name="CreateTripForm"
        component={CreateTripForm}
        options={{
          headerTitle: "Add Trip",
          animation: "slide_from_bottom",
        }}
      />
      {/* <TripsStack.Screen
        name="SavePlaceModal"
        component={SavePlaceModal}
        options={{
          title: "Save Place",
          animation: "slide_from_bottom",
          // backBehavior: "initialRoute",
        }}
      /> */}
      <TripsStack.Screen
        name="TripPlan"
        component={TripPlan}
        options={{
          headerShown: false,
          headerTitle: "Trip Plan",
        }}
      />
    </TripsStack.Navigator>
  );
};

export default TripsStackGroup;

// SUMMARY: Overall this stack navigator is used to display the Trips, CreateTripForm, and TripPlan screens. It is used to display the screens in a stack, allowing the user to navigate between them. It is also used to set the screen options for the screens in the stack.

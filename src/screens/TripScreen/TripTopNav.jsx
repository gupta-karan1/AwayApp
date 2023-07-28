import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Plan from "./Plan";
import Chat from "./Chat";
import Find from "./Find";
import { View, Dimensions } from "react-native";

// Create Material Top Tab Navigator instance for Trip Screen
const Tab = createMaterialTopTabNavigator();

// Functional componenet to render top navigation, passing tripLocation prop
function TripTopNav({ tripLocation }) {
  // Get height of the window
  const screenHeight = Dimensions.get("window").height;

  return (
    <View style={{ flex: 1 }}>
      {/* Create Material Top Tab Navigator with 3 screens */}
      <Tab.Navigator
        screenOptions={
          {
            // tabBarScrollEnabled: true,
          }
        }
      >
        <Tab.Screen name="Plan" component={Plan} />
        <Tab.Screen name="Chat" component={Chat} />
        <Tab.Screen
          name="Find"
          component={Find}
          // tripLocation prop as initial parameter
          initialParams={{ tripLocation }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default TripTopNav;

// SUMMARY: This code sets up the top tab navigator using React Navigation's createMaterialTopTabNavigator and defines three screens: Plan, Chat, and Find. The Find screen is passed the tripLocation prop as an initial parameter. This is so the Find screen can use the tripLocation prop to fetch the destination data from Firebase.

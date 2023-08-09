import { Feather } from "@expo/vector-icons";
import ExploreStackGroup from "./ExploreStackGroup";
import TripsStackGroup from "./TripsStackGroup";
import ProfileStackGroup from "./ProfileStackGroup";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../../hooks/AuthContext"; // Import the AuthContext
import LoginStackGroup from "./LoginStackGroup";
import { useContext } from "react";

// This component is used to create the bottom tab navigation for the application.
const Tab = createBottomTabNavigator(); // The createBottomTabNavigator function is used to create the bottom tab navigation.

const Tabs = () => {
  const { isUserLoggedIn } = useContext(AuthContext); // The isUserLoggedIn state variable is retrieved from the AuthContext using the useContext hook.

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
        tabBarHideOnKeyboard: true, // hide tab bar when keyboard is open
        tabBarAllowFontScaling: true, // allow font scaling for tab bar
        headerShown: false, // hide header
        freezeOnBlur: true, // freeze tab bar when screen is not focused
        // lazy: true, // lazy load tab screens
      }}
    >
      <Tab.Screen
        name={"ExploreStackGroup"}
        component={ExploreStackGroup}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={"globe"}
              size={25}
              color={focused ? "tomato" : "gray"}
            />
          ),

          tabBarLabel: "Explore",
        }}
      />
      <Tab.Screen
        name={"TripsStackGroup"}
        component={isUserLoggedIn ? TripsStackGroup : LoginStackGroup}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={"clipboard"}
              size={25}
              color={focused ? "tomato" : "gray"}
            />
          ),

          tabBarLabel: "Trips",
        }}
      />

      <Tab.Screen
        name={"ProfileStackGroup"}
        component={isUserLoggedIn ? ProfileStackGroup : LoginStackGroup}
        options={{
          tabBarIcon: ({ focused }) => (
            <Feather
              name={"user"}
              size={25}
              color={focused ? "tomato" : "gray"}
            />
          ),

          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;

// SUMMARY:  Overall this tabs component is used to create the bottom tab navigation for the application.

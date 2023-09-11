import { Feather } from "@expo/vector-icons";
import ExploreStackGroup from "./ExploreStackGroup";
import TripsStackGroup from "./TripsStackGroup";
import ProfileStackGroup from "./ProfileStackGroup";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthContext } from "../../hooks/AuthContext"; // Import the AuthContext
import LoginStackGroup from "./LoginStackGroup";
import { useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import GlobalStyles from "../GlobalStyles";

// This component is used to create the bottom tab navigation for the application.
const Tab = createBottomTabNavigator(); // The createBottomTabNavigator function is used to create the bottom tab navigation.

const Tabs = () => {
  const { isUserLoggedIn, user } = useContext(AuthContext); // The isUserLoggedIn state variable is retrieved from the AuthContext using the useContext hook.

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#63725A",
        tabBarInactiveTintColor: "#A6A6A6",
        tabBarHideOnKeyboard: true, // hide tab bar when keyboard is open
        tabBarAllowFontScaling: true, // allow font scaling for tab bar
        headerShown: false, // hide header
        // freezeOnBlur: true, // freeze tab bar when screen is not focused
        lazy: true, // lazy load tab screens
        tabBarStyle: {
          // style tab bar
          // height: 500,
          // justifyContent: "center",
          // alignItems: "center",
          // alignContent: "center",
          // paddingBottom: 10,
          // backgroundColor: "#F2F2F2",
          borderTopWidth: 1,
          elevation: 5,
        },
        tabBarLabelStyle: {
          // style tab bar label
          ...GlobalStyles.labelSmallMedium,

          // fontSize: 12,
          // lineHeight: 16,
          paddingBottom: 4,
        },
      }}
    >
      <Tab.Screen
        name={"ExploreStackGroup"}
        component={ExploreStackGroup}
        options={{
          tabBarIcon: ({ focused }) => (
            // <Feather
            //   name={"globe"}
            //   size={25}
            //   color={focused ? "tomato" : "gray"}
            // />
            // <Ionicons name="earth" size={26} color="black" />
            <Ionicons
              name="md-earth-sharp"
              size={23}
              color={focused ? "#63725A" : "#A6A6A6"}
            />
          ),
          tabBarLabel: "Explore",
        }}
      />
      <Tab.Screen
        name={"TripsStackGroup"}
        component={user ? TripsStackGroup : LoginStackGroup}
        options={{
          tabBarIcon: ({ focused }) => (
            // <Feather
            //   name={"clipboard"}
            //   size={25}
            //   color={focused ? "tomato" : "gray"}
            // />
            // <Octicons name="checklist" size={23} color="grey" />
            // <MaterialCommunityIcons
            //   name="clipboard-edit-outline"
            //   size={26}
            //   color="grey"
            // />
            // <MaterialCommunityIcons
            //   name="clipboard-check-multiple-outline"
            //   size={24}
            //   color="grey"
            // />
            // <FontAwesome name="paper-plane-o" size={24} color="black" />
            // <Ionicons name="list-circle-outline" size={24} color="grey" />
            // <Ionicons name="ios-airplane-outline" size={24} color="grey" />
            // <Entypo name="list" size={24} color="grey" />
            // <SimpleLineIcons name="plane" size={21} color="grey" />
            // <FontAwesome5 name="compass" size={24} color="black" />
            // <Octicons name="tasklist" size={22} color="grey" />
            // <Fontisto name="nav-icon-list-a" size={17} color="grey" />
            // <FontAwesome name="th-list" size={20} color="grey" />
            // <MaterialCommunityIcons
            //   name="calendar-edit"
            //   size={24}
            //   color="grey"
            // />
            // <MaterialCommunityIcons
            //   name="calendar-multiselect"
            //   size={24}
            //   color="#63725A"
            // />
            <MaterialIcons
              name="today"
              size={23}
              color={focused ? "#63725A" : "#A6A6A6"}
            />
          ),

          tabBarLabel: "Trips",
        }}
      />

      <Tab.Screen
        name={"ProfileStackGroup"}
        component={user ? ProfileStackGroup : LoginStackGroup}
        options={{
          tabBarIcon: ({ focused }) => (
            // <Feather
            //   name={"user"}
            //   size={22}
            //   color={focused ? "#63725A" : "#A6A6A6"}
            // />
            // <FontAwesome5
            //   name="user-circle"
            //   size={24}
            //   color={focused ? "#63725A" : "#A6A6A6"}
            // />
            // <Ionicons
            //   name="ios-person-outline"
            //   size={25}
            //   color={focused ? "#63725A" : "#A6A6A6"}
            // />
            // <FontAwesome5
            //   name="user"
            //   size={18}
            //   color={focused ? "#63725A" : "#A6A6A6"}
            // />
            // <AntDesign name="user" size={20} color="grey" />
            // <MaterialCommunityIcons
            //   name="face-man-outline"
            //   size={24}
            //   color={focused ? "#63725A" : "#A6A6A6"}
            // />
            // <MaterialIcons
            //   name="person-pin"
            //   size={24}
            //   color={focused ? "#63725A" : "#A6A6A6"}
            // />
            <Ionicons
              name="ios-person-circle-outline"
              size={24}
              color={focused ? "#63725A" : "#A6A6A6"}
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

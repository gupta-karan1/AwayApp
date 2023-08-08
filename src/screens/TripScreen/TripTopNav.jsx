import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Plan from "./Plan";
import Chat from "./Chat";
import Find from "./Find";
import { View } from "react-native";
import { useRoute } from "@react-navigation/native";
import Saved from "./Saved";
import FindDestination from "./FindDestination";
import FindArticle from "./FindArticle";
import FindPlace from "./FindPlace";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Itinerary from "./Itinerary";

// Create Material Top Tab Navigator instance for Trip Screen
const Tab = createMaterialTopTabNavigator();
const Stack = createNativeStackNavigator();

// Functional component to render top navigation, passing tripLocation prop
function TripTopNav({
  tripLocation,
  tripId,
  invitees,
  startDate,
  endDate,
  tripType,
  userId,
}) {
  // console.log("tripId " + tripId);
  return (
    <View style={{ flex: 1 }}>
      {/* Create Material Top Tab Navigator with 3 screens */}
      <Tab.Navigator
        screenOptions={{
          // tabBarScrollEnabled: true,
          swipeEnabled: false,
        }}
      >
        <Tab.Screen
          name="Plan"
          component={Plan}
          initialParams={{
            tripId: tripId,
            invitees: invitees,
            startDate: startDate,
            endDate: endDate,
            userId: userId,
          }}
          options={{
            tabBarLabel: "Plan",
            lazy: true,
          }}
        />
        {tripType === "group" && (
          <Tab.Screen
            name="Chat"
            component={Chat}
            initialParams={{
              tripId: tripId,
              invitees: invitees,
              userId: userId,
            }}
          />
        )}

        <Tab.Screen
          name="FindStack"
          component={FindStack}
          // tripLocation prop as initial parameter
          initialParams={{
            tripLocation: tripLocation,
            tripId: tripId,
            userId: userId,
          }}
          options={{
            tabBarLabel: "Find",
            lazy: true,
          }}
        />
      </Tab.Navigator>
    </View>
  );
}

// stack navigator for Find screen and its components like FindDestination and FindArticle and FindPlace
function FindStack() {
  const route = useRoute();
  const { tripLocation, tripId, userId } = route.params;
  // console.log("tripLocation " + tripLocation);
  // console.log("tripId " + tripId);
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Find"
        component={Find}
        initialParams={{ tripLocation }}
        options={{
          headerShown: false,
          // headerSearchBarOptions: {
          //   headerTitle: "Find",
          //   headerTitleAlign: "center",
          // },
        }}
      />
      <Stack.Screen name="FindDestination" component={FindDestination} />
      <Stack.Screen
        name="FindArticle"
        component={FindArticle}
        options={{
          headerShown: false,
          // headerTitle: "Article",
          // headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="FindPlace"
        component={FindPlace}
        options={{
          headerShown: false,
          // headerTitle: "Place",
          // headerTitleAlign: "center",
        }}
        initialParams={{ tripId: tripId, userId: userId }}
      />
    </Stack.Navigator>
  );
}

export default TripTopNav;

// SUMMARY: This code sets up the top tab navigator using React Navigation's createMaterialTopTabNavigator and defines three screens: Plan, Chat, and Find. The Find screen is passed the tripLocation prop as an initial parameter. This is so the Find screen can use the tripLocation prop to fetch the destination data from Firebase.

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Plan from "./Plan";
import Chat from "./Chat";
import Find from "./Find";
import { StatusBar, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import FindDestination from "./FindDestination";
import FindArticle from "./FindArticle";
import FindPlace from "./FindPlace";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import GlobalStyles from "../../GlobalStyles";
import Saved from "./Saved";
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
  return (
    <Tab.Navigator
      screenOptions={{
        // tabBarScrollEnabled: true,
        // swipeEnabled: false,
        animationEnabled: true,
        tabBarActiveTintColor: "#63725A",
        tabBarInactiveTintColor: "#C4C4C4",
        tabBarIndicatorStyle: {
          backgroundColor: "#63725A",
        },
        // tabBarAllowFontScaling: true,
        // tabBarGap: 0,
        // lazy: true,

        tabBarLabelStyle: {
          fontFamily: "Mulish-Regular",
          fontSize: 14,
          lineHeight: 16,
          textTransform: "capitalize",
        },
      }}
    >
      <Tab.Screen
        name="Itinerary"
        component={Itinerary}
        initialParams={{
          tripId: tripId,
          invitees: invitees,
          startDate: startDate,
          endDate: endDate,
          userId: userId,
        }}
        options={{
          tabBarLabel: "Itinerary",
          lazy: true,
          tabBarStyle: {
            marginBottom: -StatusBar.currentHeight || 0,
            // paddingBottom: StatusBar.currentHeight || 0,
          },
        }}
      />

      <Tab.Screen
        name="Saved"
        component={Saved}
        // tripLocation prop as initial parameter
        initialParams={{
          // tripLocation: tripLocation,
          tripId: tripId,
          userId: userId,
        }}
        options={{
          tabBarLabel: "Wishlist",
          lazy: true,
          tabBarStyle: {
            marginBottom: -StatusBar.currentHeight || 0,
            // paddingBottom: StatusBar.currentHeight || 0,
          },
        }}
      />
      <Tab.Screen
        name="FindStack"
        component={FindStack}
        // tripLocation prop as initial parameter
        initialParams={{
          tripLocation: tripLocation,
          tripId: tripId,
          userId: userId,
          startDate: startDate,
          endDate: endDate,
        }}
        options={{
          tabBarLabel: "Explore",
          lazy: true,
          tabBarStyle: {
            marginBottom: -StatusBar.currentHeight || 0,
            // paddingBottom: StatusBar.currentHeight || 0,
          },
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
          options={{
            tabBarLabel: "Chat",
            tabBarStyle: {
              marginBottom: -StatusBar.currentHeight || 0,
              // paddingBottom: StatusBar.currentHeight || 0,
            },
          }}
        />
      )}
    </Tab.Navigator>
  );
}

// stack navigator for Find screen and its components like FindDestination and FindArticle and FindPlace
function FindStack() {
  const route = useRoute();
  const { tripLocation, tripId, userId, startDate, endDate } = route.params;
  return (
    <Stack.Navigator
      screenOptions={{
        animation: "slide_from_right",
        headerStyle: {
          backgroundColor: "#F9F9F9",
        },
        headerShadowVisible: false,
        headerTitleAlign: "center",
        headerBackTitleVisible: false,
        headerTitleStyle: {
          ...GlobalStyles.titleLargeRegular,
          color: "#63725A",
        },
        headerTintColor: "#63725A",
      }}
    >
      <Stack.Screen
        name="Find"
        component={Find}
        initialParams={{ tripLocation }}
        options={{
          headerTitle: "Destination",
          headerLeft: () => <View></View>,
          // headerShown: false,
        }}
      />
      <Stack.Screen name="FindDestination" component={FindDestination} />
      <Stack.Screen
        name="FindArticle"
        component={FindArticle}
        options={{
          headerTitle: "Article",
        }}
        initialParams={{
          tripId: tripId,
          userId: userId,
          startDate: startDate,
          endDate: endDate,
        }}
      />
      <Stack.Screen
        name="FindPlace"
        component={FindPlace}
        options={{
          headerTitle: "Place",
        }}
        initialParams={{
          tripId: tripId,
          userId: userId,
          startDate: startDate,
          endDate: endDate,
        }}
      />
    </Stack.Navigator>
  );
}

export default TripTopNav;

// SUMMARY: This code sets up the top tab navigator using React Navigation's createMaterialTopTabNavigator and defines three screens: Plan, Chat, and Find. The Find screen is passed the tripLocation prop as an initial parameter. This is so the Find screen can use the tripLocation prop to fetch the destination data from Firebase.

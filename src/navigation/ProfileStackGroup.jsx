import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/tabScreens/Profile";
import { MaterialIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { Pressable, Alert } from "react-native";
import CreateTravelBoard from "../screens/ProfileScreen/CreateTravelBoard";
import BoardScreen from "../screens/ProfileScreen/BoardScreen";
// import ProfilePlace from "../screens/ProfileScreen/ProfilePlace";
import EditProfile from "../screens/ProfileScreen/EditProfile";
import GlobalStyles from "../GlobalStyles";
// import SavePlaceModal from "../screens/ExploreScreen/SavePlaceModal";
import PlaceScreen from "../screens/ExploreScreen/PlaceScreen";

// create stack navigator for profile screen group to allow for navigation between profile, login, and register screens
const ProfileStack = createNativeStackNavigator(); // create stack navigator

// create profile stack group
const ProfileStackGroup = () => {
  const signOutConfirm = () => {
    // Create a confirmation alert
    Alert.alert(
      "Sign-out",
      "Are you sure you want to sign-out?",
      [
        {
          text: "Cancel",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        // If the user confirms, sign out the user
        { text: "OK", onPress: () => handleLogout() },
      ],
      { cancelable: false }
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);

      Alert.alert("Sign-out successful.");
    } catch (error) {
      Alert.alert("Sign-out failed.");
    }
  };
  return (
    <ProfileStack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: "#63725A",
        headerTitleStyle: GlobalStyles.titleLargeBold,
      }}
    >
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerRight: () => (
            <Pressable onPress={signOutConfirm}>
              <MaterialIcons name="logout" size={24} color="#63725A" />
            </Pressable>
          ),
          // headerLeft: null,
        }}
      />

      <ProfileStack.Screen
        name="CreateTravelBoard"
        component={CreateTravelBoard}
        options={{
          headerTitle: "Add Board",
          animation: "slide_from_bottom",
        }}
        // options={({ route }) => ({ title: route.params.name })}
      />
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          headerTitle: "Edit Profile",
          animation: "slide_from_bottom",
        }}
      />
      <ProfileStack.Screen
        name="BoardScreen"
        component={BoardScreen}
        options={{
          headerTitle: "Travel Board",
          animation: "slide_from_right",
        }}
      />
      {/* <ProfileStack.Screen
        name="ProfilePlace"
        component={ProfilePlace}
        options={{
          headerTitle: "Place",
          animation: "slide_from_right",
        }}
      /> */}
      <ProfileStack.Screen
        name="PlaceScreen"
        component={PlaceScreen}
        options={{
          headerTitle: "Place",
          animation: "slide_from_right",
          // autoHideHomeIndicator: true,
        }}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackGroup;

// SUMMARY: This component is used to create a stack navigator for the profile screen group. It is used to allow for navigation between the profile, login, and register screens.

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/tabScreens/Profile";
import { MaterialIcons } from "@expo/vector-icons";
import { signOut } from "firebase/auth";
import { FIREBASE_AUTH } from "../../firebaseConfig";
import { Pressable, Alert } from "react-native";
import CreateTravelBoard from "../screens/ProfileScreen/CreateTravelBoard";
import BoardScreen from "../screens/ProfileScreen/BoardScreen";
import ProfilePlace from "../screens/ProfileScreen/ProfilePlace";
// create stack navigator for profile screen group to allow for navigation between profile, login, and register screens
const ProfileStack = createNativeStackNavigator(); // create stack navigator

// create profile stack group
const ProfileStackGroup = () => {
  //function to handle user logout
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
      }}
    >
      <ProfileStack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerRight: () => (
            <Pressable onPress={handleLogout}>
              <MaterialIcons name="logout" size={24} color="black" />
            </Pressable>
          ),
        }}
      />
      <ProfileStack.Screen
        name="CreateTravelBoard"
        component={CreateTravelBoard}
        options={{
          headerTitle: "Create New Travel Board",
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
      <ProfileStack.Screen
        name="ProfilePlace"
        component={ProfilePlace}
        options={{
          headerTitle: "Place",
          animation: "slide_from_right",
        }}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackGroup;

// SUMMARY: This component is used to create a stack navigator for the profile screen group. It is used to allow for navigation between the profile, login, and register screens.

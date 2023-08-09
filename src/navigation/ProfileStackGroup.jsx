import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/tabScreens/Profile";

// create stack navigator for profile screen group to allow for navigation between profile, login, and register screens
const ProfileStack = createNativeStackNavigator(); // create stack navigator

// create profile stack group
const ProfileStackGroup = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName="Profile"
      screenOptions={{
        headerTitleAlign: "center",
      }}
    >
      <ProfileStack.Screen name="Profile" component={Profile} />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackGroup;

// SUMMARY: This component is used to create a stack navigator for the profile screen group. It is used to allow for navigation between the profile, login, and register screens.

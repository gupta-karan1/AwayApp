import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/tabScreens/Profile";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";

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
      <ProfileStack.Screen name="Login" component={Login} />
      <ProfileStack.Screen name="Register" component={Register} />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackGroup;

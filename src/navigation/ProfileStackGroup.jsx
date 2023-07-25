import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../screens/tabScreens/Profile";
import Login from "../screens/Auth/Login";
import Register from "../screens/Auth/Register";

const ProfileStack = createNativeStackNavigator();
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

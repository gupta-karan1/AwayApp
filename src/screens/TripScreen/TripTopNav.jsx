import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Plan from "./Plan";
import Chat from "./Chat";
import Find from "./Find";

const Tab = createMaterialTopTabNavigator();

function TripTopNav() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Plan" component={Plan} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Find" component={Find} />
    </Tab.Navigator>
  );
}

export default TripTopNav;

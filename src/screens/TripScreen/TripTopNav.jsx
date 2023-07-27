import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Plan from "./Plan";
import Chat from "./Chat";
import Find from "./Find";
import {
  View,
  ScrollView,
  SafeAreaView,
  Dimensions,
  StyleSheet,
} from "react-native";

const Tab = createMaterialTopTabNavigator();

function TripTopNav({ tripLocation }) {
  const screenHeight = Dimensions.get("window").height;
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator>
        <Tab.Screen name="Plan" component={Plan} />
        <Tab.Screen name="Chat" component={Chat} />
        <Tab.Screen
          name="Find"
          component={Find}
          initialParams={{ tripLocation }}
        />
      </Tab.Navigator>
    </View>
  );
}

export default TripTopNav;

import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigation from "./TabNavigation"; // Your bottom tabs
import DetailsScreen from "../Screens/DetailsScreen/DetailsScreen"; // New details screen
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../Utils/Colors";

export type RootStackParamList = {
  CarConnect: undefined;
  Main: undefined;
  Details: { selectedStation: any }; // Passing selected station data
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigation} />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "Station Details",
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 10 }}>
                <Ionicons name="chevron-back" size={30} color={Colors.PRIMARY} />
              </TouchableOpacity>
            ),
          })}
      />
    </Stack.Navigator>
  );
}

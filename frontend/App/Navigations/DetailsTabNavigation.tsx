import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import InfoScreen from "../Screens/DetailsScreen/SubScreen/InfoScreen";
import ChargersScreen from "../Screens/DetailsScreen/SubScreen/ChargersScreen";
import ReviewsScreen from "../Screens/DetailsScreen/SubScreen/ReviewsScreen";
import Colors from "../Utils/Colors";
import { SafeAreaView, View } from "react-native";

const Tab = createMaterialTopTabNavigator();

export default function DetailsTabNavigation() {
  return (<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.PRIMARY, // Active tab color
        tabBarIndicatorStyle: { backgroundColor: Colors.PRIMARY }, // Underline indicator
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
        tabBarStyle: { backgroundColor: "white" },
        animationEnabled: false,
      }}
    >
      <Tab.Screen name="Info" component={InfoScreen} />
      <Tab.Screen name="Chargers" component={ChargersScreen} />
      <Tab.Screen name="Reviews" component={ReviewsScreen} />
    </Tab.Navigator>
    </SafeAreaView>
  );
}

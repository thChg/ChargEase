import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import InfoScreen from "../Screens/DetailsScreen/SubScreen/InfoScreen";
import ReviewsScreen from "../Screens/DetailsScreen/SubScreen/ReviewsScreen";
import Colors from "../Utils/Colors";
import { SafeAreaView, View } from "react-native";

const Tab = createMaterialTopTabNavigator();

export default function DetailsTabNavigation({selectedStation}) {
  return (<SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarIndicatorStyle: { backgroundColor: Colors.PRIMARY },
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
        tabBarStyle: { backgroundColor: "white" },
        animationEnabled: false,
      }}
    >
      <Tab.Screen
          name="Info"
          children={() => <InfoScreen selectedStation={selectedStation} />}
        />
        <Tab.Screen
          name="Reviews"
          children={() => <ReviewsScreen selectedStation={selectedStation} />}
        />
    </Tab.Navigator>
    </SafeAreaView>
  );
}

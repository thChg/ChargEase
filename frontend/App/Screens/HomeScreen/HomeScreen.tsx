import { SafeAreaView, StatusBar, View } from "react-native";
import MapComponent from "./MapComponent";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CarLoginPopup from "../../Components/CarLoginPopup";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import { Region } from "react-native-maps";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useSelector } from "react-redux";
import { RootState } from "../../Utils/Redux/Store";

export default function HomeScreen() {
  const chargingStations = useSelector(
    (state: RootState) => state.ChargingStations.chargingStations
  );
  const [modalVisible, setModalVisible] = useState(true);
  const [userLocation, setUserLocation] = useState<Region | null>(null);

  return (
    <View style={{ flex: 1 }}>
      {chargingStations.length === 0 && (
        <CarLoginPopup
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          userLocation={userLocation}
        />
      )}
      <MapComponent
        userLocation={userLocation}
        setUserLocation={setUserLocation}
      />
    </View>
  );
}

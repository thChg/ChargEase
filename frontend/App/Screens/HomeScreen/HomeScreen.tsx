import { SafeAreaView, View } from 'react-native';
import MapComponent from './MapComponent';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CarLoginPopup from '../../Components/CarLoginPopup';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { Region } from 'react-native-maps';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(true);  
  const [userLocation, setUserLocation] = useState<Region | null>(null);
  // Check if it's the first visit when screen is focused (navigating to HomeScreen)
  useFocusEffect(
    React.useCallback(() => {
      const checkFirstVisit = async () => {
        const hasVisited = await AsyncStorage.getItem('hasVisitedHome');
        if (!hasVisited) {
          setModalVisible(true);
          await AsyncStorage.setItem('hasVisitedHome', 'true');
        }
      };
      checkFirstVisit();
    }, [])
  );

  return (
    <View style={{ flex: 1 }}>
      <CarLoginPopup modalVisible={modalVisible} setModalVisible={setModalVisible} userLocation={userLocation}/>
      <MapComponent userLocation={userLocation} setUserLocation={setUserLocation}/>
    </View>
  );
}

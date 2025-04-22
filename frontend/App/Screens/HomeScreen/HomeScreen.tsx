import { SafeAreaView, View } from 'react-native';
import MapComponent from './MapComponent';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CarLoginPopup from '../../Components/CarLoginPopup';
import { useRoute, useFocusEffect } from '@react-navigation/native';
import { Region } from 'react-native-maps';
import { useAuth, useUser } from '@clerk/clerk-expo';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(true);  
  const [userLocation, setUserLocation] = useState<Region | null>(null);
    const handleGetToken = async () => {
      const {getToken} = useAuth()
      const token = await getToken();
      await AsyncStorage.setItem('clerkToken', token);
    };
    
    handleGetToken();
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

    const {user} = useUser();
    console.log(`user: ${user?.lastName} ${user?.id}`);
    
    return (
    <View style={{ flex: 1 }}>
      <CarLoginPopup modalVisible={modalVisible} setModalVisible={setModalVisible} userLocation={userLocation}/>
      <MapComponent userLocation={userLocation} setUserLocation={setUserLocation}/>
    </View>
  );
}

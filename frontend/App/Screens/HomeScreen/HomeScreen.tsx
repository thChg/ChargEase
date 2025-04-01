import { SafeAreaView, View } from 'react-native'
import MapComponent from './MapComponent'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import CarLoginPopup from '../../Components/CarLoginPopup';

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState<boolean>(true);

  useEffect(() => {
    const checkFirstVisit = async () => {
      const hasVisited = await AsyncStorage.getItem('hasVisitedHome');
      if (!hasVisited) {
        setModalVisible(true);
        await AsyncStorage.setItem('hasVisitedHome', 'true');
      }
    };
    checkFirstVisit();
  }, []);

  return (
    <View style={{flex: 1}}>
      <CarLoginPopup modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <MapComponent/>
    </View>
  )
}
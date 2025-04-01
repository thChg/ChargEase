import React from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import DetailsTabNavigation from "../../Navigations/DetailsTabNavigation";

export default function DetailsScreen({ route }) {
    const {selectedStation} = route.params;
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{selectedStation.title}</Text>
          <Text style={styles.subtitle}>longitude: {selectedStation.longitude}</Text>
          <Text style={styles.subtitle}>latitude: {selectedStation.latitude}</Text>
        </View>
  
        <DetailsTabNavigation />
      </SafeAreaView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    header: {
      padding: 16,
      backgroundColor: "white",
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      flexDirection: "column",
      gap: 10,
    },
    title: {
      fontSize: 20,
      fontWeight: "bold",
    },
    subtitle: {
      fontSize: 14,
      color: "gray",
    },
  });

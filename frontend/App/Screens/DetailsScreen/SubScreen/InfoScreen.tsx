import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import Colors from "../../../Utils/Colors";

const InfoScreen = ({ selectedStation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>General Info</Text>
          <Ionicons
            name="information-circle-sharp"
            size={25}
            color={Colors.PRIMARY}
          />
        </View>
        {/* <Text style={styles.text}>{selectedStation.description || "No description available."}</Text> */}
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam
          sapiente, corporis animi distinctio aliquid neque excepturi dolores
          similique, laboriosam corrupti nulla, commodi culpa accusantium ipsum
          blanditiis? Nesciunt necessitatibus qui alias.
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>Cost for Parking</Text>
          <Ionicons name="cash-outline" size={25} color={Colors.PRIMARY} />
        </View>
        <Text style={styles.text}>
          {selectedStation.parkingCost
            ? `$${selectedStation.parkingCost} / hour`
            : "Free parking"}
        </Text>
      </View>

      <View style={styles.section}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionTitle}>Opening Hours</Text>
          <Ionicons name="time-sharp" size={25} color={Colors.PRIMARY} />
        </View>
        <Text style={styles.text}>
          {selectedStation.openingHour && selectedStation.closingHour
            ? `${selectedStation.openingHour} - ${selectedStation.closingHour}`
            : "No hours available"}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  text: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
});

export default InfoScreen;

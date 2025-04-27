import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Colors from "../../Utils/Colors";
import { Ionicons } from "@expo/vector-icons";

const statusCycle = ["all", "confirmed", "completed", "pending"];

const BookingStatusToggle = ({ currentStatus, setStatus }) => {
  const handlePress = () => {
    const currentIndex = statusCycle.indexOf(currentStatus);
    const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
    setStatus(nextStatus);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Ionicons name="filter" size={20} color="#fff" />
      <Text style={styles.text}>{capitalize(currentStatus)}</Text>
    </TouchableOpacity>
  );
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
    marginVertical: 12,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default BookingStatusToggle;

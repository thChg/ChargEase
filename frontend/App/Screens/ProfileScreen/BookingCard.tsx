import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../Utils/Colors";
import ConfirmDeleteModal from "../../Components/ConfirmDeleteModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Utils/Redux/Store";
import { deleteBooking } from "../../Utils/Redux/Slices/BookingSlice";
import { useUser } from "@clerk/clerk-expo";

const formatFee = (fee: number) =>
  fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const BookingCard = ({ booking, onConfirmDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return Colors.PRIMARY; // emerald
      case "completed":
        return Colors.GRAY;
      case "pending":
        return "#f59e0b"; // amber
      case "cancelled":
      default:
        return "#ef4444"; // red
    }
  };

  const dispatch = useDispatch<AppDispatch>();
  const userId = useUser().user?.id;
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState(false);

  const canDelete = (booking) => {
    const isFuture = new Date(booking.startTime) > new Date();
    return ["pending", "confirmed"].includes(booking.status) && isFuture;
  };



  return (
    <View style={styles.card} key={booking.bookingId}>
      <Text style={styles.title}>{booking.stationName}</Text>

      <View style={styles.locationRow}>
        <Ionicons name="location-outline" size={16} color="#777" />
        <Text style={styles.address}>{booking.stationAddress}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>
          {new Date(booking.startTime).toLocaleString()} →{" "}
          {new Date(booking.endTime).toLocaleString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Parking Fee:</Text>
        <Text style={styles.value}>
          {formatFee(Number(booking.totalCost).toFixed(0))} VNĐ
        </Text>
      </View>

      <Text
        style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(booking.status) },
        ]}
      >
        {booking.status}
      </Text>
      {canDelete(booking) && (
        <TouchableOpacity style={styles.deleteButton} onPress={() => setConfirmDeleteModalVisible(true)}>
          <Ionicons
            name="trash-outline"
            size={16}
            color="#ef4444"
          />
        </TouchableOpacity>
      )}
      <ConfirmDeleteModal
        modalVisible={confirmDeleteModalVisible}
        setModalVisible={setConfirmDeleteModalVisible}
        onConfirmDelete={() => {
          onConfirmDelete(booking.bookingId);
          setConfirmDeleteModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    position: "relative",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  address: {
    marginLeft: 4,
    color: "#4B5563", // gray-600
    fontSize: 14,
  },
  section: {
    marginTop: 12,
  },
  label: {
    color: "#374151", // gray-700
    fontWeight: "500",
  },
  value: {
    marginTop: 4,
    color: "#1F2937", // gray-800
    fontSize: 14,
  },
  statusBadge: {
    position: "absolute",
    bottom: 12,
    right: 12,
    fontSize: 12,
    fontWeight: "600",
    paddingHorizontal: 12,
    paddingVertical: 4,
    color: "#fff",
    borderRadius: 999,
    overflow: "hidden",
  },
  deleteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
});

export default BookingCard;

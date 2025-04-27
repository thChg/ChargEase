import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
  StatusBar,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import Colors from "../../Utils/Colors";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../Utils/Redux/Store";
import SplashScreenComponent from "../SplashScreen/SplashScreen";
import { useEffect, useState } from "react";
import {
  deleteBooking,
  fetchBookingHistory,
} from "../../Utils/Redux/Slices/BookingSlice";
import { Ionicons } from "@expo/vector-icons";
import BookingCard from "./BookingCard";
import BookingStatusToggle from "./BookingStatusToggle";

export default function ProfileScreen() {
  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const { vehicleInfo, loading } = useSelector(
    (state: RootState) => state.VehicleInformation
  );
  const { bookings } = useSelector((state: RootState) => state.Booking);

  useEffect(() => {
    dispatch(fetchBookingHistory({ userID: user?.id }));
  }, [dispatch]);

  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);
  console.log(filteredBookings)
  const handleConfirmDelete = (bookingId) => {
    dispatch(deleteBooking({ bookingId: bookingId, userId: user?.id })).then(
      () => {
        // Refetch the booking history after delete
        dispatch(fetchBookingHistory({ userID: user?.id }));
      }
    );
  };

  if (loading || !user || !vehicleInfo || !bookings)
    return <SplashScreenComponent />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.profileName}>{user?.fullName}</Text>
      </View>

      <View style={styles.mainContent}>
        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.titleText}>User Information</Text>
          <Text style={styles.text}>
            Name: {user?.firstName} {user?.lastName}
          </Text>
          <Text style={styles.text}>
            Email: {user?.primaryEmailAddress?.emailAddress}
          </Text>
        </View>

        <View style={styles.separator} />

        {/* Car Info */}
        <View style={styles.section}>
          <Text style={styles.titleText}>Car Information</Text>
          <View style={styles.carInfoRow}>
            <Text style={styles.carMakeModel}>
              {vehicleInfo.make} {vehicleInfo.model}
            </Text>
            <View style={styles.batteryContainer}>
              <Ionicons name="battery-half" size={18} color="#555" />
              <Text style={styles.batteryText}> {vehicleInfo.battery}%</Text>
            </View>
          </View>
          <Text style={styles.text}>Year: {vehicleInfo.year}</Text>
          <Text style={styles.text}>Range: {vehicleInfo.range} km</Text>
        </View>

        <View style={styles.separator} />

        {/* Booking History */}
        <View style={styles.section}>
          <View style={styles.cardTitle}>
            <Text style={styles.titleText}>Booking History</Text>
            <BookingStatusToggle
              currentStatus={statusFilter}
              setStatus={setStatusFilter}
            />
          </View>
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking.bookingId}
              booking={booking}
              onConfirmDelete={handleConfirmDelete}
            />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.LIGHT_GRAY,
  },
  header: {
    backgroundColor: Colors.PRIMARY,
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
  },
  welcomeText: {
    fontSize: 16,
    color: "#e0e0e0",
    marginBottom: 4,
  },
  profileName: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.WHITE,
  },
  mainContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  section: {
    marginBottom: 16,
  },
  cardTitle: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 10,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.PRIMARY,
  },
  text: {
    fontSize: 15,
    marginBottom: 4,
    color: "#444",
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 12,
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "#ff5c5c",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
  carInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  carMakeModel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  batteryText: {
    fontSize: 15,
    color: "#444",
  },
  textBold: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
    color: "#444",
  },
});

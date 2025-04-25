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
import { useEffect } from "react";
import { fetchBookingHistory } from "../../Utils/Redux/Slices/BookingSlice";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { user } = useUser();
  const dispatch = useDispatch<AppDispatch>();
  const { vehicleInfo, loading } = useSelector(
    (state: RootState) => state.VehicleInformation
  );
  const { bookings } = useSelector(
    (state: RootState) => state.Booking
  );
  
  useEffect(() => {
    dispatch(fetchBookingHistory({ userID: user?.id }));
  }, [dispatch])

  const canDelete = (booking) => {
    const isFuture = new Date(booking.startTime) > new Date();
    return ["pending", "confirmed"].includes(booking.status) && isFuture;
  };

  if (loading) return <SplashScreenComponent />;

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.PRIMARY} />

      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.profileName}>{user?.fullName}</Text>
      </View>

      <View style={styles.mainContent}>
        {/* User Info */}
        <View style={styles.section}>
          <Text style={styles.cardTitle}>User Information</Text>
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
  <Text style={styles.cardTitle}>Car Information</Text>
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

        {/* Booking History (uncomment and plug in booking data when ready) */}
        <View style={styles.section}>
          <Text style={styles.cardTitle}>Booking History</Text>
          {bookings?.bookings?.map((booking) => (
            <View key={booking.bookingId} style={styles.bookingCard}>
            <Text style={styles.textBold}>Station: {booking.stationName}</Text>
            <Text style={styles.text}>Address: {booking.stationAddress}</Text>
            <Text style={styles.text}>
              From: {moment(booking.startTime).format("MMM D, YYYY h:mm A")}
            </Text>
            <Text style={styles.text}>
              To: {moment(booking.endTime).format("MMM D, YYYY h:mm A")}
            </Text>
            <Text style={styles.text}>Status: {booking.status}</Text>
            <Text style={styles.text}>Total Cost: {booking.totalCost.toFixed(2)} VNĐ</Text>
            <Text style={styles.text}>Energy: {booking.energyConsumed} kWh</Text>
          
            {canDelete(booking) && (
              <Pressable
                onPress={() => {
                  Alert.alert(
                    "Cancel Booking",
                    "Are you sure you want to delete this booking?",
                    [
                      { text: "No" },
                      // { text: "Yes", onPress: () => onDeleteBooking(booking.bookingId) }
                    ]
                  );
                }}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>Cancel Booking</Text>
              </Pressable>
            )}
          </View>
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
  bookingCard: {
    backgroundColor: "#fefefe",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  
});

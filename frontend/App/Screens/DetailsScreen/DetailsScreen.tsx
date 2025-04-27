import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import DetailsTabNavigation from "../../Navigations/DetailsTabNavigation";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../Utils/Colors";
import { useNavigation } from "@react-navigation/native";
import StarRating from "../../Components/StarRating";
import api from "../../Utils/axiosInstance";
import BookingModal from "../../Components/BookingModal";
import { useUser } from "@clerk/clerk-expo";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Utils/Redux/Store";
import { fetchBookingHistory } from "../../Utils/Redux/Slices/BookingSlice";

export default function DetailsScreen({ route }: any) {
  const { selectedStation } = route.params;
  const userId = useUser().user?.id;
  const dispatch = useDispatch<AppDispatch>();

  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState();
  useEffect(() => {
    const fetchStationFullInfo = async () => {
      const response = await api.get(`/charger/fullinfo/${selectedStation.id}`);
      setData(response.data);;
    };
    fetchStationFullInfo();
  }, [selectedStation]);

  const navigation = useNavigation<any>();
  const fetchDirection = () => {
    navigation.navigate("Main", {
      screen: "home",
      params: { selectedStation },
    });
  };

  const handleBooking = async (start: Date, end: Date) => {
    try {
      await api.post("/booking", {
        userId,
        stationId: data._id,
        startTime: start,
        endTime: end,
      });
      await dispatch(fetchBookingHistory({ userID: userId }));
    } catch (error) {
      console.error("Error booking the slot:", error);
    }
  };

  return (
    data && (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{data.name}</Text>
          <View style={styles.locationContainer}>
            <Ionicons name="compass-sharp" size={18} color="#555" />
            <Text style={styles.location}>{data.address}</Text>
          </View>
          <View style={styles.distanceContainer}>
            <Ionicons name="location-sharp" size={18} color="#555" />
            <Text style={styles.distance}>{selectedStation.distance} km</Text>
          </View>
          <View style={styles.slotInfoContainer}>
            <Ionicons
              name="car-sharp"
              size={18}
              color={selectedStation.availableSlots === 0 ? "#c0392b" : "#555"}
            />
            <Text
              style={[
                styles.stationAvailaleSlots,
                selectedStation.availableSlots === 0 && styles.noSlots,
              ]}
            >
              {selectedStation.availableSlots === 0
                ? "No slots available"
                : `${selectedStation.availableSlots} slots left`}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>{data.rating.average}</Text>
            <StarRating rating={data.rating.average} />
            <Text style={styles.ratingCount}>
              ({data.rating.totalReviews} reviews)
            </Text>
          </View>
          <View style={styles.interactButtons}>
            <TouchableOpacity style={styles.directionButton} onPress={() => setModalVisible(true)}>
              <Ionicons name="today-outline" size={18} color={Colors.WHITE} />
              <Text style={styles.directionButtonText}>Book now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.directionButton}
              onPress={fetchDirection}
            >
              <Ionicons
                name="paper-plane-outline"
                size={16}
                color={Colors.WHITE}
              />
              <Text style={styles.directionButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        </View>
        <BookingModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          selectedStation={data}
          onConfirmBooking={handleBooking}
        ></BookingModal>
        <DetailsTabNavigation selectedStation={data} />
      </SafeAreaView>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    flexDirection: "column",
    gap: 8,
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
    flexWrap: "wrap",
  },
  location: {
    fontSize: 16,
    color: "#555",
    paddingRight: 20, // for spacing
    flexShrink: 1, // allows text to shrink if needed
    flexWrap: "wrap",
    paddingLeft: 5,
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  distance: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.PRIMARY,
    paddingLeft: 5,
  },
  availableSlotsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    paddingRight: 30,
    alignItems: "center",
  },

  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  ratingText: {
    fontSize: 16,
    color: "#555",
    marginRight: 8,
  },
  ratingCount: {
    fontSize: 14,
    color: "#555",
    marginLeft: 5,
  },
  interactButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
  },
  directionButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  directionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  slotInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  stationAvailaleSlots: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.PRIMARY,
    paddingLeft: 5,
  },

  noSlots: {
    color: "#c0392b", // red when full
  },
});

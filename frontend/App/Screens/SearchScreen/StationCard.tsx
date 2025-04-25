import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { RootStackParamList } from "../../Navigations/AppNavigation";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../Utils/Colors";

interface ChargingStation {
  distance: number;
  id: string;
  latitude: number;
  longitude: number;
  name: string;
  address: string;
  status: string;
  isFavourite: boolean;
  reachable: boolean;
  availableSlots: number;
}

const { width } = Dimensions.get("window");

const StationCard = ({ station }: { station: ChargingStation }) => {
  const detailNavigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();
  const handlePressStation = () => {
    detailNavigation.navigate("Details", { selectedStation: station });
  };

  if (!station) {
    return null;
  }

  return (
    <TouchableOpacity style={styles.stationCard} onPress={handlePressStation}>
      <View>
        <Text style={styles.stationName}>{station.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="compass-sharp" size={18} color="#555" />
          <Text style={styles.stationAddress}>{station.address}</Text>
        </View>
        <View style={styles.distanceContainer}>
          <Ionicons name="location-sharp" size={18} color="#555" />
          <Text style={styles.stationDistance}>
            {Number(station.distance).toFixed(2)} km
          </Text>
        </View>
        <View style={styles.availableSlotsContainer}>
          <Ionicons name="car-sharp" size={18} color="#555" />
          <Text style={styles.stationAvailaleSlots}>
            {station.availableSlots} slots left
          </Text>
        </View>
      </View>
      <View style={styles.bottomRightContainer}>
        <Text
          style={[
            styles.stationAvailability,
            station.status === "unavailable" && styles.unavailableStatus,
          ]}
        >
          {station.status === "unavailable" ? "Unavailable" : "Available"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  stationCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginRight: 15,
    width: width * 0.65, // Adjust width for larger cards
    height: 250, // Adjust height
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    justifyContent: "space-between", // Centers content
    borderWidth: 1,
    borderColor: "rgba(208, 208, 208, 0.55)",
  },
  stationName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  locationContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    paddingRight: 30,
  },
  stationAddress: {
    fontSize: 16,
    color: "#666",
  },
  distanceContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    paddingRight: 30,
    alignItems: "center",
    marginTop: 8,
  },
  stationDistance: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.PRIMARY,
  },
  availableSlotsContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
    paddingRight: 30,
    alignItems: "center",
    marginTop: 8,
  },
  stationAvailaleSlots: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.PRIMARY,
  },
  bottomRightContainer: {
    position: "absolute",
    bottom: 10,
    right: 10,
    padding: 8,
    borderRadius: 8,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  stationAvailability: {
    fontSize: 16,
    fontWeight: "600",
    color: "#27ae60",
    marginTop: 8,
    backgroundColor: "#e0f7fa",
    padding: 8,
    borderRadius: 8,
  },
  unavailableStatus: {
    color: "#c0392b",
    backgroundColor: "#fdecea",
  },
});

export default StationCard;

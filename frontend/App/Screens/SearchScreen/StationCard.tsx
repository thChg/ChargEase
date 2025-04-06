import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../Navigations/AppNavigation";

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
    detailNavigation.navigate("Details", {selectedStation: station});
  }

  return (
    <TouchableOpacity style={styles.stationCard} onPress={handlePressStation}>
      <Text style={styles.stationName}>{station.name}</Text>
      <View>
        <Text style={styles.stationAddress}>{station.address}</Text>
        <Text style={styles.stationDistance}>
          {station.distance.toFixed(1)} km
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
    height: 140, // Adjust height
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
  stationAddress: {
    fontSize: 16,
    color: "#666",
  },
  stationDistance: {
    fontSize: 16,
    fontWeight: "600",
    color: "#27ae60",
    marginTop: 8,
  },
});

export default StationCard;

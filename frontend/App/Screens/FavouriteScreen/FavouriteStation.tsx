import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import chargingStations from "../../Utils/dummyData";
import { Ionicons } from "@expo/vector-icons";
import SearchList from "../HomeScreen/SearchList";
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

interface FavouriteStationProps {
  station: ChargingStation;
  onSelectStation: (station: ChargingStation) => void;
  handleUnfavourite: (station: ChargingStation) => void;
}

const FavouriteStation: React.FC<FavouriteStationProps> = ({
  station,
  onSelectStation,
  handleUnfavourite,
}) => {
  return (
    <TouchableOpacity
      style={styles.stationCard}
      onPress={() => onSelectStation(station)}
    >
      <View style={styles.infoContainer}>
        <Text style={styles.stationTitle}>{station.name}</Text>
        <Text style={styles.stationLocation}>
          11 Nguyen Ngoc Vu, Ba Dinh, Hanoi
        </Text>
        <Text style={styles.stationDistance}>
          Distance: {station.distance} km
        </Text>
      </View>
      <TouchableOpacity onPress={() => handleUnfavourite(station)}>
        <Ionicons name="heart-circle-sharp" size={35} color={Colors.PRIMARY} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  stationCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContainer: {
    flex: 1,
  },
  stationTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stationDistance: {
    fontSize: 14,
    color: "#666",
  },
  stationLocation: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
  },
});

export default FavouriteStation;

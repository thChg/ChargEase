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
        <View style={styles.locationContainer}>
          <Ionicons name="compass-sharp" size={18} color="#555" />
          <Text style={styles.location}>{station.address}</Text>
        </View>
        <View style={styles.distanceContainer}>
          <Ionicons name="location-sharp" size={18} color="#555" />
          <Text style={styles.distance}>{station.distance} km</Text>
        </View>
        <View style={styles.slotInfoContainer}>
          <Ionicons
            name="car-sharp"
            size={18}
            color={station.availableSlots === 0 ? "#c0392b" : "#555"}
          />
          <Text
            style={[
              styles.stationAvailaleSlots,
              station.availableSlots === 0 && styles.noSlots,
            ]}
          >
            {station.availableSlots === 0
              ? "No slots available"
              : `${station.availableSlots} slots left`}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleUnfavourite(station)}>
        <Ionicons
          name="heart-dislike-circle"
          size={35}
          color={Colors.PRIMARY}
        />
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
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
    flexWrap: "wrap",
    paddingBottom: 10,
  },
  location: {
    fontSize: 16,
    color: "#555",
    paddingRight: 20, // for spacing
    flexShrink: 1, // allows text to shrink if needed
    flexWrap: "wrap",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingBottom: 10,
  },
  distance: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.PRIMARY,
    paddingLeft: 5,
  },
  slotInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingBottom: 10,
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

export default FavouriteStation;

import React, { useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import Colors from "../Utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../Navigations/AppNavigation";
import { useUser } from "@clerk/clerk-expo";
import { handleFavouriteStation } from "../Utils/Redux/Slices/ChargingStationSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../Utils/Redux/Store";

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

interface InformationSheetProps {
  selectedStation: ChargingStation | null;
  fetchDirections: (destination: ChargingStation) => void;
}

const InformationSheet: React.FC<InformationSheetProps> = ({
  selectedStation,
  fetchDirections,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const station = useSelector((state: RootState) =>
    selectedStation
      ? state.ChargingStations.chargingStations.find(
          (s) => s.id === selectedStation.id
        )
      : null
  );

  const { user } = useUser();

  const handleNavigation = () => {
    SheetManager.hide("stationDetails");
    navigation.navigate("Details", { selectedStation });
  };

  const handleFavourite = () => {
    dispatch(
      handleFavouriteStation({
        isFavourite: station.isFavourite,
        userID: user.id,
        stationID: station.id,
      })
    );
  };

  return (
    <ActionSheet id="stationDetails">
      {selectedStation && (
        <View style={styles.actionSheet}>
          <View style={styles.header}>
            <Text style={styles.stationTitle}>{selectedStation.name}</Text>
            <TouchableOpacity
              style={styles.favouriteButton}
              onPress={() => handleFavourite()}
            >
              <Ionicons
                name={station.isFavourite ? "heart-dislike" : "heart"}
                size={20}
                color={Colors.WHITE}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.actionSheetContent}>
            <View style={styles.locationContainer}>
              <Ionicons name="compass-sharp" size={18} color="#555" />
              <Text style={styles.location}>{selectedStation.address}</Text>
            </View>
            <View style={styles.distanceContainer}>
              <Ionicons name="location-sharp" size={18} color="#555" />
              <Text style={styles.distance}>{selectedStation.distance} km</Text>
            </View>
            <View style={styles.slotInfoContainer}>
              <Ionicons
                name="car-sharp"
                size={18}
                color={
                  selectedStation.availableSlots === 0 ? "#c0392b" : "#555"
                }
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
          </View>
          <View style={styles.actionSheetButtons}></View>
          <View style={styles.interactButtons}>
            <TouchableOpacity
            
              style={styles.directionButton}
              onPress={() => handleNavigation()}
            >
              <Text style={styles.directionButtonText}>Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.directionButton}
              onPress={() => fetchDirections(selectedStation)}
            >
              <Text style={styles.directionButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => SheetManager.hide("stationDetails")}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}
    </ActionSheet>
  );
};

const styles = StyleSheet.create({
  actionSheet: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    gap: 10,
  },
  stationTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    flexWrap: "wrap",
  },
  locationContainer: {
    flexDirection: "row",
    gap: 5,
    marginTop: 10,
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
  favouriteButton: {
    backgroundColor: Colors.PRIMARY,
    padding: 8,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  actionSheetContent: {
    paddingVertical: 10,
  },
  stationDistance: {
    fontSize: 16,
    color: "#666",
    marginBottom: 15,
  },
  actionSheetButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  interactButtons: {
    flexDirection: "row",
    gap: 10,
  },
  directionButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flex: 1,
  },
  directionButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: "#ccc",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default InformationSheet;

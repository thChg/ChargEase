import React, { useState } from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
    Switch,
    ScrollView,
    StyleSheet,
} from "react-native";
import Colors from "../../Utils/Colors"; // Assuming you have this

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

interface FilterModalProps {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  allStations: ChargingStation[];
  setFilteredStations: (filteredStations: ChargingStation[]) => void;
}

const distances = ["≤1km", "≤2km", "≤5km", "≤10km"];
const slots = [">=10", ">=5", ">=3", ">=1"];

const FilterModal: React.FC<FilterModalProps> = ({
  modalVisible,
  setModalVisible,
  allStations,
  setFilteredStations,
}) => {
  const [selectedDistance, setSelectedDistance] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string | null>(null);
  const [reachable, setReachable] = useState(false);
  const [available, setAvailable] = useState(false);
  const [favourite, setFavourite] = useState(false);

  const handleRemoveFilter = () => {
    setSelectedDistance(null);
    setSelectedSlots(null);
    setReachable(false);
    setAvailable(false);
    setFavourite(false);

    setFilteredStations(allStations);
  };

  const handleApplyFilter = () => {
    let filtered = allStations;

    if (selectedDistance !== null) {
      const maxDistance = Number(selectedDistance.match(/\d+(\.\d+)?/)[0]);
      filtered = filtered.filter(
        (station) => station.distance <= maxDistance
      );
    }

    if (selectedSlots !== null) {
      const maxSlots = Number(selectedSlots.match(/\d+(\.\d+)?/)[0]);
      filtered = filtered.filter(
        (station) => station.availableSlots >= maxSlots!
      );
    }

    if (reachable) {
      filtered = filtered.filter((station) => station.reachable);
    }

    if (available) {
      filtered = filtered.filter((station) => station.status === "available");
    }

    if (favourite) {
      filtered = filtered.filter((station) => station.isFavourite);
    }

    setFilteredStations(filtered);
    setModalVisible(false);
  };

  return (
    <Modal visible={modalVisible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.heading}>Filter</Text>

          <Text style={styles.sectionLabel}>Distance</Text>
          <View style={styles.optionsRow}>
            {distances.map((d) => (
              <TouchableOpacity
                key={d}
                style={[
                  styles.optionButton,
                  selectedDistance === d && styles.selectedOption,
                ]}
                onPress={() => setSelectedDistance(d)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedDistance === d && styles.selectedOptionText,
                  ]}
                >
                  {d}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Available Slots</Text>
          <View style={styles.optionsRow}>
            {slots.map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.optionButton,
                  selectedSlots === s && styles.selectedOption,
                ]}
                onPress={() => setSelectedSlots(s)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedSlots === s && styles.selectedOptionText,
                  ]}
                >
                  {s}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.toggleSection}>
            <Text style={styles.sectionLabel}>Options</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  reachable && styles.enabledToggleButton,
                ]}
                onPress={() =>
                  reachable ? setReachable(false) : setReachable(true)
                }
              >
                <Text
                  style={[
                    styles.toggleLabel,
                    reachable && styles.enabledToggleLabel,
                  ]}
                >
                  Reachable
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  available && styles.enabledToggleButton,
                ]}
                onPress={() =>
                  available ? setAvailable(false) : setAvailable(true)
                }
              >
                <Text
                  style={[
                    styles.toggleLabel,
                    available && styles.enabledToggleLabel,
                  ]}
                >
                  Available
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  favourite && styles.enabledToggleButton,
                ]}
                onPress={() =>
                  favourite ? setFavourite(false) : setFavourite(true)
                }
              >
                <Text
                  style={[
                    styles.toggleLabel,
                    favourite && styles.enabledToggleLabel,
                  ]}
                >
                  Favourite
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemoveFilter}
            >
              <Text style={styles.removeButtonText}>Remove Filters</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={handleApplyFilter}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    marginBottom: 8,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 11,
    margin: 4,
    width: 68,
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  optionText: {
    color: "#333",
  },
  selectedOptionText: {
    color: Colors.WHITE,
  },
  toggleSection: {
    flexDirection: "column",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },
  toggleLabel: {
    fontSize: 16,
    color: "#333",
  },
  enabledToggleLabel: {
    color: Colors.WHITE,
  },
  toggleButton: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 7,
    paddingVertical: 10,
    paddingHorizontal: 35,
    margin: 4,
    width: 150,
    alignItems: "center",
  },
  enabledToggleButton: {
    backgroundColor: Colors.PRIMARY,
    borderColor: Colors.PRIMARY,
  },
  buttonRow: {
    marginTop: 25,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 4,
    marginBottom: 4,
  },
  removeButton: {
    backgroundColor: "#ddd",
    borderRadius: 7,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  applyButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 26,
    borderRadius: 7,
  },
  removeButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
  },
  applyButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FilterModal;

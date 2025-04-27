import React, { useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { Searchbar } from "react-native-paper";
import Color from "../../Utils/Colors";
import { useSelector } from "react-redux";
import { RootState } from "../../Utils/Redux/Store";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../Utils/Colors";

interface ChargingStation {
  distance: number;
  id: string;
  name: string;
  address: string;
  status: string;
  isFavourite: boolean;
  reachable: boolean;
  availableSlots: number;
  latitude: number;
  longitude: number;
}

interface SearchListProps {
  onSelectStation: (station: ChargingStation) => void;
  setIsSearching: (isSearching: boolean) => void;
  isSearching: boolean;
}

const SearchList: React.FC<SearchListProps> = ({
  onSelectStation,
  setIsSearching,
  isSearching,
}) => {
  const { chargingStations } = useSelector(
    (state: RootState) => state.ChargingStations
  );

  const sortedStations = [...chargingStations].sort(
    (a, b) => a.distance - b.distance
  );
  const [searchingResult, setSearchingResult] =
    useState<ChargingStation[]>(chargingStations);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchingResult(sortedStations);
    } else {
      const results = chargingStations
        .filter((station) =>
          station.name.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => a.distance - b.distance);

      setSearchingResult(results);
    }
  };

  return (
    chargingStations && (
      <View>
        {/* Search Input */}
        <Searchbar
          placeholder="Search Charging Stations"
          onChangeText={handleSearch}
          value={searchQuery}
          onFocus={() => setIsSearching(true)}
          onBlur={() => setIsSearching(false)}
          style={styles.searchBar}
          inputStyle={styles.searchText}
          placeholderTextColor={Color.GRAY}
        />

        {/* Search Results Dropdown */}
        {isSearching && (
          <FlatList
            data={searchingResult}
            keyExtractor={(item) => item.id}
            style={styles.resultsContainer}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableWithoutFeedback onPress={() => onSelectStation(item)}>
                <View style={styles.resultItem}>
                  <View style={styles.resultTextContainer}>
                    <Text style={styles.resultName}>{item.name}</Text>
                    <View style={styles.resultDistanceContainer}>
                      <Ionicons
                        name="location-sharp"
                        size={16}
                        color={Colors.PRIMARY}
                      />
                      <Text style={styles.resultDistance}>
                        {Number(item.distance).toFixed(2)} km
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )}
          />
        )}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  searchBar: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 0,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  searchText: {
    fontSize: 16,
    fontWeight: "500",
    color: Color.BLACK,
  },
  resultsContainer: {
    maxHeight: 300,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 100,
    paddingHorizontal: 16,
    backgroundColor: Colors.WHITE,
  },
  resultItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  resultTextContainer: {
    flex: 1,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  resultDistanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },
  resultDistance: {
    fontSize: 14,
    color: "#777",
    marginLeft: 4,
  },
  resultItemPressed: {
    backgroundColor: "#f0f0f0",
  },
});

export default SearchList;

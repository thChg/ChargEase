import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Searchbar } from "react-native-paper";
import { useSelector } from "react-redux";
import { RootState } from "../../Utils/Redux/Store";
import { useEffect, useState } from "react";
import Colors from "../../Utils/Colors";
import StationCard from "./StationCard";
import { Ionicons } from "@expo/vector-icons";
import FilterModal from "./FilterModal";

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

const SearchScreen = () => {
    const stations = useSelector(
      (state: RootState) => state.ChargingStations.chargingStations
    );
  const reachableStations = stations.filter((station) => station.reachable);
  const [reachableResult, setReachableResult] =
    useState<ChargingStation[]>(reachableStations);
  const [chargingStations, setChargingStations] =
    useState<ChargingStation[]>(stations);

  const [filteredStations, setFilteredStations] =
    useState<ChargingStation[]>(stations);

  const [reachableDisplay, setReachableDisplay] = useState<ChargingStation[]>();
  const [stationDisplay, setStationDisplay] = useState<ChargingStation[]>();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const reachableCommon = filteredStations.filter(station => new Set(reachableResult).has(station));
    const stationCommon = filteredStations.filter(station => new Set(chargingStations).has(station));

    setReachableDisplay(reachableCommon);
    setStationDisplay(stationCommon);
  }, [filteredStations, reachableResult, chargingStations])

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setReachableResult(reachableStations);
      setChargingStations(stations);
    } else {
      const stationSearching = stations
        .filter((station) =>
          station.name.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => a.distance - b.distance);
      const reachableSearching = stationSearching.filter(
        (station) => station.reachable
      );

      setReachableResult(reachableSearching);
      setChargingStations(stationSearching);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search Charging Stations"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchText}
          placeholderTextColor={Colors.GRAY}
          onFocus={() => setIsSearching(true)}
          onBlur={() => {setIsSearching(false)}}
        />
        {!isSearching && (
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="funnel" size={27} color={Colors.PRIMARY}></Ionicons>
          </TouchableOpacity>
        )}
      </View>

      {/* Reachable Stations */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Reachable Stations</Text>
        <FlatList
          data={reachableDisplay}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StationCard station={item} />}
        />
      </View>

      {/* All Stations */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>All Stations</Text>
        <FlatList
          data={stationDisplay}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <StationCard station={item} />}
        />
      </View>
      <FilterModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        allStations={stations}
        setFilteredStations={setFilteredStations}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  searchContainer: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchBar: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    flex: 1,
  },
  searchText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.BLACK,
  },
  sectionContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  filterButton: {
    backgroundColor: Colors.WHITE,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    marginLeft: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  listContainer: {
    paddingBottom: 15,
  },
});

export default SearchScreen;

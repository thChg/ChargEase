import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import FavouriteStation from "./FavouriteStation";
import chargingStoations from "../../Utils/dummyData";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Searchbar } from "react-native-paper";
import { AppDispatch, RootState } from "../../Utils/Redux/Store";
import InformationSheet from "../../Components/InformationSheet";
import Colors from "../../Utils/Colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { BottomTabParamList } from "../../Navigations/types";
import { SheetManager } from "react-native-actions-sheet";
import chargingStations from "../../Utils/dummyData";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../../Navigations/AppNavigation";
import { selectFavouriteStations } from "../../Utils/Selectors/chargingStations";
import { handleFavouriteStation } from "../../Utils/Redux/Slices/ChargingStationSlice";
import { useUser } from "@clerk/clerk-expo";

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
type NavigationProps = NativeStackNavigationProp<
  BottomTabParamList,
  "favourite"
>;

export default function FavouriteScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const userID = useUser().user?.id;

  const favouriteStations = useSelector(selectFavouriteStations);

  const [searchingResult, setSearchingResult] =
    useState<ChargingStation[]>(favouriteStations);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedStation, setSelectedStation] =
    useState<ChargingStation | null>(null);

  useEffect(() => {
    setSearchingResult(favouriteStations);
  }, [favouriteStations]);

  const routingNavigation = useNavigation<NavigationProps>();
  const detailNavigation =
    useNavigation<StackNavigationProp<RootStackParamList>>();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchingResult(favouriteStations);
    } else {
      const results = favouriteStations
        .filter((station) =>
          station.name.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => a.distance - b.distance);

      setSearchingResult(results);
    }
  };
  const fetchDirection = (station: ChargingStation) => {
    routingNavigation.navigate("home", { selectedStation: undefined });
    setTimeout(() => {
      routingNavigation.navigate("home", { selectedStation: station });
    }, 100);
  };

  const onSelectStation = (station: ChargingStation) => {
    setSelectedStation(station);
    detailNavigation.navigate("Details", { selectedStation: station });
  };

  const handleUnfavourite = (station: ChargingStation) => {

    dispatch(handleFavouriteStation({
      isFavourite: station.isFavourite,
      userID: userID,
      stationID: station.id,
    }))
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        SheetManager.hide("stationDetails"); // Hide action sheet when leaving screen
      };
    }, [])
  );

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
        />
      </View>
      <FlatList
        style={{ padding: 10 }}
        data={searchingResult}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <FavouriteStation
            station={item}
            onSelectStation={onSelectStation}
            handleUnfavourite={handleUnfavourite}
          />
        )}
      ></FlatList>
      <InformationSheet
        selectedStation={selectedStation}
        fetchDirections={fetchDirection}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 10,
  },
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
    color: Colors.BLACK,
  },
});

import React from "react";
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
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";
import { BottomTabParamList } from "../../Navigations/types";
import StarRating from "../../Components/StarRating";

type NavigationProps = NativeStackNavigationProp<BottomTabParamList, "detail">;

export default function DetailsScreen({ route }: any) {
  const { selectedStation } = route.params;
  const navigation = useNavigation<any>();
  const fetchDirection = () => {
    navigation.navigate("Main", {
      screen: "home",
      params: { selectedStation },
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{selectedStation.name}</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="compass-sharp" size={18} color="#555" />
          <Text style={styles.location}>
            {selectedStation.location} 326 Pho Hoa Binh, Binh Gia, Lang Son
          </Text>
        </View>
        <View style={styles.distanceContainer}>
          <Ionicons name="location-sharp" size={18} color="#555" />
          <Text style={styles.distance}>{selectedStation.distance} km</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>4.5</Text>
          <StarRating
            rating={selectedStation.rating}
          />
          <Text style={styles.ratingCount}>({selectedStation.totalRatings})</Text>
        </View>
        <View style={styles.interactButtons}>
          <TouchableOpacity style={styles.directionButton}>
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
      <DetailsTabNavigation selectedStation={selectedStation} />
    </SafeAreaView>
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
  },
  location: {
    fontSize: 16,
    color: "#555",
  },
  distanceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  distance: {
    fontSize: 16,
    color: "#444",
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
});

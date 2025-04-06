import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StarRating from "../../../Components/StarRating";

interface ReviewScreenProps {
  selectedStation: ChargingStation
}

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

const dummyReview = [
  {
    id: "1",
    username: "john_doe",
    timestamp: "2 hours ago",
    rating: 5,
    comment: "Excellent service and easy to find. Will definitely come back!",
  },
  {
    id: "2",
    username: "sarah123",
    timestamp: "1 day ago",
    rating: 4,
    comment: "Pretty good overall, but the charging speed could be faster.",
  },
  {
    id: "3",
    username: "ecoDriver",
    timestamp: "3 days ago",
    rating: 3,
    comment: "Average experience. Clean station, but a bit crowded.",
  },
  {
    id: "4",
    username: "electricFan",
    timestamp: "1 week ago",
    rating: 5,
    comment: "Super convenient location and fast charging. Loved it!",
  },
  {
    id: "5",
    username: "tesla_girl",
    timestamp: "2 weeks ago",
    rating: 2,
    comment: "Had to wait too long. Only one charger was working.",
  },
]

const ReviewScreen: React.FC<ReviewScreenProps> = ({ selectedStation }) => {
  
  // Dummy reviews (replace with actual data from API)
  const [reviews, setReviews] = useState(selectedStation.reviews || []);
  const [sortedByDate, setSortedByDate] = useState(false);

  // Sort reviews by date
  const sortReviews = () => {
    const sortedReviews = [...reviews].sort((a, b) =>
      sortedByDate ? a.timestamp.localeCompare(b.timestamp) : b.timestamp.localeCompare(a.timestamp)
    );
    setReviews(sortedReviews);
    setSortedByDate(!sortedByDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Rating Summary Section */}
      <View style={styles.ratingSummary}>
        {/* <Text style={styles.ratingNumber}>{Number(selectedStation.rating).toFixed(1)}</Text> */}
        <Text style={styles.ratingNumber}>4.5</Text>
        <StarRating rating={5} />
        <Text style={styles.ratingCount}>({selectedStation.totalRatings})</Text>
        {/* <View style={styles.starRow}>
          {[...Array(Math.floor(selectedStation.rating))].map((_, index) => (
            <Ionicons key={`full-${index}`} name="star" size={20} color="#FFD700" />
          ))}
          {selectedStation.rating % 1 >= 0.5 && <Ionicons name="star-half" size={20} color="#FFD700" />}
          <Text style={styles.reviewCount}>({selectedStation.totalReviews} reviews)</Text>
        </View> */}
        
        {/* Rating Breakdown */}
        {Object.entries(selectedStation.ratingDistribution || {}).map(([star, count]) => (
          <View key={star} style={styles.ratingRow}>
            <Text style={styles.starLabel}>{star}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${(Number(count) / selectedStation.totalReviews) * 100}%` }]} />
            </View>
          </View>
        ))}
      </View>

      {/* Sort Button */}
      <TouchableOpacity style={styles.sortButton} onPress={sortReviews}>
        <Text style={styles.sortButtonText}>Sort by Date</Text>
        <Ionicons name="arrow-down" size={18} color="white" />
      </TouchableOpacity>

      {/* Reviews List */}
      <FlatList
        data={dummyReview}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Text style={styles.username}>{item.username}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
            <View style={styles.starRow}>
              {[...Array(item.rating)].map((_, index) => (
                <Ionicons key={index} name="star" size={16} color="#FFD700" />
              ))}
            </View>
            <Text style={styles.reviewText}>{item.comment}</Text>
          </View>
        )}
      />

      {/* Write a Comment Button */}
      <TouchableOpacity style={styles.commentButton}>
        <Text style={styles.commentButtonText}>Write a Comment</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
  },
  ratingSummary: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  ratingNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  starRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  reviewCount: {
    fontSize: 14,
    color: "#666",
    marginLeft: 5,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  ratingCount: {
    fontSize: 14,
    color: "#555",
    marginLeft: 5,
  },
  starLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: 20,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2ecc71",
  },
  sortButton: {
    flexDirection: "row",
    backgroundColor: "#3498db",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  sortButtonText: {
    fontSize: 16,
    color: "white",
    marginRight: 8,
  },
  reviewCard: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#777",
  },
  reviewText: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
  },
  commentButton: {
    backgroundColor: "#27ae60",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  commentButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

export default ReviewScreen;

import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import StarRating from "../../../Components/StarRating";
import Colors from "../../../Utils/Colors";

interface ReviewScreenProps {
  selectedStation: ChargingStation;
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
];

const ReviewScreen: React.FC<ReviewScreenProps> = ({ selectedStation }) => {
  // Dummy reviews (replace with actual data from API)
  const [reviews, setReviews] = useState(selectedStation.reviews || []);
  const [sortedByDate, setSortedByDate] = useState(false);
  console.log(selectedStation.rating.breakdown)

  return (
      <ScrollView style={styles.container}>
        {/* Rating Summary Section */}
        <View style={styles.ratingSummary}>
          <Text style={styles.ratingNumber}>{Number(selectedStation.rating.totalReviews).toFixed(1)}</Text>
          <StarRating rating={5} />
          <Text style={styles.ratingCount}>
            ({selectedStation.totalRatings})
          </Text>

          {/* Rating Breakdown */}
          {Object.entries(selectedStation.ratingDistribution || {}).map(
            ([star, count]) => (
              <View key={star} style={styles.ratingRow}>
                <Text style={styles.starLabel}>{star}</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${
                          (Number(count) / selectedStation.totalReviews) * 100
                        }%`,
                      },
                    ]}
                  />
                </View>
              </View>
            )
          )}
        </View>
        <TouchableOpacity style={styles.commentButton}>
          <Text style={styles.commentButtonText}>Write a Comment</Text>
        </TouchableOpacity>
        {/* Reviews List */}
        {dummyReview.map((item) => (
    <View key={item.id} style={styles.reviewCard}>
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
  ))}
      </ScrollView>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingNumber: {
    fontSize: 36,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  ratingCount: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  starLabel: {
    width: 24,
    fontSize: 14,
    color: "#444",
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginLeft: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4caf50",
    borderRadius: 4,
  },
  reviewCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  username: {
    fontWeight: "600",
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
  },
  starRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  reviewText: {
    fontSize: 15,
    color: "#555",
    lineHeight: 22,
  },
  commentButton: {
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  commentButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default ReviewScreen;

import React, { useEffect, useState } from "react";
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
import CommentModal from "../../../Components/CommentModal";
import api from "../../../Utils/axiosInstance";
import { useUser } from "@clerk/clerk-expo";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../Utils/Redux/Store";
import { handleCommentStation } from "../../../Utils/Redux/Slices/ChargingStationSlice";

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
  comments: any[];
}

const ReviewScreen: React.FC<ReviewScreenProps> = ({ selectedStation }) => {
  // Dummy reviews (replace with actual data from API)
  const username = useUser().user?.fullName;
  const dispatch = useDispatch<AppDispatch>();
  const [comments, setComments] = useState(selectedStation.comments || []);
  const [rating, setRating] = useState(selectedStation.rating);
  console.log(selectedStation.rating.breakdown);
  console.log(comments);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchStationFullInfo = async () => {
    const response = await api.get(`/charger/fullinfo/${selectedStation._id}`);
    setComments(response.data.comments);
    setRating(response.data.rating);
  };
  
  useEffect(() => {
    fetchStationFullInfo();
  }, []);

  const handleWriteComment = () => {
    setModalVisible(true);
  };

  const handleSubmitComment = async (star: Number, comment: string) => {
    await dispatch(
      handleCommentStation({
        username,
        star,
        comment,
        stationID: selectedStation._id,
      })
    );
    await fetchStationFullInfo();
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Rating Summary Section */}
      <View style={styles.ratingSummary}>
        <View style={styles.leftBox}>
          <Text style={styles.ratingNumber}>
            {Number(rating.average).toFixed(1)}
          </Text>
          <StarRating rating={rating.average} />
          <Text style={styles.ratingCount}>
            ({rating.totalReviews} reviews)
          </Text>
        </View>
        {/* Rating Breakdown */}
        <View style={styles.rightBox}>
          {rating.breakdown.map((starRating) => (
            <View key={starRating.star} style={styles.ratingRow}>
              <Text style={styles.starLabel}>{starRating.star}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${
                        (Number(starRating.count) /
                          rating.totalReviews) *
                        100
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.starRatingCount}>({starRating.count})</Text>
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity
        style={styles.commentButton}
        onPress={handleWriteComment}
      >
        <Text style={styles.commentButtonText}>Leave a Comment!</Text>
      </TouchableOpacity>
      {/* Reviews List */}
      {comments.map((item) => (
        <View key={item._id} style={styles.reviewCard}>
          <View style={styles.reviewHeader}>
            <Text style={styles.username}>{item.username}</Text>
            <Text style={styles.timestamp}>{item.createdAt}</Text>
          </View>
          <View style={styles.starRow}>
            {[...Array(5)].map((_, index) => (
              <Ionicons
                key={index}
                name={index < item.star ? "star" : "star-outline"}
                size={16}
                color="#FFD700"
              />
            ))}
          </View>
          <Text style={styles.reviewText}>{item.comment}</Text>
        </View>
      ))}
      <CommentModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onSubmitComment={handleSubmitComment}
      ></CommentModal>
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
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
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
  leftBox: {
    flex: 1,
    borderRightColor: "#ddd",
    borderRightWidth: 1,
    paddingRight: 10,
    justifyContent: "center",
  },
  rightBox: {
    flex: 1.7,
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
    fontWeight: "600",
    marginLeft: 8,
    textAlign: "center",
    flex: 1,
  },
  progressBar: {
    flex: 5,
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginLeft: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 4,
  },
  starRatingCount: {
    fontSize: 14,
    color: "#444",
    marginLeft: 8,
    fontWeight: "600",
    textAlign: "center",
    flex: 1,
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
    fontSize: 16,
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
    marginTop: 10,
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

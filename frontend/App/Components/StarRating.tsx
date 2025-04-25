import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const fullStars = Math.floor(rating || 0);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <View style={styles.starContainer}>
      {[...Array(fullStars)].map((_, index) => (
        <Ionicons key={`full-${index}`} name="star" size={18} color="#FFD700" />
      ))}
      {halfStar && <Ionicons name="star-half" size={18} color="#FFD700" />}
      {[...Array(emptyStars)].map((_, index) => (
        <Ionicons
          key={`empty-${index}`}
          name="star-outline"
          size={18}
          color="#FFD700"
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },


});

export default StarRating;

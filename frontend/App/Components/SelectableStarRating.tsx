import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SelectableStarRating({ onRatingChange }: { onRatingChange?: (rating: number) => void }) {
  const [rating, setRating] = useState(0);

  const handlePress = (index: number) => {
    setRating(index + 1);
    if (onRatingChange) onRatingChange(index + 1);
  };

  return (
    <View style={styles.starContainer}>
      {[...Array(5)].map((_, index) => (
        <Pressable key={index} onPress={() => handlePress(index)}>
          <Ionicons
            name={index < rating ? "star" : "star-outline"}
            size={32}
            color="#FFD700" // gold color
          />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  starContainer: {
    flexDirection: "row",
    gap: 5,
  },
});
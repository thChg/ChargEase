import React, { useState } from "react";
import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import SelectableStarRating from "./SelectableStarRating";
import { TextInput } from "react-native-gesture-handler";
import Colors from "../Utils/Colors";
import { Ionicons } from "@expo/vector-icons";
import api from "../Utils/axiosInstance";

interface CommentModalProps {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  onSubmitComment: (star: Number, comment: string) => void;
}

const CommentModal: React.FC<CommentModalProps> = ({
  modalVisible,
  setModalVisible,
  onSubmitComment,
}) => {
  const [rating, setRating] = useState<Number>(0);
  const [comment, setComment] = useState<string>("");

  return (
    <Modal visible={modalVisible} transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Leave a comment!</Text>
          <SelectableStarRating onRatingChange={setRating} />

          <TextInput
            placeholder="Type your comment..."
            style={styles.input}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
            placeholderTextColor="#888"
          />
          <View style={styles.buttons}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (rating === 0 || comment.length === 0) && styles.disabledButton
              ]}
              onPress={() => onSubmitComment(rating, comment)}
              disabled={rating === 0 || comment.length === 0}
            >
                <Ionicons name="chatbubble-sharp" size={20} color={Colors.WHITE}/>
              <Text style={styles.submitButtonText}>Submit</Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 100,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
    textAlignVertical: "top",
    fontSize: 16,
  },
  buttons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    gap: 15,
  },
  closeButton: {
    flex: 1,
    backgroundColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  submitButton: {
    flex: 1,
    backgroundColor: Colors.PRIMARY,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: '#ccc', 
    opacity: 0.5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default CommentModal;

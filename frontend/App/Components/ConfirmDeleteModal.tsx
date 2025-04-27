import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";

interface ConfirmDeleteModalProps {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
  onConfirmDelete: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  modalVisible,
  setModalVisible,
  onConfirmDelete,
}) => {
  return (
    <Modal
      visible={modalVisible}
        animationType="fade"
      transparent
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>Confirm delete</Text>
          <Text style={styles.message}>Are you sure you want to delete this reservation?</Text>

          <View style={styles.buttonRow}>
            <Pressable
              style={[styles.button, styles.cancelButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>Close</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.deleteButton]}
              onPress={onConfirmDelete}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmDeleteModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  message: {
    fontSize: 14,
    color: "#555",
    textAlign: "center",
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#E5E7EB",
  },
  cancelText: {
    color: "#374151",
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#EF4444",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "600",
  },
});

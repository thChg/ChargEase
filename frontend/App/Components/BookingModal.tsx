import React, { useState } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Appearance } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import Colors from "../Utils/Colors";
import { Ionicons } from "@expo/vector-icons";
interface BookingModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  selectedStation: any;
  onConfirmBooking: (start: Date, end: Date) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  modalVisible,
  setModalVisible,
  selectedStation,
  onConfirmBooking,
}) => {
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<"start" | "end">("start");

  const colorTheme = Appearance.getColorScheme();
  const showPickerColor = colorTheme === "dark" ? "dark" : "light";

  const showPicker = (mode: "start" | "end") => {
    setPickerMode(mode);
    setPickerVisible(true);
  };

  const handleConfirm = (date: Date) => {
    if (pickerMode === "start") {
      setStartTime(date);
    } else {
      setEndTime(date);
    }
    setPickerVisible(false);
  };

  const handleDone = () => {
    if (startTime && endTime) {
      onConfirmBooking(startTime, endTime);
      setModalVisible(false);
    }
  };

  return (
    <Modal visible={modalVisible} transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Book your slot now!</Text>
          <Text style={styles.stationName}>{selectedStation.name}</Text>

          <View style={styles.datetimeRow}>
            <View style={styles.fromCol}>
              <Text style={styles.label}>From</Text>
              <TouchableOpacity
                style={styles.datetimeButton}
                onPress={() => showPicker("start")}
              >
                <Text style={styles.datetimeText}>
                  {startTime
                    ? moment(startTime).format("MMM D, YYYY • h:mm A")
                    : "Select Start Time"}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.toCol}>
              <Text style={styles.label}>To</Text>
              <TouchableOpacity
                style={styles.datetimeButton}
                onPress={() => showPicker("end")}
              >
                <Text style={styles.datetimeText}>
                  {endTime
                    ? moment(endTime).format("MMM D, YYYY • h:mm A")
                    : "Select End Time"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Buttons in a row */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.modalButton, { backgroundColor: "#ccc" }]}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDone}
              disabled={!startTime || !endTime}
              style={[
                styles.modalButton,
                {
                  backgroundColor:
                    startTime && endTime ? Colors.PRIMARY : "#aaa",
                },
              ]}
            >
            <Ionicons name="checkmark-sharp" size={20} color={Colors.WHITE} />
              <Text style={styles.buttonText}>Book now</Text>
            </TouchableOpacity>
          </View>
        </View>
        <DateTimePickerModal
          isVisible={isPickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={() => setPickerVisible(false)}
          minimumDate={new Date()}
          themeVariant={showPickerColor}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
    textAlign: "center",
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
    color: Colors.PRIMARY,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 5,
  },
  datetimeRow: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  datetimeButton: {
    padding: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  datetimeText: {
    fontSize: 15,
    color: "#333",
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});

export default BookingModal;

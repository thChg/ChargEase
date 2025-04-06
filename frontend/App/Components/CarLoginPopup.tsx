import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../Utils/Colors";
import { useEffect, useState } from "react";
import * as Linking from "expo-linking";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import { fetchChargingStations } from "../Utils/Redux/Slices/ChargingStationSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../Utils/Redux/Store";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface CarLoginPopupProps {
  modalVisible: boolean;
  setModalVisible: (modalVisible: boolean) => void;
}

const BACKEND_URL = "http://192.168.1.8:8080";

const CarLoginPopup: React.FC<CarLoginPopupProps> = ({
  modalVisible,
  setModalVisible,
}) => {
  const dispatch = useDispatch<AppDispatch>()
  const [accessToken, setAccessToken] = useState<string>("");

  const handleRedirect = async (code: string) => {
    if (code) {
      const response = await axios.get(`${BACKEND_URL}/smartcar/callback?code=${code}`);
      setAccessToken(response.data.accessToken);
      dispatch(fetchChargingStations(response.data.accessToken));
      setModalVisible(false); // Close the modal after successful login
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/smartcar/login`);
      
      if (!response.data.url) {
        console.error("Error: No login URL received from backend.");
        return;
      }
      
      const result = await WebBrowser.openAuthSessionAsync(response.data.url);
      setModalVisible(false); // Close the modal after login attempt
      handleRedirect(result.url.split("=")[1]);
    } catch (error) {
      console.error("Smartcar Login Error:", error);
    }
  };

  const handleCloseModal = async () => {
    // Make sure to mark the user as having visited the home
    await AsyncStorage.setItem('hasVisitedHome', 'true');
    setModalVisible(false);
  };

  useEffect(() => {
    const checkFirstVisit = async () => {
      const hasVisited = await AsyncStorage.getItem('hasVisitedHome');
      if (!hasVisited) {
        setModalVisible(true); // Show the modal only if it's the first visit
      }
    };
    checkFirstVisit();
  }, []);

  return (
    <Modal visible={modalVisible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image
            source={require("../../assets/images/smartcar-logo.png")}
            style={styles.image}
          />
          <Text style={styles.text}>
            Please connect to your electrical vehicle to get more detailed
            information.
          </Text>
          <TouchableOpacity
            onPress={() => handleLogin()}
            style={[styles.button, styles.loginButton]}
          >
            <Text style={[styles.buttonText, styles.loginButtonText]}>
              Connect to my vehicle
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleCloseModal}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  text: { fontSize: 15, marginBottom: 20, textAlign: "center" },
  image: { width: 200, height: 200, resizeMode: "contain" },
  button: {
    marginTop: 15,
    backgroundColor: "#ddd",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  loginButton: {
    backgroundColor: Colors.PRIMARY,
  },
  loginButtonText: {
    color: Colors.WHITE,
    fontWeight: "bold",
  },
  buttonText: { fontSize: 16, textAlign: "center", color: "#333" },
});

export default CarLoginPopup;

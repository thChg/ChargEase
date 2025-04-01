import { SafeAreaView, StyleSheet, Text, View } from "react-native";

const ChargersScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Charger screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1, // Ensures the view takes up the full screen
      backgroundColor: "blue",
      justifyContent: "center", // Centers the text
      alignItems: "center",
    },
    text: {
      color: "white", // Ensure text is visible
      fontSize: 18,
      fontWeight: "bold",
    },
  });

export default ChargersScreen;
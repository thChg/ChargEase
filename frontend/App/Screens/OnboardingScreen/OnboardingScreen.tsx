import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "react-native-onboarding-swiper";
import { useNavigation } from "@react-navigation/native";
import Colors from "../../Utils/Colors";

const SkipButton = ({ ...props }) => (
  <TouchableOpacity style={styles.skipButton} {...props}>
    <Text style={styles.skipText}>Skip</Text>
  </TouchableOpacity>
);

const NextButton = ({ ...props }) => (
  <TouchableOpacity style={styles.nextButton} {...props}>
    <Text style={styles.nextText}>Next</Text>
  </TouchableOpacity>
);

const DoneButton = ({ ...props }) => (
  <TouchableOpacity style={styles.doneButton} {...props}>
    <Text style={styles.doneText}>Done</Text>
  </TouchableOpacity>
);

const Dots = ({ selected }: { selected: boolean }) => (
  <View style={[styles.dot, selected ? styles.activeDot : {}]} />
);

const OnboardingScreen = () => {
  const navigation = useNavigation<any>();

  const handleDone = async () => {
    await AsyncStorage.setItem("onboardingSeen", "true");
    navigation.replace("Login"); // Chuyển đến màn hình Login
  };

  return (
    <Onboarding
      onDone={handleDone}
      onSkip={handleDone}
      NextButtonComponent={NextButton}
      SkipButtonComponent={SkipButton}
      DoneButtonComponent={DoneButton}
      DotComponent={Dots} 
      pages={[
        {
          backgroundColor: "#fff",
          image: <Image source={require("../../../assets/images/onboarding1.png")} style={styles.image} />,
          title: "Welcome!",
          subtitle: "Explore our application now.",
        },
        {
          backgroundColor: "#fff",
          image: <Image source={require("../../../assets/images/onboarding2.png")} style={styles.image} />,
          title: "Powerful Functionalities!",
          subtitle: "Find charging stations and book them with ease.",
        },
        {
          backgroundColor: "#fff",
          image: <Image source={require("../../../assets/images/onboarding3.png")} style={styles.image} />,
          title: "Start Now!",
          subtitle: "Let's login and start using ChargEase now.",
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
  skipButton: {
    marginLeft: 10,
    padding: 10,
  },
  skipText: {
    fontSize: 16,
    color: Colors.GRAY,
    fontWeight: "bold",
  },
  nextButton: {
    padding: 10,
    marginRight: 10,
  },
  nextText: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: "bold",
  },
  doneButton: {
    padding: 10,
    marginRight: 10,
  },
  doneText: {
    fontSize: 16,
    color: Colors.PRIMARY,
    fontWeight: "bold",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: Colors.PRIMARY,
    width: 10,
    height: 10,
  },
});

export default OnboardingScreen;

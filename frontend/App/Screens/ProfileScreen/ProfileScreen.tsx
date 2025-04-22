import { View, Text, Button } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "@clerk/clerk-expo";

export default function ProfileScreen() {
  const { signOut } = useAuth();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Screen</Text>
      <Button title="Sign Out" onPress={() => signOut()} />
    </View>
  );
}

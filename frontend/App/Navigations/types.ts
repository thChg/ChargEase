import { NativeStackScreenProps } from "@react-navigation/native-stack";

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
}

export type BottomTabParamList = {
  home: { selectedStation?: ChargingStation | null };
  search: undefined;
  favourite: undefined;
  profile: undefined;
  detail: undefined;
};

export type HomeScreenProps = NativeStackScreenProps<
  BottomTabParamList,
  "home"
>;

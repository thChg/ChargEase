import { createSelector } from "reselect";
import { RootState } from "../Redux/Store"; // adjust path to your store

const getChargingStations = (state: RootState) =>
  state.ChargingStations.chargingStations;

export const selectFavouriteStations = createSelector(
  [getChargingStations],
  (stations) => stations.filter((station) => station.isFavourite)
);
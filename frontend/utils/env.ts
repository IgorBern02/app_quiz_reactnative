import Constants from "expo-constants";

export const API_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_API_URL ?? "http://192.168.1.2:5000";

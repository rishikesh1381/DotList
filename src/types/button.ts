import { ViewStyle, TextStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ButtonProps {
  onPress: () => void;
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?: "primary" | "danger" | "secondary";
  style?: ViewStyle;
  textStyle?: TextStyle;
  iconColor?: string;
} 
import { ViewStyle } from "react-native";

export interface FABProps {
  onPress: () => void;
  icon: React.ReactNode;
  position?: "bottomRight" | "bottomLeft" | "topRight" | "topLeft";
  style?: ViewStyle;
  size?: "small" | "normal" | "large";
  color?: string;
} 
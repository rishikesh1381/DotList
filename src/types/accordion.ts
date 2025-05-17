import { ViewStyle } from "react-native";

export interface AccordionProps {
  title: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  style?: ViewStyle;
} 
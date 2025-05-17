import { ViewStyle } from "react-native";

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  position?: "center" | "bottom";
  animationType?: "fade" | "slide";
  backdropOpacity?: number;
  style?: ViewStyle;
  closeOnBackdropPress?: boolean;
} 
import { ViewStyle } from "react-native";

export interface SwipeableProps {
  id: number;
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  renderRightActions?: () => React.ReactNode;
  style?: ViewStyle;
  swipeableId?: number | null;
  setSwipeableId?: (id: number | null) => void;
} 

export interface SwipeableRef {
  reset: () => void;
}
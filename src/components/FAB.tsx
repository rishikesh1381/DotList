import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  Platform,
  StatusBar,
} from "react-native";
import { FABProps } from "../types/fab";

export const FAB: React.FC<FABProps> = ({
  onPress,
  icon,
  position = "bottomRight",
  style,
  size = "normal",
  color = "#007AFF",
}) => {
  const scale = new Animated.Value(1);
  const statusBarHeight = StatusBar.currentHeight || 0;

  const bottomInset =
    Platform.OS === "ios" ? 34 : Platform.OS === "android" ? 16 : 0;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const getPositionStyle = (): ViewStyle => {
    const baseStyle = {
      position: "absolute" as const,
      margin: 16,
    };

    switch (position) {
      case "bottomRight":
        return {
          ...baseStyle,
          bottom: bottomInset + 16,
          right: 16,
        };
      case "bottomLeft":
        return {
          ...baseStyle,
          bottom: bottomInset + 16,
          left: 16,
        };
      case "topRight":
        return {
          ...baseStyle,
          top: statusBarHeight + 16,
          right: 16,
        };
      case "topLeft":
        return {
          ...baseStyle,
          top: statusBarHeight + 16,
          left: 16,
        };
      default:
        return baseStyle;
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case "small":
        return {
          width: 40,
          height: 40,
        };
      case "large":
        return {
          width: 64,
          height: 64,
        };
      default:
        return {
          width: 56,
          height: 56,
        };
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getPositionStyle(),
        getSizeStyle(),
        { transform: [{ scale }] },
        style,
      ]}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[styles.button, { backgroundColor: color }]}
      >
        {icon}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    zIndex: 1000,
  },
  button: {
    flex: 1,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});

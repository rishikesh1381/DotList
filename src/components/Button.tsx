import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ButtonProps } from "../types/button";

export const Button = ({
  onPress,
  title,
  icon,
  variant = "primary",
  style,
  textStyle,
  iconColor,
}: ButtonProps) => {
  const getBackgroundColor = () => {
    switch (variant) {
      case "danger":
        return "#ff4444";
      case "secondary":
        return "#666";
      default:
        return "#007AFF";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: getBackgroundColor() }, style]}
      onPress={onPress}
    >
      {icon && (
        <Ionicons
          name={icon}
          size={20}
          color={iconColor || "white"}
          style={styles.icon}
        />
      )}
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    minHeight: 48,
  },
  text: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  icon: {
    marginRight: 8,
  },
});

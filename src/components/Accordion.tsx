import React, { useRef } from "react";
import { Animated, StyleSheet, Pressable, View } from "react-native";
import { AccordionProps } from "../types/accordion";

export const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  isExpanded,
  onToggle,
  style,
}) => {
  const heightAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(heightAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  return (
    <View style={[styles.container, style]}>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [styles.header, pressed && { opacity: 0.8 }]}
      >
        {title}
      </Pressable>
      <Animated.View
        style={[
          styles.content,
          {
            maxHeight: heightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 200],
            }),
            opacity: heightAnim,
          },
        ]}
      >
        <Pressable onPress={onToggle}>{children}</Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  content: {
    overflow: "hidden",
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

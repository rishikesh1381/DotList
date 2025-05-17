import React, { useEffect, useRef } from "react";
import {
  Modal as RNModal,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  ViewStyle,
  StatusBar,
  Platform,
} from "react-native";
import { ModalProps } from "../types/modal";

export const Modal: React.FC<ModalProps> = ({
  visible,
  onClose,
  children,
  position = "center",
  animationType = "fade",
  backdropOpacity = 0.5,
  style,
  closeOnBackdropPress = true,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getPositionStyle = (): ViewStyle => {
    if (position === "bottom") {
      return {
        justifyContent: "flex-end",
      };
    }
    return {
      justifyContent: "center",
    };
  };

  const getSlideStyle = (): ViewStyle => {
    if (position === "bottom") {
      return {
        transform: [
          {
            translateY: slideAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [300, 0],
            }),
          },
        ],
      };
    }
    return {
      transform:
        animationType === "slide"
          ? [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                }),
              },
            ]
          : [
              {
                scale: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
    };
  };

  return (
    <RNModal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="none"
      onRequestClose={onClose}
    >
      <StatusBar
        backgroundColor={visible ? "rgba(0,0,0,0.5)" : "transparent"}
        barStyle="light-content"
      />
      <TouchableWithoutFeedback
        onPress={closeOnBackdropPress ? onClose : undefined}
      >
        <Animated.View
          style={[
            styles.container,
            getPositionStyle(),
            {
              backgroundColor: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  "rgba(0,0,0,0)",
                  `rgba(0,0,0,${backdropOpacity})`,
                ],
              }),
            },
          ]}
        >
          <TouchableWithoutFeedback>
            <Animated.View style={[styles.content, getSlideStyle(), style]}>
              {children}
            </Animated.View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    backgroundColor: "white",
    borderRadius: 12,
    width: "90%",
    maxWidth: 500,
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
        elevation: 5,
      },
    }),
  },
});

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Animated,
  PanResponder,
  Dimensions,
  StyleSheet,
  View,
  GestureResponderEvent,
  PanResponderGestureState,
  TouchableOpacity,
} from "react-native";
import { SwipeableProps, SwipeableRef } from "../types/swipeable";

const SWIPE_THRESHOLD = 250;
const PARTIAL_SWIPE_THRESHOLD = 100;
const ACTION_WIDTH = 100;
const ANIMATION_DURATION = 200;

export const Swipeable = forwardRef<SwipeableRef, SwipeableProps>(
  (
    {
      id,
      children,
      onSwipeLeft,
      renderRightActions,
      style,
      swipeableId,
      setSwipeableId,
    },
    ref
  ) => {
    const pan = useRef(new Animated.ValueXY()).current;
    const deleteTranslateX = useRef(new Animated.Value(ACTION_WIDTH)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const reset = () => {
      Animated.parallel([
        Animated.spring(pan.x, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 0,
        }),
        Animated.timing(deleteTranslateX, {
          toValue: ACTION_WIDTH,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }),
      ]).start();
    };

    useEffect(() => {
      if (swipeableId !== id && swipeableId !== null) {
        reset();
      }
    }, [swipeableId, id]);

    useImperativeHandle(ref, () => ({
      reset,
    }));

    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (
          _: GestureResponderEvent,
          gesture: PanResponderGestureState
        ) => {
          return Math.abs(gesture.dx) > Math.abs(gesture.dy);
        },
        onPanResponderMove: (
          _: GestureResponderEvent,
          gesture: PanResponderGestureState
        ) => {
          if (gesture.dx < 0) {
            pan.x.setValue(gesture.dx);
            const progress = Math.min(
              Math.abs(gesture.dx) / PARTIAL_SWIPE_THRESHOLD,
              1
            );
            deleteTranslateX.setValue(ACTION_WIDTH * (1 - progress));
            opacity.setValue(progress);
          }
        },
        onPanResponderRelease: (
          _: GestureResponderEvent,
          gesture: PanResponderGestureState
        ) => {
          if (gesture.dx < -SWIPE_THRESHOLD) {
            // Full swipe - trigger delete
            Animated.parallel([
              Animated.timing(pan.x, {
                toValue: -Dimensions.get("window").width,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
              }),
              Animated.timing(deleteTranslateX, {
                toValue: 0,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 1,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
              }),
            ]).start(() => {
              onSwipeLeft?.();
            });
          } else if (gesture.dx < -PARTIAL_SWIPE_THRESHOLD) {
            // Partial swipe - show delete button
            Animated.parallel([
              Animated.spring(pan.x, {
                toValue: -PARTIAL_SWIPE_THRESHOLD,
                useNativeDriver: true,
                bounciness: 0,
              }),
              Animated.timing(deleteTranslateX, {
                toValue: 0,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 1,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
              }),
            ]).start();
            setSwipeableId?.(id);
          } else {
            // Return to initial position
            Animated.parallel([
              Animated.spring(pan.x, {
                toValue: 0,
                useNativeDriver: true,
                bounciness: 0,
              }),
              Animated.timing(deleteTranslateX, {
                toValue: ACTION_WIDTH,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
              }),
              Animated.timing(opacity, {
                toValue: 0,
                duration: ANIMATION_DURATION,
                useNativeDriver: true,
              }),
            ]).start();
          }
        },
      })
    ).current;

    return (
      <View style={[styles.container, style]}>
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ translateX: pan.x }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          {children}
        </Animated.View>
        {renderRightActions && (
          <Animated.View
            style={[
              styles.rightActions,
              {
                transform: [{ translateX: deleteTranslateX }],
                opacity,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.actionButton}
              onPress={onSwipeLeft}
              activeOpacity={0.7}
            >
              {renderRightActions()}
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    overflow: "hidden",
  },
  content: {
    flex: 1,
    backgroundColor: "white",
  },
  rightActions: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: ACTION_WIDTH,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

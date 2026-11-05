import { useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  PanResponder,
} from "react-native";
import Check from "./Check";
import ThemedText from "./ThemedText";



export function TaskItem({
  task,
  onToggle,
  onRemove,
}: {
  task: Todo;
  onToggle: (_id: number) => void;
  onRemove: (_id: number) => void;
}) {
  const [translateX] = useState(() => new Animated.Value(0));
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 10 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderMove: (_, gesture) => translateX.setValue(gesture.dx),
        onPanResponderRelease: (_, gesture) => {
          if (
            Math.abs(gesture.dx) > 80 ||
            (Math.abs(gesture.dx) > 30 && Math.abs(gesture.vx) > 0.7)
          ) {
            const direction = gesture.dx > 0 ? 1 : -1;
            Animated.timing(translateX, {
              toValue: direction * Dimensions.get("window").width,
              duration: 180,
              useNativeDriver: true,
            }).start(({ finished }) => {
              if (finished) onRemove(task.id);
            });
            return;
          }

          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        },
      }),
    [onRemove, task.id, translateX],
  );
return (
    <Animated.View
      {...panResponder.panHandlers}
      className="w-full rounded-full bg-white p-4 items-center flex-row justify-start gap-5"
      style={{ transform: [{ translateX }] }}
    >
      <Check
        checked={task.checked}
        setChecked={() => onToggle(task.id)}
      />
      <ThemedText themeColor={task.checked ? "text" : "textMuted"}>
        {task.title}
      </ThemedText>
    </Animated.View>
  );
}
import { useState } from "react";
import Add from "@/components/Add";
import Button from "@/components/Button";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/theme";
import { TaskItem } from "@/components/CheckItem";
import { router } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useApp } from "../../context/AppContext";


export default function PickTasks() {
  const { todos, setTodos } = useApp();

  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState("");

  const addTodo = () => {
    const title = newTask.trim();
    if (!title) return;

    setTodos([
      ...todos,
      {
        id: todos.length
          ? todos[todos.length - 1].id + 1
          : 1,
        title,
        checked: true,
      },
    ]);
    setNewTask("");
    setIsAddingTask(false);
  };

  const toggleTask = (id: number) => {
    setTodos(
      todos.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task,
      ),
    );
  };

  const removeTask = (id: number) => {
    setTodos(todos.filter((task) => task.id !== id));
  };


  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("../../assets/images/waves.png")}
        resizeMode="contain"
        pointerEvents="none"
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          aspectRatio: 1,
        }}
      />
      <ScrollView
        className="bg-transparent p-5"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center pt-20 w-full flex-1">
          <View className="w-full pr-30 pb-10">
            <View className="w-full flex-row">
              <ThemedText
                type="subtitle"
                themeColor="text"
              >What’s on your to-do list today?</ThemedText>
              <Image source={require("../../assets/images/splash.png")} className="w-15 h-15 ml-2" />
            </View>
            <ThemedText
              type="default"
              themeColor="textMuted"
            >Choose tasks, swipe to remove, or load a template.</ThemedText>
          </View>
          <View className="w-full pb-5 gap-3">
            {todos.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onRemove={removeTask}
              />
            ))}
            <TouchableOpacity
              className="w-full rounded-full bg-white p-4 items-center flex-row justify-start gap-5"
              onPress={() => setIsAddingTask(true)}
            >
              <Add />
              <ThemedText themeColor="textMuted">
                Add a new task
              </ThemedText>
            </TouchableOpacity>
            {isAddingTask && (
              <View className="w-full rounded-2xl bg-white p-4 gap-3">
                <TextInput
                  autoFocus
                  className="text-primary"
                  placeholder="Enter task"
                  placeholderTextColor={Colors.textMuted}
                  returnKeyType="done"
                  value={newTask}
                  onChangeText={setNewTask}
                  onSubmitEditing={addTodo}
                />
                <Button
                  text="Add Task"
                  onPress={addTodo}
                  disabled={!newTask.trim()}
                />
                <Button
                  text="Cancel"
                  onPress={() => {
                    setNewTask("");
                    setIsAddingTask(false);
                  }}
                  secondary
                />
              </View>
            )}
          </View>
          <View className="w-full pb-5">
            <Button
              text="Load Template"
              onPress={() => router.push("/templates")}
              secondary
            />
          </View>
          <Button
            text="Continue →"
            onPress={() => { 
              setTodos(todos.filter(t=>t.checked))  // nur die ausgewählten Aufgaben kommen weiter
              router.push("/setTimes");
            }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
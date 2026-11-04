import { useState } from "react";
import Add from "@/components/Add";
import Button from "@/components/Button";
import ThemedText from "@/components/ThemedText";
import { Colors } from "@/constants/theme";
import {TaskItem} from "@/components/CheckItem";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";


export default function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Projektpräsentation vorbereiten", checked: false },
  ]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    const title = newTask.trim();
    if (!title) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      {
        id: currentTasks.length
          ? currentTasks[currentTasks.length - 1].id + 1
          : 1,
        title,
        checked: false,
      },
    ]);
    setNewTask("");
    setIsAddingTask(false);
  };

  const toggleTask = (id: number) => {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id ? { ...task, checked: !task.checked } : task,
      ),
    );
  };

  const removeTask = (id: number) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="bg-background p-5"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center pt-20 w-full flex-1">
          <View className="w-full pr-30 pb-10">
            <ThemedText
              type="subtitle"
              themeColor="text"
            >Was steht heute auf deiner Liste?</ThemedText>
            <ThemedText
              type="default"
              themeColor="textMuted"
            >Wähle Aufgaben aus, wische sie zum Entfernen weg oder lade ein Template.</ThemedText>
          </View>
          <View className="w-full pb-5 gap-3">
            {tasks.map((task) => (
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
                Neue Aufgabe hinzufügen
              </ThemedText>
            </TouchableOpacity>
            {isAddingTask && (
              <View className="w-full rounded-2xl bg-white p-4 gap-3">
                <TextInput
                  autoFocus
                  className="text-primary"
                  placeholder="Aufgabe eingeben"
                  placeholderTextColor={Colors.textMuted}
                  returnKeyType="done"
                  value={newTask}
                  onChangeText={setNewTask}
                  onSubmitEditing={addTask}
                />
                <Button
                  text="Aufgabe hinzufügen"
                  onPress={addTask}
                  disabled={!newTask.trim()}
                />
                <Button
                  text="Abbrechen"
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
              text="Template laden"
              onPress={() => { }}
              secondary
            />
          </View>
          <Button
            text="Weiter →"
            onPress={() => { }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
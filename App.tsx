import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, FlatList, TextInput } from "react-native";
import { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

import { Swipeable } from "./src/components/Swipeable";
import { Accordion } from "./src/components/Accordion";
import { Button } from "./src/components/Button";
import { Modal } from "./src/components/Modal";
import { FAB } from "./src/components/FAB";
import { SAMPLE_ITEMS } from "./src/helpers/sampleData";
import { ListItem } from "./src/types/listitem";
import { SwipeableRef } from "./src/types/swipeable";

export default function App() {
  const [notes, setNotes] = useState<ListItem[]>(SAMPLE_ITEMS);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [swipeableId, setSwipeableId] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    subtitle: "",
    description: "",
  });

  const swipeableRefs = useRef<{ [key: number]: SwipeableRef }>({});

  const handleDelete = (id: number) => {
    if (expandedId === id) setExpandedId(null);
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  const handleAddNote = () => {
    if (newNote.title.trim() === "") return;

    const newItem: ListItem = {
      id: Date.now(),
      title: newNote.title,
      subtitle: newNote.subtitle,
      description: newNote.description,
    };

    setNotes([newItem, ...notes]);
    setNewNote({ title: "", subtitle: "", description: "" });
    setModalVisible(false);
  };

  const resetAllSwipeableCards = () => {
    Object.values(swipeableRefs.current).forEach((ref) => ref.reset());
    setSwipeableId(null);
  };

  const handleExpand = (id: number, isExpanded: boolean) => {
    resetAllSwipeableCards();

    setExpandedId(isExpanded ? null : id);
    setSwipeableId(null);
  };

  const renderItem = ({ item }: { item: ListItem }) => {
    const isExpanded = expandedId === item.id;

    return (
      <Swipeable
        ref={(ref) => {
          if (ref) {
            swipeableRefs.current[item.id] = ref;
          }
        }}
        key={item.id}
        id={item.id}
        swipeableId={swipeableId}
        setSwipeableId={setSwipeableId}
        onSwipeLeft={() => handleDelete(item.id)}
        renderRightActions={() => (
          <View style={styles.deleteAction}>
            <Button
              title="Delete"
              icon="trash-outline"
              variant="danger"
              onPress={() => handleDelete(item.id)}
              style={styles.deleteButton}
            />
          </View>
        )}
        style={styles.cardContainer}
      >
        <Accordion
          title={
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          }
          isExpanded={isExpanded}
          onToggle={() => handleExpand(item.id, isExpanded)}
        >
          <Text style={styles.cardSubtitleText}>{item.subtitle}</Text>
          <Text style={styles.cardDescriptionText}>{item.description}</Text>
        </Accordion>
      </Swipeable>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Notes</Text>
        <Text style={styles.noteCount}>
          {notes.length} {notes.length === 1 ? "note" : "notes"}
        </Text>
      </View>
      <FlatList
        data={notes}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={[
          styles.listContent,
          notes.length === 0 && styles.emptyListContent,
          { paddingBottom: 100 },
        ]}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="document-text" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>No notes yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the + button to add a note
            </Text>
          </View>
        )}
      />

      <FAB
        icon={<Ionicons name="add" size={24} color="white" />}
        onPress={() => {
          setModalVisible(true);
          resetAllSwipeableCards();
        }}
        position="bottomRight"
        color="#007AFF"
      />

      <Modal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        position="center"
        animationType="slide"
      >
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Create New Note</Text>

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={newNote.title}
            onChangeText={(text) => setNewNote({ ...newNote, title: text })}
          />

          <TextInput
            style={styles.input}
            placeholder="Subtitle"
            value={newNote.subtitle}
            onChangeText={(text) => setNewNote({ ...newNote, subtitle: text })}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            multiline
            numberOfLines={4}
            value={newNote.description}
            onChangeText={(text) =>
              setNewNote({ ...newNote, description: text })
            }
          />

          <View style={styles.modalButtons}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            />

            <Button
              title="Add Note"
              variant="primary"
              onPress={handleAddNote}
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  noteCount: {
    fontSize: 16,
    color: "#666",
    marginTop: 4,
  },
  emptyListContent: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 400,
  },
  emptyStateText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 16,
    color: "#999",
    marginTop: 8,
    textAlign: "center",
  },
  listContent: {
    padding: 16,
  },
  cardContainer: {
    marginBottom: 12,
    backgroundColor: "white",
    borderRadius: 8,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardSubtitleText: {
    fontSize: 16,
    color: "#666",
  },
  cardDescriptionText: {
    fontSize: 14,
    color: "#999",
  },
  deleteAction: {
    width: 100,
    height: "100%",
  },
  deleteButton: {
    width: "100%",
    height: "100%",
    borderRadius: 0,
  },
  separator: {
    height: 12,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    width: "90%",
    maxWidth: 400,
    alignSelf: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  modalButton: {
    flex: 1,
  },
});

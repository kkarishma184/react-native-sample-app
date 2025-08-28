import { MaterialIcons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useLayoutEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RootStackParamList } from "../../App";

type Props = NativeStackScreenProps<RootStackParamList, "CustomerList">;

const customers = [
  { id: "1", name: "Ted James", city: "Phoenix", state: "Arizona", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "2", name: "Michelle", city: "Encinitas", state: "California", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "3", name: "Zed Bishop", city: "Seattle", state: "Washington", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "4", name: "Tina Adams", city: "Chandler", state: "Arizona", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "5", name: "Igor Minar", city: "Dallas", state: "Texas", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "6", name: "Brad Green", city: "Orlando", state: "Florida", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "7", name: "Misko Hevery", city: "Carey", state: "North Carolina", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
  { id: "8", name: "Heedy Wahlin", city: "Anaheim", state: "California", avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png" },
];

export default function CustomerList({ navigation }: Props) {
  const [isListView, setIsListView] = useState(false);
  
    useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setIsListView((prev) => !prev)}>
          <MaterialIcons
            name={isListView ? "grid-view" : "list"}
            size={24}
            color="#007bff"
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isListView]);

  const renderItem = ({ item }: { item: typeof customers[0] }) => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{item.name}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("EditCustomer", { id: item.id, name: item.name, city: item.city, state: item.state })}
        >
          <MaterialIcons name="edit" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={styles.body}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.details}>
          <Text style={styles.location}>
            {item.city}, {item.state}
          </Text>
          <TouchableOpacity>
            <Text style={styles.link}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={customers}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={2}
      contentContainerStyle={{ padding: 12 }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    margin: 6,
    overflow: "hidden",
    elevation: 3,
  },
  header: {
    backgroundColor: "#007bff",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  body: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  details: {
    flex: 1,
  },
  location: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  link: {
    fontSize: 14,
    color: "#007bff",
    fontWeight: "600",
  },
});
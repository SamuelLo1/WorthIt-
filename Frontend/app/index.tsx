"use client";
import { Text, View, TextInput, TouchableOpacity, Button } from "react-native";
import CurrencySelector from "@/components/currencyDropdown";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Index() {
  const [price, setPrice] = useState("");
  const [itemName, setItemName] = useState("");
  const router = useRouter();

  return (
    <View
      className="flex-col items-center justify-center bg-gray-100 w-full"
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20, // Add padding to the container
      }}
    >
      <Text style={{ marginBottom: 20 }}>Welcome to the Home Screen</Text>{" "}
      {/* Adjust margin here */}
      <Button
        title="Go to Test Screen"
        onPress={() => router.push("/test")} // Navigate to Test Screen
        style={{ marginBottom: 20 }} // Add space between the button and the next elements
      />
      <Text
        className="flex-1 items-center justify-center text-2xl text-blue-500"
        style={{ marginBottom: 20 }} // Add margin below this text
      >
        Worth It
      </Text>
      <View
        className="border-2 border-gray-200 rounded-lg p-4 w-full space-y-4"
        style={{
          width: "90%", // Adjust width to reduce overall width and provide spacing
          marginBottom: 20, // Add margin below the input fields
        }}
      >
        <Text className="text-xl font-semibold">Item Name:</Text>
        <TextInput
          onChangeText={setItemName}
          value={itemName}
          placeholder="Enter item name"
          keyboardType="alpha-numeric"
          className="w-5/8 text-2xl border-gray-200 border-2"
          style={{
            padding: 10,
            marginBottom: 20, // Space between Item Name input and Price
          }}
        />

        <Text className="text-xl font-semibold">Price</Text>
        <TextInput
          onChangeText={setPrice}
          value={price}
          placeholder="Enter price"
          keyboardType="numeric"
          className="w-5/8 text-2xl border-gray-200 border-2"
          style={{
            padding: 10,
          }}
        />
      </View>
      {/* Add some margin to prevent overlapping */}
      <TouchableOpacity
        className="bg-blue-500 p-2 rounded-lg"
        style={{
          marginBottom: 20, // Add margin between button and currency selector
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        <Text className="text-white text-xl font-bold">Check Worth!</Text>
      </TouchableOpacity>
      {/* Adjust the margin above the CurrencySelector */}
      <View style={{ marginTop: 20 }}>
        <CurrencySelector />
      </View>
    </View>
  );
}

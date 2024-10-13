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
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Text>Welcome to the Home Screen</Text>
      <Button
        title="Go to Test Screen"
        onPress={() => router.push("/test")} // Navigate to Test Screen
      />
      <Text className="flex-1 items-center justify-center text-2xl text-blue-500">
        Worth It
      </Text>
      <View className="border-2 border-gray-200 rounded-lg p-4 w-full space-y-4">
        <Text className="text-xl font-semibold">Item Name:</Text>
        <TextInput
          onChangeText={setItemName}
          value={itemName}
          placeholder="Enter item name"
          keyboardType="alpha-numeric"
          className="w-5/8 text-2xl border-gray-200 border-2"
        />
        <Text className="text-xl font-semibold">Price</Text>
        <TextInput
          onChangeText={setPrice}
          value={price}
          placeholder="Enter price"
          keyboardType="numeric"
          className="w-5/8 text-2xl border-gray-200 border-2"
        />
      </View>

      <TouchableOpacity className="bg-blue-500 p-2 rounded-lg">
        <Text className="text-white text-xl font-bold">Check Worth!</Text>
      </TouchableOpacity>
      <CurrencySelector />
    </View>
  );
}

'use client'
import { Text, View, TextInput, TouchableOpacity } from "react-native";
import CurrencySelector  from "@/components/currencyDropdown";
import { useState, useEffect } from "react";

export default function Index() {
  const [currentType, setcurrentType] = useState('JPY'); // USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN
  const [translateType, setTranslateType] = useState(''); // USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN
  const [price, setPrice] = useState(0);
  const [itemName, setItemName] = useState('');
  const access_key = process.env.APP_ID

    // send price for price conversion with (price, currentType, translateType)
    // send item name to look up in store api
    const fetchData = async (currentType: string, price: number, translateType: string) => {
        try {
          // Construct the URL with query parameters
          const query = new URLSearchParams({
            currentType,
            translateType,
            price: price.toString(), // Convert number to string for query parameters
          }).toString();
      
          const response = await fetch(`http://127.0.0.1:8000/test/?${query}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
      
          const data = await response.json();
          console.log("Response data:", data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      


  const handleSubmit = () => {
    fetchData(currentType, price, translateType); 
  }
  return (
    <View
      className="flex-col items-center justify-center bg-gray-100 w-full"
    >
      <Text className="flex-1 items-center justify-center text-2xl text-blue-500">Worth It</Text>
      <View
        className="border-2 border-gray-200 rounded-lg p-4 w-full space-y-4"
      > 
        <Text
          className="text-xl font-semibold"
        >
          Item Name:
        </Text>
        <TextInput
          onChangeText={setItemName}
          value={itemName}
          placeholder="Enter item name"
          keyboardType="alpha-numeric"
          className="w-5/8 text-2xl border-gray-200 border-2"
        />
        <Text
          className="text-xl font-semibold"
        >
          Price
        </Text>
        <TextInput
          onChangeText={setPrice}
          value={price}
          placeholder="Enter price"
          keyboardType="numeric"
          className="w-5/8 text-2xl border-gray-200 border-2"
        />

      </View>

      <TouchableOpacity
        className="bg-blue-500 p-2 rounded-lg"
        onPress={handleSubmit}
      > 
        <Text className="text-white text-xl font-bold">Check Worth!</Text>
      </TouchableOpacity>
      <CurrencySelector />
    </View>
  );
}
"use client";
import { Text, View, TextInput, TouchableOpacity, Button } from "react-native";
import { useState } from "react";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, AnalysisResult } from "@/types/pageParams";
import CurrencySelector from "@/components/currencyDropdown";

/*
TODO: 
 - Change the Go To Test Screen to touchable opacity
 - add currency Selector for currentType and translateType
 - since we are using gemini we can push its limits: 
 - provide a breif description if item is worth based on typical cost of item in currentType region vs translateType region 
 - provide similar items that are potentially cheaper alternatives
*/
//Each page "Home and priceRes will have expected props"
type Props = NativeStackScreenProps<RootStackParamList, 'index'>;

const Home: React.FC<Props> = ({ navigation }) => {
  const [currentType, setCurrentType] = useState('JPY'); // USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN
  const [translateType, setTranslateType] = useState('USD'); // USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN
  const [price, setPrice] = useState('0');
  const [itemName, setItemName] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [exchangeRate, setExchangeRate] = useState<string | null>(null);

  

  // send price for price conversion with (price, currentType, translateType)
  // send item name to look up in store api
  const fetchData = async (currentType: string, price: string, translateType: string, itemName: string) => {
    try {
      // Construct the URL with query parameters
      const exchangeQuery = new URLSearchParams({
        currentType,
        translateType,
        price, 
      }).toString();
      
      const analysisQuery = new URLSearchParams({
        itemName,
        currentType,
        translateType,
        price,
      }).toString();
      
      //fetch data
      const exchangeRateReq = fetch(`http://127.0.0.1:8000/test?${exchangeQuery}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => response.json());
    
      const analysisReq = fetch(`http://127.0.0.1:8000/productAnalysis?${analysisQuery}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response) => response.json());

      Promise.all([exchangeRateReq, analysisReq])
        .then(([data1, data2]) => {
          console.log(data1, data2);
          setExchangeRate(data1);
          setAnalysisResult(JSON.parse(data2.response));
        })
       
    } catch (error) {
      console.error("Error:", error);
    }
    // console.log("success", exchangeRate, analysisResult);
    // console.log("details",analysisResult?.details);
    // console.log(analysisResult);
    return ;
  }

  const handleSubmit = async () => {
    await fetchData(currentType, price, translateType, itemName);
    if (exchangeRate && analysisResult) {
      navigation.navigate('priceRes', {
        conversionPrice: exchangeRate,
        translateType: translateType,
        currentType: currentType,
        prevPrice: price,
        aIExplanation: analysisResult.details,
        similarItems : analysisResult.similarProds,
        worthOrNot : analysisResult.worthOrNot,
      });
    } else {
      return (
        <View>
          <Text>Error</Text>
        </View>
      );
    }
  };

  return (
    <View
      className="flex-col space-y-3 items-center justify-center bg-gray-100 w-full"
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <Button
        title="Go to Test Screen"
        onPress={()=> {navigation.navigate('test')}} // Navigate to Test Screen
      />
      <Text className="items-center justify-center text-2xl text-blue-500">
        Worth It
      </Text>
      <View className="border-2 border-gray-200 rounded-lg p-4 w-full space-y-4">
        <Text className="text-xl font-semibold">Item Name:</Text>
        <TextInput
          onChangeText={setItemName}
          value={itemName}
          placeholder="Enter item name"
          keyboardType="default"
          className="w-5/8 text-2xl border-gray-200 border-2"
        />
        <Text className="text-xl font-semibold">Price</Text>
        <TextInput
          onChangeText={setPrice}
          value={price.toString()}
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

      
    </View>
  );
};

export default Home;    
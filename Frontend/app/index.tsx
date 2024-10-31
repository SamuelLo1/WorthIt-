"use client";
import { Text, Image, View, TextInput, TouchableOpacity, Button, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react"; 
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [itemName, setItemName] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [exchangeRate, setExchangeRate] = useState<string | null>(null);

  // send price for price conversion with (price, currentType, translateType)
  // send item name to look up in store api
  const fetchData = async (currentType: string, price: string, translateType: string, itemName: string) => {
    setLoading(true);
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

      const [currencyData, analysisData] = await Promise.all([
        exchangeRateReq, 
        analysisReq
      ]);
      
      const fetchedAnalysisResult: AnalysisResult = {
        details: analysisData.details,
        similarProds: analysisData.similarItems,
        worthOrNot: analysisData.worthOrNot,
      };

      if (currencyData && fetchedAnalysisResult) {
        navigation.navigate('priceRes', {
          conversionPrice: currencyData,
          translateType: translateType,
          currentType: currentType,
          prevPrice: price,
          aIExplanation: fetchedAnalysisResult.details,
          similarItems: fetchedAnalysisResult.similarProds,
          worthOrNot: fetchedAnalysisResult.worthOrNot,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error fetching data");
    } finally {
      setLoading(false);
      return;
    }
  }

  const handleSubmit = async () => {
    await fetchData(currentType, price, translateType, itemName);
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
      <Image
        source={require("../public/logo.png")}
        className="width-1/5 height-1/5 border-2 border-gray-200"
      />
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

        <Text className="text-xl font-semibold">Current Currency Type:</Text>
        <CurrencySelector 
          setTranslateType={setCurrentType}
          translateType={currentType}
        />

        <Text className="text-xl font-semibold"> Conversion Currency Type: </Text>
        <CurrencySelector 
          setTranslateType={setTranslateType}
          translateType={translateType} 
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
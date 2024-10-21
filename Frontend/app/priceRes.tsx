import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "@/types/pageParams";
import AntDesign from '@expo/vector-icons/AntDesign';

type Props = NativeStackScreenProps<RootStackParamList, 'priceRes'>;
type PriceSymbols = {
  [key: string] : string;
}
const priceSymbols: PriceSymbols = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  INR: '₹',
  MXN: 'Mex$',
}
const PriceRes: React.FC<Props> = ({ route }) => {
  const { conversionPrice, translateType, currentType, prevPrice, aIExplanation, similarItems, worthOrNot } = route.params;
  const currentSymbol = priceSymbols[currentType];
  const translateSymbol = priceSymbols[translateType];
  return (
    <View className="flex-1 items-center bg-red-300">
      <View className="flex items-center space-y-2 mt-10">
        <Text className="text-2xl font-bold "> Logo</Text>
        <Text className="text-2xl font-bold">Worth It: </Text>
        <Text className="text-2xl font-bold">{worthOrNot ? 'Yes' : 'No'}</Text>
        <View className="flex items-center bg-white rounded-3xl p-10 ">
          <Text className="text-2xl font-bold"> Current Conversion Rate: </Text>
          <Text className="text-2xl font-bold">{currentSymbol}{prevPrice} 
          <AntDesign name="arrowright" size={24} color="black" /> {translateSymbol}{conversionPrice} 
          </Text>
          <Text className="text-2xl font-bold">AI Explanation: </Text>
          <Text className="text-xl">{aIExplanation}</Text>
          <Text className="text-2xl font-bold">Similar Items: </Text>
          <View className="flex items-center space-x-2">
            {similarItems?.map((item) => (
              <Text className="text-xl">{item}</Text>
            ))}
          </View>
        </View>
      </View>
      
    </View>
  )
}

export default PriceRes

const styles = StyleSheet.create({})
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
  const { conversionPrice, translateType, currentType, prevPrice } = route.params;
  const currentSymbol = priceSymbols[currentType];
  const translateSymbol = priceSymbols[translateType];
  return (
    <View className="flex-1 items-center bg-red-300">
      <View className="flex items-center space-y-6 mt-10">
        <Text className="text-2xl font-bold "> Logo</Text>
        <View className="flex items-center bg-white rounded-3xl p-10 h-1/2">
          <Text className="text-2xl font-bold"> Price Converted </Text>
          <Text className="text-2xl font-bold">{currentSymbol}{prevPrice} 
          <AntDesign name="arrowright" size={24} color="black" /> {translateSymbol}{conversionPrice} 
          </Text>
          <Text className="text-2xl font-bold">Conversion: {conversionPrice} </Text>
          <Text className="text-2xl font-bold">Conversion: {conversionPrice} </Text> 
        </View>
      </View>
      
    </View>
  )
}

export default PriceRes

const styles = StyleSheet.create({})
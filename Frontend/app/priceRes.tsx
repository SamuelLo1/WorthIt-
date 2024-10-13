import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from "@/types/pageParams";

type Props = NativeStackScreenProps<RootStackParamList, 'priceRes'>;
const PriceRes: React.FC<Props> = ({ route }) => {
  const { conversionPrice, translateType, currentType } = route.params;
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-2xl">Conversion: {conversionPrice}
         translate from "{currentType}" to "{translateType}"  
      </Text>
    </View>
  )
}

export default PriceRes

const styles = StyleSheet.create({})
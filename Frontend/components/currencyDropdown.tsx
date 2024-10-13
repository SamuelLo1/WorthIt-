import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';


const CurrencySelector = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const currencies = [
    { label: 'US Dollar (USD)', value: 'USD' },
    { label: 'Euro (EUR)', value: 'EUR' },
    { label: 'British Pound (GBP)', value: 'GBP' },
    { label: 'Japanese Yen (JPY)', value: 'JPY' },
    { label: 'Canadian Dollar (CAD)', value: 'CAD' },
    { label: 'Chinese Yuan (CNY)', value: 'CNY' },
    { label: 'Polish Zloty (PLN)', value: 'PLN' },
  ];

  return (
    <View className='flex-1 justify-center items-center bg-gray-100'>
      <Text className='text-lg mb-2 text-gray-800'>Select Currency</Text>
      <View className='w-1/2 bg-white border border-gray-300 rounded-lg'>
        <Picker
          selectedValue={selectedCurrency}
          onValueChange={(itemValue) => setSelectedCurrency(itemValue)}
          className="h-12"
        >
          {currencies.map((currency) => (
            <Picker.Item 
              key={currency.value} 
              label={currency.label} 
              value={currency.value} 
            />
          ))}
        </Picker>
      </View>
      <Text className='text-md mt-4 text-gray-600'>
        Selected Currency: {selectedCurrency}
      </Text>
    </View>
  );
};

export default CurrencySelector;
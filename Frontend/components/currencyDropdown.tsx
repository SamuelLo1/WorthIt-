import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-material-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';

const CurrencySelector = () => {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [isFocus, setIsFocus] = useState(false);

  const data = [
    { value: 'USD' },
    { value: 'EUR' },
    { value: 'GBP' },
  ];

  return (
    <View style={styles.container}>
      <Dropdown
        label='Select Currency'
        data={data}
        value={selectedCurrency}
        onChangeText={(value) => setSelectedCurrency(value)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
      <AntDesign name="down" size={24} color="black" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default CurrencySelector;
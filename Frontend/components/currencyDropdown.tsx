import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import AntDesign from "@expo/vector-icons/AntDesign";

interface CurrencySelectorProps {
  setTranslateType: (value: string) => void,
  translateType: string 
}


const CurrencySelector: React.FC<CurrencySelectorProps> = ({setTranslateType, translateType}) => {
  // const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const data = [
    { value: "USD" },
    { value: "EUR" },
    { value: "GBP" },
    { value: "JPY" },
  ];

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      search
      maxHeight={300}
      labelField="value"
      valueField="value"
      placeholder="Select item"
      searchPlaceholder="Search..."
      value={translateType}
      onChange={(item) => {
        setTranslateType(item.value);
        translateType = item.value; 
      }}
      renderLeftIcon={() => (
        <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    width: "80%", // Set this to ensure it takes full width
    paddingHorizontal: 10,
  },

  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});

export default CurrencySelector;
{
  /* <Dropdown
        label="Select Currency"
        data={data}
        value={selectedCurrency}
        onChangeText={(value) => setSelectedCurrency(value)}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
      <AntDesign name="down" size={24} color="black" /> */
}

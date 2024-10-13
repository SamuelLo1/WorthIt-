import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './index';
import PriceRes from "./priceRes";

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <Stack.Navigator initialRouteName="index">
      <Stack.Screen name="index" component={Home}/>
      <Stack.Screen name="priceRes" component={PriceRes} />
    </Stack.Navigator>
  );
}
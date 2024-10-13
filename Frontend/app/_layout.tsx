import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './index';
import PriceRes from "./priceRes";
import TestScreen from "./test";
import { RootStackParamList } from "@/types/pageParams";

//Each route has props expected from RootStackParamList
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootLayout() {
  return (
    <Stack.Navigator initialRouteName="index">
      <Stack.Screen name="index" component={Home}/>
      <Stack.Screen name="priceRes" component={PriceRes} />
      <Stack.Screen name="test" component={TestScreen}/>
    </Stack.Navigator>
  );
}

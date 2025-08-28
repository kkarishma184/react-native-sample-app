import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CustomerList from "../src/screens/Dashboard";
import EditCustomer from "../src/screens/EditCustomer";

export type RootStackParamList = {
  CustomerList: undefined;
  EditCustomer: { id: string; name: string; city: string; state: string; customerImage: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="CustomerList" component={CustomerList} options={{ title: "Customers" }} />
        <Stack.Screen name="EditCustomer" component={EditCustomer} options={{ title: "Edit Customer" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
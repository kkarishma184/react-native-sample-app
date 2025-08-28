import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { RootStackParamList } from "../../App";
import AddressPicker from "../components/AdressPicker";
import CameraCapture from "../components/CameraCapture";

type Props = NativeStackScreenProps<RootStackParamList, "EditCustomer">;

export default function EditCustomer({ route, navigation }: Props) {
  const { id, name, city, state, customerImage } = route.params;

  const [customerName, setCustomerName] = useState(name);
  const [customerCity, setCustomerCity] = useState(city);
  const [customerState, setCustomerState] = useState(state);
  const [image, setImage] = useState(customerImage || null);
  const [isAddressPickerVisible, setIsAddressPickerVisible] = useState(false);

  type AddressData = {
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };

  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);

  const handleAddressSelect = (addressData: AddressData) => {
    setSelectedAddress(addressData);
    console.log('Selected Address:', addressData);
  };

  const openAddressPicker = () => {
    setIsAddressPickerVisible(true);
  };

  const closeAddressPicker = () => {
    setIsAddressPickerVisible(false);
  };

  const handleSave = () => {
    // For now, just log the values. Later you can integrate API call or Redux.
    console.log("Updated Customer:", { id, customerName, customerCity, customerState });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
        <Text style={styles.label}>Profile Picture</Text>
      {image && <Image source={{ uri: image }} style={styles.image} />}

      {/* Camera Component */}
      <CameraCapture onCapture={(uri: string) => setImage(uri)} />

      <Text style={styles.label}>Name:</Text>
      <TextInput value={customerName} onChangeText={setCustomerName} style={styles.input} />
      <Text style={styles.label}>Address Line 1:</Text>
      <TextInput value={customerName} onChangeText={setCustomerName} style={styles.input} />
      <Text style={styles.label}>AddressLine 2:</Text>
      <TextInput value={customerName} onChangeText={setCustomerName} style={styles.input} />
      <Text style={styles.label}>City:</Text>
      <TextInput value={customerCity} onChangeText={setCustomerName} style={styles.input} />
      <Text style={styles.label}>State:</Text>
      <TextInput value={customerState} onChangeText={setCustomerName} style={styles.input} />

      {selectedAddress && (
        <View style={styles.selectedAddressContainer}>
          <Text style={styles.selectedAddressTitle}>Selected Address:</Text>
          <Text style={styles.selectedAddressText}>{selectedAddress.address}</Text>
          <Text style={styles.coordinatesText}>
            Lat: {selectedAddress.coordinates.latitude.toFixed(6)}, 
            Lng: {selectedAddress.coordinates.longitude.toFixed(6)}
          </Text>
        </View>
      )}
      <Button title="📍 Select Address"  onPress={openAddressPicker} />


      <AddressPicker
        visible={isAddressPickerVisible}
        onClose={closeAddressPicker}
        onAddressSelect={handleAddressSelect}
        title="Choose Your Location"
        initialAddress={selectedAddress?.address || ''}
      />
      <View style={{marginTop:20}}>
      <Button title="Save Changes" onPress={handleSave} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginTop: 6,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginVertical: 12,
  },
  exampleContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  exampleTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  openPickerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  openPickerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  selectedAddressContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedAddressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  selectedAddressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'monospace',
  },
});
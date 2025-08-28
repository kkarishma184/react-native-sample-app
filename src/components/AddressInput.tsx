import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type AddressInputProps = {
  address: string;
  onAddressChange: (text: string) => void;
  onCurrentLocationPress: () => void;
};

const AddressInput = ({ address, onAddressChange, onCurrentLocationPress }: AddressInputProps) => {
  return (
    <View style={styles.addressContainer}>
      <TextInput
        style={styles.addressInput}
        placeholder="Selected address will appear here..."
        value={address}
        onChangeText={onAddressChange}
        multiline
      />
      
      <TouchableOpacity 
        style={styles.currentLocationButton}
        onPress={onCurrentLocationPress}
      >
        <Text style={styles.currentLocationButtonText}>📍 Use Current Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  addressContainer: {
    padding: 15,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#f8f8f8',
    marginBottom: 15,
    minHeight: 60,
  },
  currentLocationButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  currentLocationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },
});

export default AddressInput;
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { RootStackParamList } from "../../App";
import AddressPicker from "../components/AdressPicker";
import CameraCapture from "../components/CameraCapture";

type Props = NativeStackScreenProps<RootStackParamList, "EditCustomer">;

type AddressData = {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  details?: any;
};

type FormData = {
  name: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function EditCustomer({ route, navigation }: Props) {
  const { id, name, city, state, customerImage } = route.params;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: name || '',
    addressLine1: '',
    addressLine2: '',
    city: city || '',
    state: state || '',
    postalCode: '',
    country: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [image, setImage] = useState(customerImage || null);
  const [isAddressPickerVisible, setIsAddressPickerVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<AddressData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form field update handler
  const updateFormField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!formData.addressLine1.trim()) {
      errors.addressLine1 = 'Address Line 1 is required';
    }

    if (!formData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!formData.state.trim()) {
      errors.state = 'State is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Address picker handlers
  const handleAddressSelect = (addressData: AddressData) => {
    setSelectedAddress(addressData);
    
    // Auto-fill form fields from selected address
    if (addressData.details) {
      const { details } = addressData;
      setFormData(prev => ({
        ...prev,
        addressLine1: details.street || prev.addressLine1,
        city: details.city || prev.city,
        state: details.region || prev.state,
        postalCode: details.postalCode || prev.postalCode,
        country: details.country || prev.country,
      }));
    }
    
    console.log('Selected Address:', addressData);
  };

  const openAddressPicker = () => {
    setIsAddressPickerVisible(true);
  };

  const closeAddressPicker = () => {
    setIsAddressPickerVisible(false);
  };

  // Save handler
  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors in the form');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedCustomer = {
        id,
        ...formData,
        image,
        coordinates: selectedAddress?.coordinates,
        fullAddress: selectedAddress?.address,
      };
      
      console.log("Updated Customer:", updatedCustomer);
      
      Alert.alert('Success', 'Customer information updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update customer information');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          {/* Profile Picture Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile Picture</Text>
            <CameraCapture onCapture={(uri: string) => setImage(uri)} />
          </View>

          {/* Personal Information Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={formData.name}
                onChangeText={(value) => updateFormField('name', value)}
                style={[styles.input, formErrors.name && styles.inputError]}
                placeholder="Enter customer name"
                autoCapitalize="words"
                returnKeyType="next"
              />
              {formErrors.name && (
                <Text style={styles.errorText}>{formErrors.name}</Text>
              )}
            </View>
          </View>

          {/* Address Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Information</Text>
            
            {/* Address Picker Button */}
            <TouchableOpacity 
              style={styles.addressPickerButton}
              onPress={openAddressPicker}
              activeOpacity={0.7}
            >
              <Text style={styles.addressPickerButtonText}>📍 Select Address from Map</Text>
            </TouchableOpacity>

            {selectedAddress && (
              <View style={styles.selectedAddressContainer}>
                <Text style={styles.selectedAddressTitle}>Selected from Map:</Text>
                <Text style={styles.selectedAddressText}>{selectedAddress.address}</Text>
                <Text style={styles.coordinatesText}>
                  Lat: {selectedAddress.coordinates.latitude.toFixed(6)}, 
                  Lng: {selectedAddress.coordinates.longitude.toFixed(6)}
                </Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Address Line 1 <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                value={formData.addressLine1}
                onChangeText={(value) => updateFormField('addressLine1', value)}
                style={[styles.input, formErrors.addressLine1 && styles.inputError]}
                placeholder="Street number and name"
                autoCapitalize="words"
                returnKeyType="next"
              />
              {formErrors.addressLine1 && (
                <Text style={styles.errorText}>{formErrors.addressLine1}</Text>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address Line 2</Text>
              <TextInput
                value={formData.addressLine2}
                onChangeText={(value) => updateFormField('addressLine2', value)}
                style={styles.input}
                placeholder="Apartment, suite, etc. (optional)"
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.label}>
                  City <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  value={formData.city}
                  onChangeText={(value) => updateFormField('city', value)}
                  style={[styles.input, formErrors.city && styles.inputError]}
                  placeholder="City"
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                {formErrors.city && (
                  <Text style={styles.errorText}>{formErrors.city}</Text>
                )}
              </View>

              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.label}>
                  State <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  value={formData.state}
                  onChangeText={(value) => updateFormField('state', value)}
                  style={[styles.input, formErrors.state && styles.inputError]}
                  placeholder="State"
                  autoCapitalize="words"
                  returnKeyType="next"
                />
                {formErrors.state && (
                  <Text style={styles.errorText}>{formErrors.state}</Text>
                )}
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.label}>Postal Code</Text>
                <TextInput
                  value={formData.postalCode}
                  onChangeText={(value) => updateFormField('postalCode', value)}
                  style={styles.input}
                  placeholder="Postal Code"
                  keyboardType="number-pad"
                  returnKeyType="next"
                />
              </View>

              <View style={[styles.inputGroup, styles.inputHalf]}>
                <Text style={styles.label}>Country</Text>
                <TextInput
                  value={formData.country}
                  onChangeText={(value) => updateFormField('country', value)}
                  style={styles.input}
                  placeholder="Country"
                  autoCapitalize="words"
                  returnKeyType="done"
                />
              </View>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Address Picker Modal */}
      <AddressPicker
        visible={isAddressPickerVisible}
        onClose={closeAddressPicker}
        onAddressSelect={handleAddressSelect}
        title="Choose Customer Location"
        initialAddress={selectedAddress?.address || ''}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  addressPickerButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  addressPickerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  selectedAddressContainer: {
    backgroundColor: '#F0F9FF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  selectedAddressTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  selectedAddressText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 18,
    marginBottom: 4,
  },
  coordinatesText: {
    fontSize: 11,
    color: '#666',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  saveButton: {
    backgroundColor: '#34C759',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    backgroundColor: '#A0A0A0',
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
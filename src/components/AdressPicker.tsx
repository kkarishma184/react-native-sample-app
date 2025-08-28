import * as Location from 'expo-location';
import { useEffect, useRef, useState } from 'react';
import {
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import MapView from 'react-native-maps';

import React from 'react';
import AddressInput from './AddressInput';
import MapContainer from './MapContainer';
import ModalHeader from './ModalHeader';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

type SearchResult = {
  latitude: number;
  longitude: number;
  formattedAddress: string;
  // Add other fields if needed
};

type AddressPickerProps = {
  visible: boolean;
  onClose: () => void;
  onAddressSelect?: (data: { address: string; coordinates: { latitude: number; longitude: number }; details?: any }) => void;
  initialAddress?: string;
  title?: string;
};

const AddressPicker = ({ 
  visible, 
  onClose, 
  onAddressSelect, 
  initialAddress = '',
  title = 'Select Address' 
}: AddressPickerProps) => {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  const [markerPosition, setMarkerPosition] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  
  const [address, setAddress] = useState(initialAddress);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    if (visible) {
      getCurrentLocation();
    }
  }, [visible]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      };
      
      setRegion(newRegion);
      setMarkerPosition({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      
      reverseGeocode(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
      const result = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (result.length > 0) {
        const location = result[0];
        const formattedAddress = formatAddress(location);
        setAddress(formattedAddress);
        onAddressSelect && onAddressSelect({
          address: formattedAddress,
          coordinates: { latitude, longitude },
          details: location
        });
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    }
  };

  const formatAddress = (location: { city: any; district?: string | null; streetNumber?: string | null; street: any; region: any; subregion?: string | null; country: any; postalCode: any; name: any; isoCountryCode?: string | null; timezone?: string | null; formattedAddress?: string | null; }) => {
    return `${location.street || ''} ${location.name || ''}, ${location.city || ''}, ${location.region || ''} ${location.postalCode || ''}, ${location.country || ''}`.replace(/\s+/g, ' ').trim();
  };

  const handleConfirmLocation = () => {
    onAddressSelect && onAddressSelect({
      address,
      coordinates: markerPosition,
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleMapPress = (coordinate: { latitude: any; longitude: any; }) => {
    const { latitude, longitude } = coordinate;
    setMarkerPosition({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };

  const handleMarkerDrag = (coordinate: { latitude: any; longitude: any; }) => {
    const { latitude, longitude } = coordinate;
    setMarkerPosition({ latitude, longitude });
    reverseGeocode(latitude, longitude);
  };
  
  const handleSearchResultSelect = (result: SearchResult) => {
    const newRegion = {
      latitude: result.latitude,
      longitude: result.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    
    setRegion(newRegion);
    setMarkerPosition({
      latitude: result.latitude,
      longitude: result.longitude,
    });
    setAddress(result.formattedAddress);
    setSearchQuery('');
    setShowSearchResults(false);
    setSearchResults([]);
    
    mapRef.current?.animateToRegion(newRegion, 1000);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <StatusBar barStyle="dark-content" />
        
        <ModalHeader
          title={title}
          onCancel={handleCancel}
          onDone={handleConfirmLocation}
        />

        <View style={styles.container}>
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setSearchResults={setSearchResults}
            setShowSearchResults={setShowSearchResults}
          />

          <SearchResults
            visible={showSearchResults}
            results={searchResults}
            onSelectResult={handleSearchResultSelect}
          />

          <MapContainer
            ref={mapRef}
            region={region}
            markerPosition={markerPosition}
            onMapPress={handleMapPress}
            onMarkerDrag={handleMarkerDrag}
          />

          <AddressInput
            address={address}
            onAddressChange={setAddress}
            onCurrentLocationPress={getCurrentLocation}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default AddressPicker;
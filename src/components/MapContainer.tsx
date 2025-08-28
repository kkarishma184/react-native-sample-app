import React, { forwardRef } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const { width } = Dimensions.get('window');

type MapContainerProps = {
  region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
  markerPosition: {
    latitude: number;
    longitude: number;
  };
  onMapPress: (coordinate: { latitude: number; longitude: number }) => void;
  onMarkerDrag: (coordinate: { latitude: number; longitude: number }) => void;
};

const MapContainer = forwardRef<MapView, MapContainerProps>(({ 
  region, 
  markerPosition, 
  onMapPress, 
  onMarkerDrag 
}, ref) => {
  const handleMapPress = (event: { nativeEvent: { coordinate: { latitude: number; longitude: number; }; }; }) => {
    onMapPress(event.nativeEvent.coordinate);
  };

  const handleMarkerDragEnd = (event: { nativeEvent: { coordinate: { latitude: number; longitude: number; }; }; }) => {
    onMarkerDrag(event.nativeEvent.coordinate);
  };

  return (
    <MapView
      ref={ref}
      style={styles.map}
      region={region}
      onPress={handleMapPress}
      showsUserLocation={true}
      showsMyLocationButton={true}
    >
      <Marker
        coordinate={markerPosition}
        draggable={true}
        onDragEnd={handleMarkerDragEnd}
      />
    </MapView>
  );
});

const styles = StyleSheet.create({
  map: {
    flex: 1,
    width: width,
  },
});

export default MapContainer;
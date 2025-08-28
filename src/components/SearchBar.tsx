import * as Location from 'expo-location';
import React, { useRef } from 'react';
import { ActivityIndicator, StyleSheet, TextInput, View } from 'react-native';

type SearchBarProps = {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setSearchResults: (results: any[]) => void;
  setShowSearchResults: (show: boolean) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ 
  searchQuery, 
  onSearchChange, 
  isLoading, 
  setIsLoading, 
  setSearchResults, 
  setShowSearchResults 
}) => {
  const searchTimeoutRef = useRef(null);

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    setIsLoading(true);
    try {
      const results = await Location.geocodeAsync(query);
      const formattedResults = await Promise.all(
        results.slice(0, 5).map(async (result) => {
          try {
            const reverseResult = await Location.reverseGeocodeAsync({
              latitude: result.latitude,
              longitude: result.longitude,
            });
            
            const location = reverseResult[0] || {};
            const formattedAddress = formatAddress(location);
            
            return {
              ...result,
              formattedAddress: formattedAddress || 'Unknown location',
              details: location,
            };
          } catch (error) {
            return {
              ...result,
              formattedAddress: 'Unknown location',
              details: {},
            };
          }
        })
      );
      
      setSearchResults(formattedResults);
      setShowSearchResults(true);
    } catch (error) {
      console.error('Error searching location:', error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

interface LocationDetails {
    street?: string | null;
    name?: string | null;
    city?: string | null;
    region?: string | null;
    postalCode?: string | null;
    country?: string | null;
    [key: string]: any;
}

const formatAddress = (location: LocationDetails): string => {
    return `${location.street || ''} ${location.name || ''}, ${location.city || ''}, ${location.region || ''} ${location.postalCode || ''}, ${location.country || ''}`.replace(/\s+/g, ' ').trim();
};

interface HandleSearchInputChange {
    (text: string): void;
}

const handleSearchInputChange: HandleSearchInputChange = (text) => {
    onSearchChange(text);

    if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current as unknown as number);
    }

    searchTimeoutRef.current = setTimeout(() => {
        searchLocation(text);
    }, 500) as unknown as null;
};

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search for an address..."
        value={searchQuery}
        onChangeText={handleSearchInputChange}
        onFocus={() => setShowSearchResults(true)}
      />
      {isLoading && (
        <ActivityIndicator 
          style={styles.loadingIndicator} 
          size="small" 
          color="#007AFF" 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    height: 45,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  loadingIndicator: {
    marginLeft: 10,
  },
});

export default SearchBar;
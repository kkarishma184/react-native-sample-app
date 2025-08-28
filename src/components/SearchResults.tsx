import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

type SearchResult = {
  formattedAddress: string;
  // Add other fields if needed
};

type SearchResultsProps = {
  visible: boolean;
  results: SearchResult[];
  onSelectResult: (result: SearchResult) => void;
};

const SearchResults: React.FC<SearchResultsProps> = ({ visible, results, onSelectResult }) => {
  if (!visible || results.length === 0) {
    return null;
  }

  return (
    <ScrollView style={styles.searchResults} nestedScrollEnabled>
      {results.map((result, index) => (
        <TouchableOpacity
          key={index}
          style={styles.searchResultItem}
          onPress={() => onSelectResult(result)}
        >
          <Text style={styles.searchResultText}>
            {result.formattedAddress}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  searchResults: {
    maxHeight: 200,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 1000,
  },
  searchResultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchResultText: {
    fontSize: 14,
    color: '#333',
  },
});

export default SearchResults;
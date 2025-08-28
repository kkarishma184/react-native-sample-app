import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Alert, Button, Image, StyleSheet, View } from "react-native";

type CameraCaptureProps = {
  onCapture?: (uri: string) => void;
};

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const [image, setImage] = useState<string | null>(null);

  const openCamera = async () => {
    // Ask for camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission Denied", "Camera access is required!");
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      if (onCapture) onCapture(result.assets[0].uri); // send image back to parent
    }
  };

  return (
    
    <View style={styles.container}>
      {image && (
        <View style={styles.outerRing}>
      <View style={styles.innerRing}>
        <Image
          source={{ uri: image }}
          style={styles.image}
        />
      </View>
    </View>
      )}
      <Button title="📸 Capture Image" onPress={openCamera} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  outerRing: {
    width: 220,
    height: 220,
    borderRadius: 110,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    // Instagram-like gradient border (using linear gradient lib)
    backgroundColor: "transparent",
  },
  innerRing: {
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "#fff", // white background for clean separation
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100, // make it circular
  },
//   image: {
//     width: 200,
//     height: 200,
//     borderRadius: 10,
//     marginTop: 10,
//     marginBottom: 10,
//   },
});
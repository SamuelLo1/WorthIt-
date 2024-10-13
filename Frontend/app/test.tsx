import React, { useState } from "react";
import { Button, Image, View, StyleSheet, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function TestScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  // Function to convert image to Base64 format
  const convertImageToBase64 = async (uri: string) => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      return base64;
    } catch (error) {
      console.log("Error converting image to base64:", error);
    }
  };

  const takeImage = async () => {
    try {
      await ImagePicker.requestCameraPermissionsAsync();
      let res = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        allowsEditing: true,
        quality: 1,
      });
      if (!res.canceled) {
        const uri = res.assets[0].uri;
        setImage(uri);
        const base64 = await convertImageToBase64(uri);
        setBase64Image(base64);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImage(uri);
      const base64 = await convertImageToBase64(uri);
      setBase64Image(base64);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button title="Use Camera" onPress={takeImage} />
      {base64Image && (
        <Text style={styles.base64Text}>
          Base64 Image: {base64Image.substring(0, 100)}...
        </Text> // Display first 100 characters of base64
      )}
      <Button title="Clear" onPress={() => setImage(null)} />
      <Button title="Upload" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20,
  },
  base64Text: {
    marginTop: 20,
    padding: 10,
    fontSize: 12,
    color: "gray",
  },
});
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CacheDetailScreen({ route }) {
  const { cache } = route.params || {};
  const [proofPhotoUri, setProofPhotoUri] = useState(null);

  const handleTakePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Camera Permission Needed',
          'Please allow camera access to take a proof photo.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProofPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking proof photo:', error);
      Alert.alert('Error', 'Could not open the camera.');
    }
  };

  const handleChoosePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Library Permission Needed',
          'Please allow photo library access to choose a proof photo.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setProofPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error choosing proof photo:', error);
      Alert.alert('Error', 'Could not open the photo library.');
    }
  };

  const handleLogFind = () => {
    console.log('Found it!', {
      cacheId: cache?.cacheId,
      proofPhotoUri,
    });

    Alert.alert('Find Logged', 'Your find has been logged.');
  };

  if (!cache) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No cache data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{cache.title}</Text>

        <Text style={styles.label}>Description</Text>
        <Text style={styles.text}>{cache.description}</Text>

        <Text style={styles.label}>Clue</Text>
        <Text style={styles.text}>{cache.clue}</Text>

        <Text style={styles.label}>Points</Text>
        <Text style={styles.text}>{cache.points}</Text>

        <Text style={styles.label}>Proof Photo</Text>

        <View style={styles.photoButtonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => handleTakePhoto()}
          >
            <Text style={styles.secondaryButtonText}>Take Photo</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={() => handleChoosePhoto()}
          >
            <Text style={styles.secondaryButtonText}>Choose Photo</Text>
          </Pressable>
        </View>

        {proofPhotoUri ? (
          <Image source={{ uri: proofPhotoUri }} style={styles.photoPreview} />
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>No proof photo added yet.</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => handleLogFind()}
        >
          <Text style={styles.buttonText}>Log Find</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0f1b2d',
    padding: 16,
  },
  card: {
    backgroundColor: '#1e2d3d',
    borderWidth: 1,
    borderColor: '#2e4057',
    borderRadius: 12,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  label: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  text: {
    color: '#aaa',
    fontSize: 15,
    lineHeight: 22,
  },
  photoButtonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    marginBottom: 14,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#0f1b2d',
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  photoPreview: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2e4057',
  },
  placeholderBox: {
    height: 120,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2e4057',
    backgroundColor: '#0f1b2d',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
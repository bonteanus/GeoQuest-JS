import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CreateCacheScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [clue, setClue] = useState('');
  const [focusedInput, setFocusedInput] = useState('');
  const [photoUri, setPhotoUri] = useState(null);

  const handleTakePhoto = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          'Camera Permission Needed',
          'Please allow camera access to take a photo.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
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
          'Please allow photo library access to choose an image.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error choosing photo:', error);
      Alert.alert('Error', 'Could not open the photo library.');
    }
  };

  const handleSubmit = () => {
    const newCache = {
      title,
      description,
      latitude,
      longitude,
      clue,
      photoUri,
    };

    console.log('Create cache submitted:', newCache);
    Alert.alert('Cache Submitted', 'Your cache form has been submitted.');
  };

  const getInputStyle = (inputName) => {
    return [
      styles.input,
      focusedInput === inputName ? styles.inputFocused : null,
    ];
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Cache</Text>

        <TextInput
          style={getInputStyle('title')}
          placeholder="Title"
          placeholderTextColor="#aaa"
          value={title}
          onChangeText={setTitle}
          onFocus={() => setFocusedInput('title')}
          onBlur={() => setFocusedInput('')}
        />

        <TextInput
          style={[...getInputStyle('description'), styles.multilineInput]}
          placeholder="Description"
          placeholderTextColor="#aaa"
          value={description}
          onChangeText={setDescription}
          onFocus={() => setFocusedInput('description')}
          onBlur={() => setFocusedInput('')}
          multiline
        />

        <TextInput
          style={getInputStyle('latitude')}
          placeholder="Latitude"
          placeholderTextColor="#aaa"
          value={latitude}
          onChangeText={setLatitude}
          onFocus={() => setFocusedInput('latitude')}
          onBlur={() => setFocusedInput('')}
          keyboardType="numeric"
        />

        <TextInput
          style={getInputStyle('longitude')}
          placeholder="Longitude"
          placeholderTextColor="#aaa"
          value={longitude}
          onChangeText={setLongitude}
          onFocus={() => setFocusedInput('longitude')}
          onBlur={() => setFocusedInput('')}
          keyboardType="numeric"
        />

        <TextInput
          style={[...getInputStyle('clue'), styles.multilineInput]}
          placeholder="Clue"
          placeholderTextColor="#aaa"
          value={clue}
          onChangeText={setClue}
          onFocus={() => setFocusedInput('clue')}
          onBlur={() => setFocusedInput('')}
          multiline
        />

        <Text style={styles.sectionLabel}>Cache Location Photo</Text>

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

        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photoPreview} />
        ) : (
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>No photo selected yet.</Text>
          </View>
        )}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.buttonText}>Submit Cache</Text>
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
  sectionLabel: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#0f1b2d',
    borderWidth: 1,
    borderColor: '#2e4057',
    borderRadius: 8,
    color: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
  },
  inputFocused: {
    borderColor: '#4CAF50',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  photoButtonRow: {
    flexDirection: 'row',
    gap: 10,
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
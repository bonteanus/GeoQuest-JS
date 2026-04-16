import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native';

export default function CreateCacheScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [clue, setClue] = useState('');
  const [focusedInput, setFocusedInput] = useState('');

  const handleSubmit = () => {
    const newCache = {
      title,
      description,
      latitude,
      longitude,
      clue,
    };

    console.log('Create cache submitted:', newCache);
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

        <Pressable
          style={({ pressed }) => [
            styles.button,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={handleSubmit}
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
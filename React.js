import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';

const App = () => {
  const [bookingId, setBookingId] = useState('');
  const [key, setKey] = useState('');

  const generateKey = async () => {
    try {
      const response = await axios.post('http://localhost:3000/generate-key', { bookingId }, {
        headers: { Authorization: 'Bearer your-jwt-token' },
      });
      setKey(response.data.key);
      Alert.alert('Key Generated', response.data.key);
    } catch (error) {
      Alert.alert('Error', 'Failed to generate key');
    }
  };

  const unlockRoom = async () => {
    try {
      const response = await axios.post('http://localhost:3000/unlock-room', { key });
      Alert.alert(response.data.message);
    } catch (error) {
      Alert.alert('Error', 'Invalid Key');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Enter Booking ID:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10 }} value={bookingId} onChangeText={setBookingId} />
      <Button title='Generate Key' onPress={generateKey} />
      <Text>Generated Key: {key}</Text>
      <Button title='Unlock Room' onPress={unlockRoom} />
    </View>
  );
};

export default App;

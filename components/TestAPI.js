import React, { useState } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';

export default function TestAPI() {
  const [result, setResult] = useState('');

  const testFetch = async () => {
    try {
      setResult('Testing...');
      const response = await fetch('http://192.168.1.39/project-dev/1.fehri-skripsi/barangaro-home-backend/');
      const text = await response.text();
      setResult(`Success: ${text.substring(0, 200)}`);
    } catch (error) {
      setResult(`Error: ${error.message}`);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Test API" onPress={testFetch} />
      <ScrollView style={{ marginTop: 20 }}>
        <Text>{result}</Text>
      </ScrollView>
    </View>
  );
}

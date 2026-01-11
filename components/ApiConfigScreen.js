import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setApiBaseUrl, getAPI } from '../config/api';

export default function ApiConfigScreen({ navigation }) {
  const [apiUrl, setApiUrl] = useState('http://192.168.1.39:8000');
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    if (!apiUrl) {
      Alert.alert('Error', 'URL API harus diisi');
      return;
    }

    setTesting(true);
    try {
      await setApiBaseUrl(apiUrl);
      const API = getAPI();
      
      const response = await fetch(API.LOGIN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test', password: 'test' }),
      });

      if (response.status === 400 || response.status === 401) {
        Alert.alert('Sukses', 'Koneksi berhasil!', [
          { text: 'OK', onPress: () => navigation.replace('Login') }
        ]);
      } else {
        throw new Error('Server tidak merespon');
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal terhubung ke server. Periksa URL dan pastikan server berjalan.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name="server-outline" size={80} color="#a32620" style={styles.icon} />
      
      <Text style={styles.title}>Konfigurasi Server</Text>
      <Text style={styles.subtitle}>Masukkan URL API Backend</Text>

      <TextInput
        style={styles.input}
        placeholder="http://192.168.1.39:8000"
        value={apiUrl}
        onChangeText={setApiUrl}
        autoCapitalize="none"
        keyboardType="url"
      />

      <Text style={styles.hint}>
        Contoh: http://192.168.1.39:8000{'\n'}
        (Tanpa slash di akhir)
      </Text>

      <TouchableOpacity style={styles.button} onPress={testConnection} disabled={testing}>
        {testing ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Test Koneksi</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  icon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#a32620',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

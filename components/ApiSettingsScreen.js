import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { setApiBaseUrl, getApiBaseUrl, getApiUrlHistory, clearApiUrlHistory, getAPI } from '../config/api';

export default function ApiSettingsScreen({ navigation }) {
  const [apiUrl, setApiUrl] = useState('');
  const [history, setHistory] = useState([]);
  const [testing, setTesting] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadData();
    });
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    const url = await getApiBaseUrl();
    const hist = await getApiUrlHistory();
    setCurrentUrl(url);
    setApiUrl(url);
    setHistory(hist);
  };

  const testConnection = async () => {
    if (!apiUrl) {
      Alert.alert('Error', 'URL API harus diisi');
      return;
    }

    setTesting(true);
    try {
      await setApiBaseUrl(apiUrl);
      const API = getAPI();
      
      const response = await fetch(API.TEST_CONNECTION, {
        method: 'GET',
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Sukses', 'Koneksi berhasil! URL telah disimpan.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
        loadData();
      } else {
        Alert.alert('Error', 'Server tidak merespon dengan benar');
      }
    } catch (error) {
      Alert.alert('Gagal', 'Tidak dapat terhubung ke server. Periksa URL dan pastikan server berjalan.');
    } finally {
      setTesting(false);
    }
  };

  const handleClearHistory = async () => {
    Alert.alert('Konfirmasi', 'Hapus semua history URL?', [
      { text: 'Batal', style: 'cancel' },
      { 
        text: 'Hapus', 
        style: 'destructive',
        onPress: async () => {
          await clearApiUrlHistory();
          setHistory([]);
        }
      }
    ]);
  };

  const selectFromHistory = (url) => {
    setApiUrl(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="server-outline" size={60} color="#a32620" />
        </View>
        
        <Text style={styles.title}>Konfigurasi Server</Text>
        <Text style={styles.subtitle}>Masukkan URL API Backend</Text>

        <Text style={styles.label}>URL API</Text>
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
          {testing ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Test & Simpan</Text>}
        </TouchableOpacity>

        {currentUrl && (
          <View style={styles.currentUrlBox}>
            <Text style={styles.currentUrlLabel}>URL Aktif:</Text>
            <Text style={styles.currentUrlText}>{currentUrl}</Text>
          </View>
        )}

        {history.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>History URL</Text>
              <TouchableOpacity onPress={handleClearHistory}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            {history.map((url, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.historyItem}
                onPress={() => selectFromHistory(url)}
              >
                <Ionicons name="time-outline" size={20} color="#666" />
                <Text style={styles.historyUrl}>{url}</Text>
                <Ionicons name="chevron-forward" size={20} color="#a32620" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  iconContainer: {
    alignItems: 'center',
    marginTop: 20,
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
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
    marginBottom: 20,
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
  currentUrlBox: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  currentUrlLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  currentUrlText: {
    fontSize: 14,
    color: '#a32620',
    fontWeight: '600',
  },
  historySection: {
    marginTop: 30,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  clearText: {
    fontSize: 14,
    color: '#a32620',
    fontWeight: '600',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 10,
  },
  historyUrl: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
});

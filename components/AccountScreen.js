import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import API from '../config/api';

export default function AccountScreen() {
  const navigation = useNavigation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await fetch(API.LOGOUT, {
        method: 'POST',
        headers: { Authorization: token }
      });
    } catch (error) {
      console.error(error);
    } finally {
      await AsyncStorage.multiRemove(['session', 'token', 'user']);
      navigation.replace('Login');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a32620" />
        </View>
      ) : (
      <>
      <View style={styles.profileSection}>
        <Text style={styles.title}>Profile</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nama:</Text>
          <Text style={styles.value}>{user?.nama || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{user?.email || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nomor Rumah:</Text>
          <Text style={styles.value}>{user?.nomor_rumah || '-'}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nomor Telepon:</Text>
          <Text style={styles.value}>{user?.telepon || '-'}</Text>
        </View>
        
        <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('History')}>
          <Text style={styles.historyButtonText}>Riwayat Pembayaran</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    flex: 1,
    paddingTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a32620',
    marginBottom: 30,
  },
  infoRow: {
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  value: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
  },
  historyButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#a32620',
  },
  historyButtonText: {
    color: '#a32620',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#a32620',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

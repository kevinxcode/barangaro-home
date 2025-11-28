import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function AccountScreen() {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('session');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Text style={styles.title}>Profile</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nama:</Text>
          <Text style={styles.value}>Admin User</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>admin@example.com</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nomor Rumah:</Text>
          <Text style={styles.value}>A-123</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nomor Telepon:</Text>
          <Text style={styles.value}>081234567890</Text>
        </View>
        
        <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('History')}>
          <Text style={styles.historyButtonText}>Riwayat Pembayaran</Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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

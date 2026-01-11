import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config/api';

export default function HistoryScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(API.PAYMENTS_HISTORY, {
        headers: { Authorization: token }
      });
      const data = await response.json();
      if (data.success) setHistory(data.data.filter(p => p.status === 'verified'));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a32620" />
        </View>
      ) : (
      <ScrollView style={styles.content}>
        {history.map(item => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
            </View>
            <View style={styles.historyInfo}>
              <Text style={styles.type}>{item.bill_name}</Text>
              <Text style={styles.month}>{item.month}</Text>
              <Text style={styles.date}>Dibayar: {item.payment_date?.substring(0, 10)}</Text>
              <Text style={styles.amount}>Rp {parseFloat(item.amount).toLocaleString('id-ID')}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Lunas</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  iconContainer: {
    marginRight: 15,
  },
  historyInfo: {
    flex: 1,
  },
  type: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#a32620',
    marginBottom: 2,
  },
  month: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a32620',
  },
  statusBadge: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

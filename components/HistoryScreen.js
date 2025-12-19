import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryScreen() {
  const [history] = useState([
    { id: 1, type: 'Iuran Warga', month: 'Oktober 2025', amount: 100000, date: '2025-10-12', status: 'Lunas' },
    { id: 2, type: 'Iuran Warga', month: 'September 2025', amount: 100000, date: '2025-09-11', status: 'Lunas' },
    { id: 3, type: 'Iuran Warga', month: 'Agustus 2025', amount: 100000, date: '2025-08-10', status: 'Lunas' },
  ]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {history.map(item => (
          <View key={item.id} style={styles.historyCard}>
            <View style={styles.iconContainer}>
              <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
            </View>
            <View style={styles.historyInfo}>
              <Text style={styles.type}>{item.type}</Text>
              <Text style={styles.month}>{item.month}</Text>
              <Text style={styles.date}>Dibayar: {item.date}</Text>
              <Text style={styles.amount}>Rp {item.amount.toLocaleString('id-ID')}</Text>
            </View>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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

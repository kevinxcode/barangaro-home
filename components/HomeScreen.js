import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAPI } from '../config/api';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [bills, setBills] = useState([]);
  const [summary, setSummary] = useState({ total_unpaid: 0, pending_count: 0, unread_notif_count: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchData();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const API = getAPI();
      
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      
      const [billsRes, summaryRes] = await Promise.all([
        fetch(API.BILLS, { 
          headers: { Authorization: token },
          signal: controller.signal 
        }),
        fetch(API.BILLS_SUMMARY, { 
          headers: { Authorization: token },
          signal: controller.signal 
        })
      ]);

      clearTimeout(timeout);

      const billsData = await billsRes.json();
      const summaryData = await summaryRes.json();

      console.log('Summary data:', summaryData);
      if (billsData.success) setBills(billsData.data);
      if (summaryData.success) setSummary(summaryData.data);
    } catch (error) {
      console.error('Fetch error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const handlePayment = (bill) => {
    navigation.navigate('Payment', { bill });
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a32620" />
        </View>
      ) : (
      <>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Iuran Warga</Text>
          <Text style={styles.headerSubtitle}>Kelola pembayaran Anda</Text>
        </View>
        <TouchableOpacity style={styles.notifContainer} onPress={() => navigation.navigate('Notification')}>
          <Ionicons name="notifications" size={28} color="#a32620" />
          {summary.unread_notif_count > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{summary.unread_notif_count}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Tagihan</Text>
          <Text style={styles.summaryValue}>Rp {summary.total_unpaid.toLocaleString('id-ID')}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Belum Dibayar</Text>
          <Text style={styles.summaryCount}>{bills.filter(b => b.status === 'unpaid').length} Tagihan</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#a32620']}
            tintColor="#a32620"
          />
        }
      >
        <Text style={styles.sectionTitle}>Daftar Tagihan</Text>
        {bills.map(bill => (
          <View key={bill.id} style={styles.billCard}>
            <View style={styles.billIcon}>
              <Ionicons name={bill.icon || 'calendar'} size={28} color="#a32620" />
            </View>
            <View style={styles.billInfo}>
              <Text style={styles.billType}>{bill.bill_name}</Text>
              <Text style={styles.billMonth}>{bill.month}</Text>
              <Text style={styles.billAmount}>Rp {parseFloat(bill.amount).toLocaleString('id-ID')}</Text>
            </View>
            {bill.status === 'paid' ? (
              <TouchableOpacity style={styles.paidBadge} onPress={() => navigation.navigate('PaymentVerified', { payment: bill })}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.paidText}>Lunas</Text>
              </TouchableOpacity>
            ) : bill.status === 'pending' ? (
              <TouchableOpacity style={styles.pendingBadge} onPress={() => navigation.navigate('PaymentStatus', { payment: bill })}>
                <Ionicons name="time" size={20} color="#FF9800" />
                <Text style={styles.pendingText}>Verifikasi</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.payButton} onPress={() => handlePayment(bill)}>
                <Text style={styles.payButtonText}>Bayar</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
      </>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#a32620',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  notifContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#a32620',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#a32620',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  summaryItem: {
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 15,
  },
  summaryLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 5,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  summaryCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  billCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  billIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  billInfo: {
    flex: 1,
  },
  billType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 3,
  },
  billMonth: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  billAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#a32620',
  },
  payButton: {
    backgroundColor: '#a32620',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  paidText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 5,
  },
  pendingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF9800',
  },
  pendingText: {
    color: '#FF9800',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 5,
  },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentScreen({ route, navigation }) {
  const { bill } = route.params;
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    { id: 1, name: 'Transfer Bank', icon: 'card-outline' },
    { id: 2, name: 'GoPay', icon: 'wallet-outline' },
    { id: 3, name: 'OVO', icon: 'wallet-outline' },
    { id: 4, name: 'DANA', icon: 'wallet-outline' },
  ];

  const handlePayment = () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Pilih metode pembayaran');
      return;
    }
    Alert.alert('Sukses', 'Pembayaran berhasil!', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.billDetail}>
          <Text style={styles.label}>Detail Tagihan</Text>
          <Text style={styles.month}>{bill.month}</Text>
          <Text style={styles.amount}>Rp {bill.amount.toLocaleString('id-ID')}</Text>
        </View>

        <Text style={styles.sectionTitle}>Pilih Metode Pembayaran</Text>
        {paymentMethods.map(method => (
          <TouchableOpacity
            key={method.id}
            style={[styles.methodCard, selectedMethod === method.id && styles.methodCardSelected]}
            onPress={() => setSelectedMethod(method.id)}
          >
            <Ionicons name={method.icon} size={24} color={selectedMethod === method.id ? '#a32620' : '#666'} />
            <Text style={[styles.methodName, selectedMethod === method.id && styles.methodNameSelected]}>
              {method.name}
            </Text>
            {selectedMethod === method.id && (
              <Ionicons name="checkmark-circle" size={24} color="#a32620" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Bayar Sekarang</Text>
        </TouchableOpacity>
      </View>
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
    padding: 20,
  },
  billDetail: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  month: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a32620',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  methodCardSelected: {
    borderColor: '#a32620',
  },
  methodName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 15,
  },
  methodNameSelected: {
    color: '#a32620',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  payButton: {
    backgroundColor: '#a32620',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

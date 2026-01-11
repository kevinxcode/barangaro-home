import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config/api';

export default function PaymentScreen({ route, navigation }) {
  const { bill } = route.params;
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [bankInfo, setBankInfo] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const [methodsRes, bankRes] = await Promise.all([
        fetch(API.PAYMENT_METHODS, { headers: { Authorization: token } }),
        fetch(API.BANK_INFO, { headers: { Authorization: token } })
      ]);
      const methodsData = await methodsRes.json();
      const bankData = await bankRes.json();
      
      if (methodsData.success) setPaymentMethods(methodsData.data);
      if (bankData.success) setBankInfo(bankData.data);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const copyToClipboard = async (text, type) => {
    await Clipboard.setStringAsync(text);
    if (type === 'amount') {
      Alert.alert('Sukses', 'Nominal disalin');
    } else if (type === 'account') {
      Alert.alert('Sukses', 'Nomor rekening disalin');
    } else if (type === 'phone') {
      Alert.alert('Sukses', 'Nomor disalin');
    }
  };

  const pickImage = async () => {
    Alert.alert(
      'Upload Bukti Transfer',
      'Pilih metode',
      [
        {
          text: 'Ambil Foto',
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Error', 'Izin kamera diperlukan');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: false,
              quality: 0.5,
              base64: true,
            });
            if (!result.canceled) {
              const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
              setProofImage(base64);
            }
          },
        },
        {
          text: 'Pilih dari Galeri',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: false,
              quality: 0.5,
              base64: true,
            });
            if (!result.canceled) {
              const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
              setProofImage(base64);
            }
          },
        },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      Alert.alert('Error', 'Pilih metode pembayaran terlebih dahulu');
      return;
    }
    if (!proofImage) {
      Alert.alert('Error', 'Upload bukti pembayaran terlebih dahulu');
      return;
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const paymentData = {
        bill_id: bill.id,
        amount: bill.amount,
        payment_method: selectedMethod.name,
        proof_image: proofImage,
      };

      const response = await fetch(API.PAYMENTS_CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token
        },
        body: JSON.stringify(paymentData),
      });

      const data = await response.json();

      if (data.success) {
        navigation.replace('PaymentStatus', { payment: { ...bill, payment_id: data.payment_id } });
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Gagal mengirim pembayaran');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
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
        <View style={styles.billDetail}>
          <Text style={styles.label}>Detail Tagihan</Text>
          <Text style={styles.billType}>{bill.bill_name}</Text>
          <Text style={styles.month}>{bill.month}</Text>
          <View style={styles.amountRow}>
            <Text style={styles.amount}>Rp {parseFloat(bill.amount).toLocaleString('id-ID')}</Text>
            <TouchableOpacity onPress={() => copyToClipboard(bill.amount.toString(), 'amount')} style={styles.copyButton}>
              <Ionicons name="copy-outline" size={20} color="#a32620" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.methodSection}>
          <Text style={styles.sectionTitle}>Pilih Metode Pembayaran</Text>
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[styles.methodCard, selectedMethod?.id === method.id && styles.methodCardSelected]}
              onPress={() => setSelectedMethod(method)}
            >
              <Ionicons name={method.icon} size={24} color={selectedMethod?.id === method.id ? '#a32620' : '#666'} />
              <Text style={[styles.methodName, selectedMethod?.id === method.id && styles.methodNameSelected]}>
                {method.name}
              </Text>
              {selectedMethod?.id === method.id && (
                <Ionicons name="checkmark-circle" size={24} color="#a32620" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {selectedMethod?.type === 'bank' && bankInfo && (
        <View style={styles.bankInfoCard}>
          <View style={styles.bankHeader}>
            <Ionicons name="card" size={24} color="#a32620" />
            <Text style={styles.sectionTitle}>Informasi Transfer Bank</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bank</Text>
            <Text style={styles.infoValue}>{bankInfo.bank_name}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nomor Rekening</Text>
            <View style={styles.accountRow}>
              <Text style={styles.accountNumber}>{bankInfo.bank_account}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(bankInfo.bank_account, 'account')} style={styles.copyButton}>
                <Ionicons name="copy-outline" size={20} color="#a32620" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Atas Nama</Text>
            <Text style={styles.infoValue}>{bankInfo.bank_account_name}</Text>
          </View>
        </View>
        )}

        {selectedMethod?.type === 'ewallet' && (
        <View style={styles.bankInfoCard}>
          <View style={styles.bankHeader}>
            <Ionicons name="wallet" size={24} color="#a32620" />
            <Text style={styles.sectionTitle}>Informasi E-Wallet</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nomor {selectedMethod.name}</Text>
            <View style={styles.accountRow}>
              <Text style={styles.accountNumber}>{selectedMethod.account_number}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(selectedMethod.account_number, 'phone')} style={styles.copyButton}>
                <Ionicons name="copy-outline" size={20} color="#a32620" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Atas Nama</Text>
            <Text style={styles.infoValue}>{selectedMethod.account_name}</Text>
          </View>
        </View>
        )}

        {selectedMethod && (
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload Bukti Transfer</Text>
          <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
            {proofImage ? (
              <Image source={{ uri: proofImage }} style={styles.proofImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Ionicons name="cloud-upload-outline" size={50} color="#a32620" />
                <Text style={styles.uploadText}>Ambil/Upload Foto Bukti Transfer</Text>
              </View>
            )}
          </TouchableOpacity>
          {proofImage && (
            <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
              <Text style={styles.changeButtonText}>Ganti Foto</Text>
            </TouchableOpacity>
          )}
        </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.payButtonText}>Bayar Sekarang</Text>}
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
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  billType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  methodSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
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
    borderColor: '#eee',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  methodCardSelected: {
    borderColor: '#a32620',
    backgroundColor: '#fff5f5',
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
  month: {
    fontSize: 15,
    color: '#666',
    marginBottom: 10,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a32620',
  },
  bankInfoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  infoRow: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#a32620',
  },
  copyButton: {
    padding: 8,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
  },
  uploadSection: {
    marginBottom: 20,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  uploadPlaceholder: {
    padding: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  proofImage: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  changeButton: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#a32620',
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#a32620',
    fontSize: 14,
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

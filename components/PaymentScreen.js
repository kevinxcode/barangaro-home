import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Clipboard from 'expo-clipboard';

export default function PaymentScreen({ route, navigation }) {
  const { bill } = route.params;
  const [proofImage, setProofImage] = useState(null);

  const bankInfo = {
    bank: 'Bank Central Asia (BCA)',
    accountNumber: '123-000-1233',
    accountName: 'Barangaro Kirana Homes',
  };

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Sukses', 'Nomor rekening disalin');
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
              allowsEditing: true,
              aspect: [3, 4],
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
              allowsEditing: true,
              aspect: [3, 4],
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

  const handlePayment = () => {
    if (!proofImage) {
      Alert.alert('Error', 'Upload bukti transfer terlebih dahulu');
      return;
    }
    // Data siap dikirim ke backend
    const paymentData = {
      bill_id: bill.id,
      amount: bill.amount,
      payment_method: 'Transfer Bank',
      proof_image: proofImage,
    };
    console.log('Payment data ready:', { ...paymentData, proof_image: 'base64_string...' });
    Alert.alert('Sukses', 'Pembayaran berhasil dikirim! Menunggu verifikasi admin.', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.billDetail}>
          <Text style={styles.label}>Detail Tagihan</Text>
          <Text style={styles.billType}>{bill.type}</Text>
          <Text style={styles.month}>{bill.month}</Text>
          <Text style={styles.amount}>Rp {bill.amount.toLocaleString('id-ID')}</Text>
        </View>

        <View style={styles.bankInfoCard}>
          <View style={styles.bankHeader}>
            <Ionicons name="card" size={24} color="#a32620" />
            <Text style={styles.sectionTitle}>Informasi Transfer</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bank</Text>
            <Text style={styles.infoValue}>{bankInfo.bank}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nomor Rekening</Text>
            <View style={styles.accountRow}>
              <Text style={styles.accountNumber}>{bankInfo.accountNumber}</Text>
              <TouchableOpacity onPress={() => copyToClipboard(bankInfo.accountNumber)} style={styles.copyButton}>
                <Ionicons name="copy-outline" size={20} color="#a32620" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Atas Nama</Text>
            <Text style={styles.infoValue}>{bankInfo.accountName}</Text>
          </View>
        </View>

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
  month: {
    fontSize: 15,
    color: '#666',
    marginBottom: 10,
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

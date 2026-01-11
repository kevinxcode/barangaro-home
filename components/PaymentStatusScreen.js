import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config/api';

export default function PaymentStatusScreen({ route, navigation }) {
  const { payment } = route.params;
  const [paymentDetail, setPaymentDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    fetchPaymentDetail();
  }, []);

  const fetchPaymentDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(API.PAYMENTS_DETAIL(payment.payment_id || payment.id), {
        headers: { Authorization: token }
      });
      const data = await response.json();
      if (data.success) setPaymentDetail(data.data);
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
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.iconContainer}>
          <Ionicons name="time-outline" size={80} color="#FF9800" />
        </View>
        
        <Text style={styles.title}>Menunggu Verifikasi</Text>
        <Text style={styles.message}>
          Pembayaran Anda sedang diverifikasi oleh admin. Proses verifikasi biasanya memakan waktu 1x24 jam.
        </Text>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Jenis Iuran</Text>
            <Text style={styles.detailValue}>{paymentDetail?.bill_name || payment.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Periode</Text>
            <Text style={styles.detailValue}>{paymentDetail?.month || payment.month}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nominal</Text>
            <Text style={styles.detailValue}>Rp {parseFloat(paymentDetail?.amount || payment.amount).toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Metode Pembayaran</Text>
            <Text style={styles.detailValue}>{paymentDetail?.payment_method || '-'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Pending Verifikasi</Text>
            </View>
          </View>
        </View>

        {paymentDetail?.proof_image && (
          <View style={styles.proofSection}>
            <Text style={styles.proofLabel}>Bukti Pembayaran</Text>
            <TouchableOpacity onPress={() => setShowImage(true)}>
              <Image 
                source={{ uri: paymentDetail.proof_image }} 
                style={styles.proofImage}
              />
              <Text style={styles.viewFullText}>Tap untuk melihat full</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.note}>
          Anda akan menerima notifikasi setelah pembayaran diverifikasi.
        </Text>
      </ScrollView>
      )}

      <Modal visible={showImage} transparent={true} onRequestClose={() => setShowImage(false)}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setShowImage(false)}>
            <Ionicons name="close-circle" size={40} color="#fff" />
          </TouchableOpacity>
          <Image 
            source={{ uri: paymentDetail?.proof_image }} 
            style={styles.fullImage}
            resizeMode="contain"
          />
        </View>
      </Modal>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PageHome')}>
          <Text style={styles.buttonText}>Kembali ke Beranda</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  detailCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  statusBadge: {
    backgroundColor: '#FFF3E0',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  note: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 20,
  },
  proofSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  proofLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  proofImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  viewFullText: {
    textAlign: 'center',
    color: '#a32620',
    fontSize: 12,
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
  fullImage: {
    width: '100%',
    height: '80%',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    backgroundColor: '#a32620',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

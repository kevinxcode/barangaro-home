import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function NewsScreen() {
  const navigation = useNavigation();
  const [news] = useState([
    {
      id: 1,
      title: 'Rapat Warga Bulan Maret',
      content: 'Akan diadakan rapat warga pada tanggal 15 Maret 2024 pukul 19.00 WIB di balai warga.',
      fullContent: 'Akan diadakan rapat warga pada tanggal 15 Maret 2024 pukul 19.00 WIB di balai warga. Agenda rapat meliputi pembahasan iuran warga, kegiatan gotong royong, dan persiapan peringatan HUT RI. Diharapkan seluruh warga dapat hadir tepat waktu. Bagi yang berhalangan hadir, mohon memberikan konfirmasi kepada ketua RT.',
      date: '2024-03-01',
      category: 'Pengumuman',
    },
    {
      id: 2,
      title: 'Gotong Royong Minggu Depan',
      content: 'Kegiatan gotong royong akan dilaksanakan hari Minggu, 10 Maret 2024 pukul 07.00 WIB.',
      fullContent: 'Kegiatan gotong royong akan dilaksanakan hari Minggu, 10 Maret 2024 pukul 07.00 WIB. Kegiatan meliputi pembersihan lingkungan, perbaikan saluran air, dan penataan taman. Diharapkan setiap keluarga mengirimkan minimal 1 perwakilan. Bawa peralatan seperti sapu, cangkul, dan kantong sampah.',
      date: '2024-03-03',
      category: 'Kegiatan',
    },
    {
      id: 3,
      title: 'Peringatan HUT RI ke-79',
      content: 'Persiapan peringatan HUT RI ke-79 akan dimulai bulan Juli. Panitia akan segera dibentuk.',
      fullContent: 'Persiapan peringatan HUT RI ke-79 akan dimulai bulan Juli. Panitia akan segera dibentuk untuk mengatur berbagai lomba dan kegiatan. Rencana kegiatan meliputi lomba 17an untuk anak-anak dan dewasa, upacara bendera, dan makan bersama. Bagi yang ingin menjadi panitia atau sponsor, silakan menghubungi ketua RT.',
      date: '2024-02-28',
      category: 'Info',
    },
    {
      id: 4,
      title: 'Perbaikan Jalan Komplek',
      content: 'Perbaikan jalan di area komplek akan dilakukan minggu depan. Mohon kerjasamanya.',
      fullContent: 'Perbaikan jalan di area komplek akan dilakukan minggu depan mulai tanggal 11-15 Maret 2024. Pekerjaan meliputi pengaspalan ulang dan perbaikan lubang. Mohon kerjasamanya untuk tidak parkir kendaraan di area yang sedang dikerjakan. Akses kendaraan akan dialihkan sementara.',
      date: '2024-02-25',
      category: 'Pengumuman',
    },
  ]);

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Pengumuman': return '#a32620';
      case 'Kegiatan': return '#4CAF50';
      case 'Info': return '#2196F3';
      default: return '#666';
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {news.map(item => (
          <TouchableOpacity key={item.id} style={styles.newsCard}>
            <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(item.category) }]}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.newsContent}>{item.content}</Text>
            <View style={styles.footer}>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar-outline" size={16} color="#666" />
                <Text style={styles.date}>{item.date}</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('NewsDetail', { news: item })}>
                <Text style={styles.readMore}>Baca Selengkapnya</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
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
  newsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 15,
    marginBottom: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  newsContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    color: '#666',
    marginLeft: 5,
  },
  readMore: {
    fontSize: 13,
    color: '#a32620',
    fontWeight: '600',
  },
});

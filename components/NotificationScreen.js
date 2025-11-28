import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationScreen() {
  const [notifications] = useState([
    { id: 1, title: 'Tagihan Baru', message: 'Iuran bulan Maret 2024 telah tersedia', date: '2024-03-01', read: false },
    { id: 2, title: 'Pembayaran Berhasil', message: 'Pembayaran iuran Februari 2024 berhasil', date: '2024-02-05', read: true },
    { id: 3, title: 'Pengumuman', message: 'Rapat warga akan diadakan tanggal 15 Maret', date: '2024-02-28', read: true },
  ]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        {notifications.map(notif => (
          <TouchableOpacity key={notif.id} style={[styles.notifCard, !notif.read && styles.notifUnread]}>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={notif.read ? 'mail-open-outline' : 'mail-unread-outline'} 
                size={24} 
                color={notif.read ? '#666' : '#a32620'} 
              />
            </View>
            <View style={styles.notifContent}>
              <Text style={[styles.title, !notif.read && styles.titleUnread]}>{notif.title}</Text>
              <Text style={styles.message}>{notif.message}</Text>
              <Text style={styles.date}>{notif.date}</Text>
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
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  notifUnread: {
    backgroundColor: '#fff5f5',
    borderLeftWidth: 4,
    borderLeftColor: '#a32620',
  },
  iconContainer: {
    marginRight: 15,
    paddingTop: 3,
  },
  notifContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  titleUnread: {
    color: '#a32620',
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
});

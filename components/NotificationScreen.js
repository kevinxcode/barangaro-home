import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../config/api';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await fetch(API.NOTIFICATIONS, {
        headers: { Authorization: token }
      });
      const data = await response.json();
      if (data.success) setNotifications(data.data);
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
        {notifications.map(notif => (
          <TouchableOpacity key={notif.id} style={[styles.notifCard, !notif.is_read && styles.notifUnread]}>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={notif.is_read ? 'mail-open-outline' : 'mail-unread-outline'} 
                size={24} 
                color={notif.is_read ? '#666' : '#a32620'} 
              />
            </View>
            <View style={styles.notifContent}>
              <Text style={[styles.title, !notif.is_read && styles.titleUnread]}>{notif.title}</Text>
              <Text style={styles.message}>{notif.message}</Text>
              <Text style={styles.date}>{notif.created_at?.substring(0, 10)}</Text>
            </View>
          </TouchableOpacity>
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

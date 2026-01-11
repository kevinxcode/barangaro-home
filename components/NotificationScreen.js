import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getAPI } from '../config/api';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingRead, setMarkingRead] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchNotifications();
    });
    return unsubscribe;
  }, [navigation]);

  const fetchNotifications = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const API = getAPI();
      const response = await fetch(API.NOTIFICATIONS, {
        headers: { Authorization: token }
      });
      const data = await response.json();
      console.log('Notifications data:', data);
      if (data.success) setNotifications(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPress = async (notif) => {
    console.log('Notification pressed:', notif.id, 'is_read:', notif.is_read);
    if (notif.is_read === '0') {
      setMarkingRead(notif.id);
      try {
        const token = await AsyncStorage.getItem('token');
        const API = getAPI();
        console.log('Calling API:', API.NOTIFICATIONS_READ(notif.id));
        const response = await fetch(API.NOTIFICATIONS_READ(notif.id), {
          method: 'POST',
          headers: { Authorization: token }
        });
        
        const data = await response.json();
        console.log('Mark read response:', data);
        if (data.success) {
          // Update local state
          setNotifications(notifications.map(n => 
            n.id === notif.id ? { ...n, is_read: '1' } : n
          ));
        }
      } catch (error) {
        console.error('Mark read error:', error);
      } finally {
        setMarkingRead(null);
      }
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
          <View key={notif.id} style={[styles.notifCard, notif.is_read === '0' && styles.notifUnread]}>
            <View style={styles.iconContainer}>
              <Ionicons 
                name={notif.is_read === '1' ? 'mail-open-outline' : 'mail-unread-outline'} 
                size={24} 
                color={notif.is_read === '1' ? '#666' : '#a32620'} 
              />
            </View>
            <View style={styles.notifContent}>
              <Text style={[styles.title, notif.is_read === '0' && styles.titleUnread]}>{notif.title}</Text>
              <Text style={styles.message}>{notif.message}</Text>
              <Text style={styles.date}>{notif.created_at?.substring(0, 10)}</Text>
            </View>
            {notif.is_read === '0' && (
              <TouchableOpacity 
                style={styles.markReadButton}
                onPress={() => handleNotificationPress(notif)}
                disabled={markingRead === notif.id}
              >
                {markingRead === notif.id ? (
                  <ActivityIndicator size="small" color="#4CAF50" />
                ) : (
                  <Ionicons name="checkmark-circle-outline" size={28} color="#4CAF50" />
                )}
              </TouchableOpacity>
            )}
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
  markReadButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

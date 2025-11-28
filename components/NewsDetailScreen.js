import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NewsDetailScreen({ route }) {
  const { news } = route.params;

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
        <View style={[styles.categoryBadge, { backgroundColor: getCategoryColor(news.category) }]}>
          <Text style={styles.categoryText}>{news.category}</Text>
        </View>
        
        <Text style={styles.title}>{news.title}</Text>
        
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={18} color="#666" />
          <Text style={styles.date}>{news.date}</Text>
        </View>

        <View style={styles.divider} />

        <Text style={styles.fullContent}>{news.fullContent || news.content}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 15,
    marginBottom: 15,
  },
  categoryText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    lineHeight: 32,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  date: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 20,
  },
  fullContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
  },
});

import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    email: '',
    nama: '',
    telepon: '',
    nomorRumah: '',
  });
  const [ktpImage, setKtpImage] = useState(null);

  const convertToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Error', 'Izin kamera diperlukan');
      return;
    }

    Alert.alert(
      'Upload KTP',
      'Pilih metode',
      [
        {
          text: 'Ambil Foto',
          onPress: async () => {
            const result = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              aspect: [16, 9],
              quality: 0.5,
              base64: true,
            });
            if (!result.canceled) {
              const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
              setKtpImage(base64);
            }
          },
        },
        {
          text: 'Pilih dari Galeri',
          onPress: async () => {
            const result = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              aspect: [16, 9],
              quality: 0.5,
              base64: true,
            });
            if (!result.canceled) {
              const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
              setKtpImage(base64);
            }
          },
        },
        { text: 'Batal', style: 'cancel' },
      ]
    );
  };

  const handleRegister = () => {
    if (!formData.email || !formData.nama || !formData.telepon || !formData.nomorRumah || !ktpImage) {
      Alert.alert('Error', 'Semua field harus diisi');
      return;
    }
    // Data siap dikirim ke backend dengan ktpImage dalam format base64
    const dataToSend = {
      ...formData,
      foto_ktp: ktpImage, // Base64 string
    };
    console.log('Data ready to send:', { ...dataToSend, foto_ktp: 'base64_string...' });
    Alert.alert('Sukses', 'Pendaftaran berhasil! Menunggu verifikasi admin.', [
      { text: 'OK', onPress: () => navigation.navigate('Login') }
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Daftar Akun</Text>
        <Text style={styles.subtitle}>Lengkapi data untuk mendaftar</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Nama Lengkap"
          value={formData.nama}
          onChangeText={(text) => setFormData({ ...formData, nama: text })}
        />

        <TextInput
          style={styles.input}
          placeholder="Nomor Telepon"
          value={formData.telepon}
          onChangeText={(text) => setFormData({ ...formData, telepon: text })}
          keyboardType="phone-pad"
        />

        <TextInput
          style={styles.input}
          placeholder="Nomor Rumah"
          value={formData.nomorRumah}
          onChangeText={(text) => setFormData({ ...formData, nomorRumah: text })}
        />

        <Text style={styles.label}>Foto KTP</Text>
        <TouchableOpacity style={styles.uploadBox} onPress={pickImage}>
          {ktpImage ? (
            <Image source={{ uri: ktpImage }} style={styles.ktpImage} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="camera" size={40} color="#a32620" />
              <Text style={styles.uploadText}>Ambil/Upload Foto KTP</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Daftar</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Sudah punya akun? Login</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#a32620',
    marginBottom: 5,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  uploadBox: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 8,
    marginBottom: 20,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
  },
  ktpImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#a32620',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    color: '#a32620',
    fontSize: 14,
    marginTop: 20,
    marginBottom: 30,
  },
});

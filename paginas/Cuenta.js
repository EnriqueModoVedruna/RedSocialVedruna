import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker'; // Para seleccionar imágenes

const defaultProfileImage = require('../assets/alumno.png');

export function Cuenta({ navigation }) {
  const [usuario, setUsuario] = useState(null); // Guardamos los datos del usuario
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const nombreUsuario = usuario ? usuario.nombre : "Desconocido";

  // Obtén el usuario logueado desde AsyncStorage o el backend
  useEffect(() => {
    fetchUsuario();
    
  }, []);

  const fetchUsuario = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        // Realiza la consulta para obtener el usuario
        const response = await fetch(`http://192.168.131.73:8080/proyecto01/users/${userId}`);
        const data = await response.json();
        setUsuario(data);
        setFotoPerfil(data.fotoPerfil ? { uri: data.fotoPerfil } : defaultProfileImage);
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    }
    console.log("ID:", usuario);
  };

  // Función para cambiar la foto de perfil
  const seleccionarImagen = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.cancelled) {
        setFotoPerfil({ uri: result.uri });
        // Aquí puedes agregar la lógica para subir la nueva foto al backend
        actualizarFotoPerfil(result.uri);
      }
    } else {
      Alert.alert('Permisos', 'Se necesitan permisos para acceder a la galería.');
    }
  };

  // Función para actualizar la foto en el backend
  const actualizarFotoPerfil = async (uri) => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        const formData = new FormData();
        formData.append('photo', {
          uri: uri,
          type: 'image/jpeg', // Cambia el tipo según el formato de la imagen
          name: 'profile.jpg',
        });

        const response = await fetch(`http://192.168.131.73:8080/proyecto01/usuarios/${userId}/update-profile-picture`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        });

        if (response.ok) {
          Alert.alert('Éxito', 'Foto de perfil actualizada correctamente.');
          fetchUsuario(); // Recargar los datos del usuario
        } else {
          Alert.alert('Error', 'No se pudo actualizar la foto de perfil.');
        }
      }
    } catch (error) {
      console.error('Error al actualizar la foto de perfil:', error);
      Alert.alert('Error', 'Hubo un problema al actualizar la foto.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cabecera}>
        <TouchableOpacity onPress={seleccionarImagen}>
          <Image source={fotoPerfil} style={styles.profileImage} />
        </TouchableOpacity>
        <View style={styles.pading}>
          <Text style={styles.numero}>25</Text>
          <Text style={styles.texto}>Publicaciones</Text>
        </View>
        <View style={styles.pading}>
          <Text style={styles.numero}>120</Text>
          <Text style={styles.texto}>Seguidores</Text>
        </View>
        <View style={styles.pading}>
          <Text style={styles.numero}>50</Text>
          <Text style={styles.texto}>Siguiendo</Text>
        </View>
      </View>

      <View>
        
        <Text style={styles.userName}>{nombreUsuario}</Text>
        {/* <Text style={styles.userInfo}>{usuario?.email}</Text> */}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#1e1e1e', alignItems: 'center', paddingVertical: 20, color: '#fff' },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#84dc3f',
    marginRight: 8,
  },
  pading: { paddingRight: 15, paddingTop: 20 },
  userName: { color: '#84dc3f', fontSize: 16, fontWeight: 'bold' },
  userInfo: { color: '#ccc', fontSize: 14 },
  cabecera: { flexDirection: 'row', marginTop: 10 },
  numero: { fontSize: 10, color: '#fff', alignSelf: 'center' },
  texto: { fontSize: 10, color: '#ccc' },
});

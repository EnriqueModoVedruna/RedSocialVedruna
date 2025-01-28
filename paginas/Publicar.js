import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export function Publicar({ navigation, route }) {
  const [simagen, setImagen] = useState('');
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // UID del usuario (puedes pasar esto desde la pantalla anterior con `route.params.uid`)
  const uid = route?.params?.uid || 'default-uid'; // Ajusta esto según cómo manejes el UID

  // Función para seleccionar una imagen desde la galería
  const seleccionarImagen = async () => {
    // Solicitar permisos de acceso a la galería
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permisos denegados', 'Se necesita acceso a la galería para seleccionar una imagen.');
      return;
    }

    // Abrir la galería
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Solo permitir imágenes
      allowsEditing: true, // Permitir recortar la imagen
      aspect: [4, 3], // Aspecto de recorte
      quality: 1, // Calidad máxima de la imagen
    });

    if (!result.canceled) {
      setImagen(result.assets[0].uri); // Guardar la URI de la imagen seleccionada
    }
  };

  // Función que inserta los datos en MongoDB
  const crearPublicacion = async () => {
    if (!titulo || !descripcion) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    const publicacionData = {
      user_id: uid, // Asociar la publicación con el usuario
      image_url: simagen,
      titulo: titulo,
      comentario: descripcion,
    };

    try {
      const response = await fetch('http://192.168.15.73:8080/proyecto01/publicaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(publicacionData),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error('Respuesta del servidor:', errorResponse);
        throw new Error('Error al publicar: ' + errorResponse);
      }

      const data = await response.json();
      console.log('Publicación registrada en MongoDB:', data);

      Alert.alert('Éxito', 'Tu publicación ha sido creada exitosamente.');
      // navigation.navigate('Home'); // Redirigir a otra pantalla si es necesario
    } catch (error) {
      console.error('Error al registrar la publicación en MongoDB:', error.message);
      Alert.alert('Error', 'No se pudo crear la publicación. Inténtalo de nuevo.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>PUBLICACIÓN</Text>

      {/* Imagen que funciona como botón */}
      <TouchableOpacity onPress={seleccionarImagen}>
        <Image
          source={simagen ? { uri: simagen } : require('../assets/cpublicacion.png')}
          style={styles.imagen}
        />
      </TouchableOpacity>

      <Text style={styles.text}>Título:</Text>
      <TextInput
        style={styles.input}
        placeholder="Máx. 40 Caracteres"
        keyboardType="default"
        placeholderTextColor="#fff"
        multiline={true}
        textAlignVertical="top"
        value={titulo}
        onChangeText={setTitulo}
      />

      <Text style={styles.text}>Descripción:</Text>
      <TextInput
        style={styles.input2}
        placeholder="Máx. 250 Caracteres"
        keyboardType="default"
        placeholderTextColor="#fff"
        multiline={true}
        textAlignVertical="top"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      <TouchableOpacity onPress={crearPublicacion} style={styles.button}>
        <Text style={styles.buttonText}>PUBLICAR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    justifyContent: 'center',
  },
  text: {
    fontSize: 20,
    color: '#84dc3f',
    textAlign: 'left',
    marginLeft: 30,
  },
  titulo: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#84dc3f',
    textAlign: 'center',
  },
  imagen: {
    width: 200,
    height: 200,
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    width: '75%',
    height: 40,
    borderColor: '#454242',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#454242',
    marginLeft: 30,
    color: '#fff',
  },
  input2: {
    width: '75%',
    height: '30%',
    borderColor: '#454242',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#454242',
    marginLeft: 30,
    color: '#fff',
  },
  button: {
    backgroundColor: '#1e1e1e',
    borderWidth: 3,
    borderColor: '#84dc3f',
    padding: 10,
    borderRadius: 5,
    width: '35%',
    alignSelf: 'center',
  },
  buttonText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
});

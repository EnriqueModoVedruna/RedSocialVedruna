import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';


export function NuevaIncidencia({ navigation, route }) {
    const [imagen, setImagen] = useState('');
    const [numero, setNumero] = useState('');
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');

    // UID del usuario (puedes pasar esto desde la pantalla anterior con `route.params.uid`)
    const uid = route?.params?.uid || 'default-uid'; // Ajusta esto según cómo manejes el UID

    // Funcion para selleccionar la imagen desde la galeria
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
        const crearIncidencia = async () => {
          if (!titulo || !descripcion || !numero) {
            Alert.alert('Error', 'Por favor, complete todos los campos.');
            return;
          }
      
          const incidenciaData = {
            user_id: uid, // Asociar la incidencia con el usuario
            image_url: imagen,
            numero: numero,
            titulo: titulo,
            descripcion: descripcion,
          };
      
          try {
            const response = await fetch('http://192.168.131.73:8080/proyecto01/incidencias', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(incidenciaData),
            });
      
            if (!response.ok) {
              const errorResponse = await response.text();
              console.error('Respuesta del servidor:', errorResponse);
              throw new Error('Error al publicar: ' + errorResponse);
            }
      
            const data = await response.json();
            console.log('Incidencia registrada en MongoDB:', data);
      
            Alert.alert('Éxito', 'Tu incidencia ha sido creada exitosamente.');
            navigation.navigate('Home'); // Redirigir a otra pantalla si es necesario
          } catch (error) {
            console.error('Error al registrar la incidencia en MongoDB:', error.message);
            Alert.alert('Error', 'No se pudo crear la incidencia. Inténtalo de nuevo.');
          }
        };

  return (
    <View style={styles.container}>
          <Text style={styles.titulo}>INCIDENCIA</Text>
    
          {/* Imagen que funciona como botón */}
          <TouchableOpacity onPress={seleccionarImagen}>
            <Image
              source={imagen ? { uri: imagen } : require('../assets/cpublicacion.png')}
              style={styles.imagen}
            />
          </TouchableOpacity>
    
          <Text style={styles.text}>Nº del equipo / clase:</Text>
          <TextInput
            style={styles.input}
            keyboardType="default"
            placeholderTextColor="#fff"
            multiline={true}
            textAlignVertical="top"
            value={numero}
            onChangeText={setNumero}
          />
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
    
          <Text style={styles.text}>Descripción del problema:</Text>
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
    
          <TouchableOpacity onPress={crearIncidencia} style={styles.button}>
            <Text style={styles.buttonText}>ENVIAR</Text>
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
      width: '85%',
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
      width: '85%',
      height: '30%',
      borderColor: '#454242',
      borderWidth: 1,
      borderRadius: 5,
      paddingHorizontal: 10,
      marginBottom: 15,
      backgroundColor: '#454242',
      marginLeft: 30,
      color: '#fff',
      alignItems: 'center',
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
      fontSize: 18,
      textAlign: 'center',
      color: '#fff',
      fontWeight: 'bold',
    }
})
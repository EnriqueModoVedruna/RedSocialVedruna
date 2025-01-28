import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
const imagen = require('../assets/cpublicacion.png');
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

export function Publicar({navigation}) {
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');

    // Funcion que inserta los datos en Mongo
    const crearPublicacion = async (titulo, descripcion) => {
        try{
            // Usamos la funcion para registrar en MongoDB
            // await registrarEnAtlas()
        } catch (error) {
            console.error('Error al publicar: ', error.message);
            Alert.alert('Error', error.message);
        }
    }

    const registrarEnAtlas = async (uid) => {
        const userData = {
          user_id: uid, // UID del usuario generado por Firebase
          titulo: titulo,
          comentario: descripcion,
          image_url: "", // Valor predeterminado (puede ser modificado más adelante)
        };
    
        try {
          const response = await fetch("http://192.168.15.73:8080/proyecto01/publicaciones", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
          });
    
          if (!response.ok) {
            const errorResponse = await response.text();
            console.error("Respuesta del servidor:", errorResponse);
            throw new Error("Error al registrar en MongoDB: " + errorResponse);
          }
    
          const data = await response.json();
          console.log("Post registrado en la base de datos:", data);
        } catch (error) {
          console.error("Error al registrar en MongoDB:", error.message);
        }
      };
    
      // Manejar el evento de registro
      const handleRegister = async () => {
        if (!titulo || !descripcion) {
          Alert.alert('Error', 'Por favor, complete todos los campos.');
          return;
        }
        await crearPublicacion(titulo, descripcion);
      };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>PUBLICACIÓN</Text>
      <Image source={imagen} style={styles.imagen}/>

      <Text style={styles.label}></Text>
      <Text style={styles.text}>Título:</Text>
            <TextInput
              style={styles.input}
              placeholder="Máx. 40 Caracteres"
              keyboardType="default"
              placeholderTextColor="#fff"
              multiline={true} // Permite que el texto se alinee arriba si es necesario
              textAlignVertical="top" // Alinea el texto arriba a la izquierda
              value={titulo}
              onChangeText={setTitulo}
            />

<Text style={styles.label}></Text>
      <Text style={styles.text}>Descripción:</Text>
            <TextInput
              style={styles.input2}
              placeholder="Máx. 250 Caracteres"
              keyboardType="default"
              placeholderTextColor="#fff"
              multiline={true} // Permite que el texto se alinee arriba si es necesario
              textAlignVertical="top" // Alinea el texto arriba a la izquierda
              value={descripcion}
              onChangeText={setDescripcion}
            />

            <TouchableOpacity
                        // Antes de impelmentar la función de registro, el boton me mandaba directamente hacia la página de inicio de sesión.
                              // onPress={() => navigation.navigate('Log')}
                              onPress={handleRegister}
                              style={{
                                backgroundColor: '#1e1e1e',
                                borderWidth: 3,
                                borderColor: '#84dc3f',
                                padding: 10,
                                borderRadius: 5,
                                width: '35%',
                                alignSelf: 'center',
                              }}
                            >
                              <Text style={{fontSize: 16, textAlign: 'center', color: '#fff', fontWeight: 'bold',}}>PUBLICAR</Text>
                            </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#1e1e1e',
    //   alignItems: 'center',
      justifyContent: 'center',
    },
    text:{
        fontSize: 20,
      color: '#84dc3f',
      textAlign: 'left',
      marginLeft: 30
    },
    titulo:{
      fontSize: 34,
      fontWeight: 'bold',
      color: '#84dc3f',
      textAlign: 'center',
    },
    imagen:{
        width: 200, 
        height: 200, 
        alignSelf: 'center',
    },
    label: {
      fontSize: 18,
      marginBottom: 5,
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
      color: '#fff'
      
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
        color: '#fff'
        
      },
    multilineInput: {
      height: 100,
      textAlignVertical: 'top',
    },
    summary: {
      fontSize: 16,
      marginTop: 20,
    },
    paragraph: {
      fontSize: 16,
      textAlign: 'center',
      color: '#fff',
    },
    link: {
      color: '#84dc3f',
      textDecorationLine: 'underline',
    },
  });
  
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, ScrollView, Alert, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

export function HomeScreen({ navigation }) {
  const [publicaciones, setPublicaciones] = useState([]); // Estado para almacenar las publicaciones
  const [loading, setLoading] = useState(true); // Estado para gestionar la carga de datos

  // Función para obtener las publicaciones desde MongoDB
  const fetchPublicaciones = async () => {
    try {
      const response = await fetch("http://192.168.15.73:8080/proyecto01/publicaciones", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error("Error al obtener publicaciones:", errorResponse);
        throw new Error("Error al obtener publicaciones: " + errorResponse);
      }

      const data = await response.json();
      setPublicaciones(data); // Guardar las publicaciones en el estado
      setLoading(false); // Cambiar el estado de carga
    } catch (error) {
      console.error("Error al obtener publicaciones:", error.message);
      Alert.alert("Error", "No se pudieron cargar las publicaciones.");
      setLoading(false); // Cambiar el estado de carga incluso si hay error
    }
  };

  // useEffect para cargar las publicaciones al montar el componente
  useEffect(() => {
    fetchPublicaciones();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Publicaciones</Text>

      {loading ? (
        <Text style={styles.text}>Cargando publicaciones...</Text>
      ) : publicaciones.length > 0 ? (
        publicaciones.map((publicacion, index) => (
          <View key={index} style={styles.card}>
            {publicacion.image_url ? (
              <Image
                source={{ uri: publicacion.image_url }}
                style={styles.cardImage}
              />
            ) : (
              <Image
                source={require('../assets/cpublicacion.png')} // Imagen de respaldo si no hay URL
                style={styles.cardImage}
              />
            )}
            <Text style={styles.cardTitle}>{publicacion.titulo}</Text>
            <Text style={styles.cardDescription}>{publicacion.comentario}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.text}>No hay publicaciones disponibles.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 20,
  },
  text: {
    color: '#84dc3f',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#2c2c2c',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    width: '90%',
  },
  cardImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#84dc3f',
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 16,
    color: '#fff',
  },
});

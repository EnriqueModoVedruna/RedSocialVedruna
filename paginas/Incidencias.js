import { React, useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export function Incidencias({ navigation }) {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidencias();
  }, []);

  const fetchIncidencias = async () => {
    try {
      const response = await fetch("http://192.168.131.73:8080/proyecto01/incidencias");
      if (!response.ok) throw new Error("Error al obtener las incidencias");
      const data = await response.json();
      setIncidencias(data);
    } catch (error) {
      console.error("Error al obtener las incidencias:", error.message);
      Alert.alert("Error", "No se pudieron cargar las incidencias.");
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "EN TRÁMITE": return "orange";
      case "SOLUCIONADO": return "green";
      case "DENEGADA": return "red";
      default: return "white";
    }
  };

  return (
    
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Text style={styles.title}>INCIDENCIAS</Text>

      <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
        {loading ? (
          <Text style={styles.loadingText}>Cargando incidencias...</Text>
        ) : (
          incidencias.length > 0 ? (
            incidencias.map((incidencia, index) => (
              <View key={index} style={styles.incidenciaCard}>
                <Text style={styles.incidenciaTitle}>{incidencia.titulo}</Text>
                <Text style={[styles.incidenciaEstado, { color: getEstadoColor(incidencia.estado) }]}>
                  {incidencia.estado}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No hay incidencias disponibles.</Text>
          )
        )}
      </ScrollView>

      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => navigation.navigate('NuevaIncidencia')}
      >
        <Ionicons name="add-circle" size={60} color="#84dc3f" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#1e1e1e',
    paddingTop: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#84dc3f',
    marginBottom: 50,
  },
  scrollContainer: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 100, // Para que no se tape el botón
  },
  loadingText: {
    color: '#84dc3f',
    fontSize: 18,
    marginTop: 20,
  },
  noDataText: {
    color: '#84dc3f',
    fontSize: 18,
    marginTop: 20,
  },
  incidenciaCard: {
    backgroundColor: '#2e2e2e',
    width: '83%',
    padding: 15,
    borderRadius: 20,
    marginBottom: 25,
  },
  incidenciaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#84dc3f',
  },
  incidenciaEstado: {
    fontSize: 13,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
});

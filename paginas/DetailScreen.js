import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

export function DetailScreen({ route }) {
  const { publicacion } = route.params; // Recibe los datos de la publicación como parámetro

  return (
    <View style={styles.container}>
      <Image source={{ uri: publicacion.image_url }} style={styles.image} />
      <Text style={styles.title}>{publicacion.titulo}</Text>
      <Text style={styles.description}>{publicacion.comentario}</Text>
      {/* Agrega más detalles según sea necesario */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1e1e1e', padding: 20 },
  image: { width: '100%', height: 300, marginBottom: 20 },
  title: { color: '#84dc3f', fontSize: 24, fontWeight: 'bold' },
  description: { color: '#fff', fontSize: 16 },
});

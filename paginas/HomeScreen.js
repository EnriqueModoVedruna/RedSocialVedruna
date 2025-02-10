import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const vedruna = require('../assets/vedruna.png');

export function HomeScreen({ navigation }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [comentarios, setComentarios] = useState({}); // Nuevo estado para almacenar los comentarios

  useEffect(() => {
    fetchCurrentUser();
    fetchPublicaciones();
    fetchUsuarios();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        setCurrentUserId(userId);
      }
    } catch (error) {
      console.error("Error al obtener el usuario logueado:", error);
    }
  };

  const fetchPublicaciones = async () => {
    try {
      const response = await fetch("http://192.168.131.73:8080/proyecto01/publicaciones");
      if (!response.ok) throw new Error("Error al obtener publicaciones");
      const data = await response.json();
      setPublicaciones(data);

      // Obtener los comentarios para cada publicación
      data.forEach(publicacion => {
        fetchComentarios(publicacion._id);
      });
    } catch (error) {
      console.error("Error al obtener publicaciones:", error.message);
      Alert.alert("Error", "No se pudieron cargar las publicaciones.");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsuarios = async () => {
    try {
      const response = await fetch("http://192.168.131.73:8080/proyecto01/users/name");
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error.message);
    }
  };

  const fetchComentarios = async (publicacionId) => {
    try {
      const response = await fetch(`http://192.168.131.73:8080/proyecto01/comentarios/${publicacionId}`);
      if (!response.ok) throw new Error("Error al obtener comentarios");
      const data = await response.json();
      setComentarios({ ...comentarios, [publicacionId]: data }); // Actualizar el estado de comentarios
    } catch (error) {
      console.error("Error al obtener comentarios:", error.message);
    }
  };

  const toggleLike = async (publicacionId) => {
    if (!currentUserId) return;
    try {
      await fetch(`http://192.168.131.73:8080/proyecto01/publicaciones/put/${publicacionId}/${currentUserId}`, {
        method: 'PUT',
      });
      fetchPublicaciones();
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cabecera}>
        <Image source={vedruna} style={styles.vedruna} />
        <View>
          <Text style={styles.usuario}>{usuarios.find(user => user._id === currentUserId)?.nombre || "Usuario"}</Text>
          <Text style={styles.titulo}>VEDRUNA</Text>
        </View>
      </View>

      {loading ? (
        <Text style={styles.text}>Cargando publicaciones...</Text>
      ) : (
        publicaciones.map((publicacion, index) => {
          const usuario = usuarios.find(user => user._id === publicacion.userId);
          const nombreUsuario = usuario ? usuario.nombre : "Desconocido";
          const fotoPerfil = usuario?.fotoPerfil || "https://via.placeholder.com/50";
          const numLikes = publicacion.likes ? publicacion.likes.length : 0;
          const isLiked = (publicacion.likes || []).includes(currentUserId);
          const numComentarios = comentarios[publicacion._id] ? comentarios[publicacion._id].length : 0; // Obtener el número de comentarios

          return (
            <View key={index} style={styles.card}>
              <TouchableOpacity
                onPress={() => navigation.navigate('Detail', { publicacion })}
              >
              <View style={styles.imageContainer}>
                {publicacion.image_url ? (
                  <Image source={{ uri: publicacion.image_url }} style={styles.cardImage} />
                ) : (
                  <Image source={require('../assets/cpublicacion.png')} style={styles.cardImage} />
                )}
                <View style={styles.userInfo}>
                  <Image source={{ uri: fotoPerfil }} style={styles.profileImage} />
                  <Text style={styles.userName}>{nombreUsuario}</Text>
                </View>
              </View>
              </TouchableOpacity>

              <View style={styles.likeContainer}>
                <TouchableOpacity onPress={() => toggleLike(publicacion._id)}>
                  <Text style={[styles.cardMeta, isLiked ? styles.heartLiked : styles.heartDefault]}>
                    {isLiked ? '❤️' : ''} {numLikes} Me Gusta
                  </Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.cardTitle}>{publicacion.titulo}</Text>
              <Text style={styles.cardDescription}>{publicacion.comentario}</Text>
              <Text style={styles.cardMeta}>{numComentarios} Comentarios</Text> {/* Mostrar el número de comentarios */}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#1e1e1e', alignItems: 'center', paddingVertical: 20 },
  usuario: { color: '#fff' },
  text: { color: '#84dc3f', textAlign: 'center', fontSize: 16, marginTop: 20 },
  titulo: { fontSize: 40, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
  vedruna: { width: 80, height: 80, marginRight: 8 },
  card: { backgroundColor: '#2c2c2c', paddingBottom: 15, marginVertical: 10, width: '100%' },
  imageContainer: { position: "relative" },
  cardImage: { width: '100%', height: 400 },
  cabecera: { flexDirection: "row" },
  userInfo: { position: "absolute", top: 10, left: 10, flexDirection: "row", alignItems: "center" },
  profileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 8 },
  userName: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  cardTitle: { fontSize: 20, fontWeight: 'bold', color: '#84dc3f', marginBottom: 5, marginLeft: 20 },
  cardDescription: { fontSize: 16, color: '#fff', marginBottom: 5, marginLeft: 20 },
  cardMeta: { fontSize: 14, color: '#ccc', marginBottom: 5, marginLeft: 20 },
  likeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heartDefault: { color: 'white' },
  heartLiked: { color: 'red' },
});
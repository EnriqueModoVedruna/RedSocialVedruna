import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LikeButton from '../componentes/LikeButton'

const vedruna = require('../assets/vedruna.png');
const defaultProfileImage = require('../assets/alumno.png');

export function HomeScreen({ navigation, route }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [comentarios, setComentarios] = useState({});

  useEffect(() => {
    fetchCurrentUser();
    fetchPublicaciones();
    fetchComentarios();
    fetchUsuarios();
  }, []);

  
  const fetchCurrentUser = async () => {
    try {
      const userId = route.params?.uid || (await AsyncStorage.getItem("user_id"));
      if (userId) {
        setCurrentUserId(userId);
        setCurrentUser(userId);
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
      data.forEach(publicacion => fetchComentarios(publicacion._id));
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
      setComentarios(prev => ({ ...prev, [publicacionId]: data }));
    } catch (error) {
      console.error("Error al obtener comentarios:", error.message);
    }
  };

  const calcularTiempoTranscurrido = (fecha) => {
    const fechaPublicacion = new Date(fecha);
    const fechaActual = new Date();
    const diferenciaTiempo = fechaActual - fechaPublicacion;
    const diasTranscurridos = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));
    return diasTranscurridos === 0 ? "Hoy" : `Hace ${diasTranscurridos} días`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.cabecera}>
        <Image source={vedruna} style={styles.vedruna} />
        <View>
          <Text style={styles.usuario}>{usuarios.find(user => user.user_id === currentUserId)?.nombre || "Usuario"}</Text>
          <Text style={styles.titulo}>VEDRUNA</Text>
        </View>
      </View>

      {loading ? (
        <Text style={styles.text}>Cargando publicaciones...</Text>
      ) : (
        publicaciones.map((publicacion, index) => {
          const usuario = usuarios.find(user => user.user_id === publicacion.user_id);
          const nombreUsuario = usuario ? usuario.nombre : "Desconocido";
          const fotoPerfil = usuario?.profile_picture ? { uri: usuario.profile_picture } : defaultProfileImage;
          const numComentarios = comentarios[publicacion._id]?.length || 0;
          // const isLiked = (publicacion.likes || []).includes(currentUserId);
          const numLikes = publicacion.likes ? publicacion.likes.length : 0;
          console.log("Publicación recibida:", publicacion); // Verifica qué trae cada publicación

          return (
            <View key={index} style={styles.card}>
              <TouchableOpacity onPress={() => 
                  navigation.navigate('Detail', { 
                    publicacion, //Importamos la publicacion a la DetailScreen
                    usuario,  // Usuario correspondiente a la publicación
                    numLikes, // Número de likes
                    tiempoTranscurrido: calcularTiempoTranscurrido(publicacion.createdAt) // Tiempo transcurrido
                  })
                }>
                <View style={styles.imageContainer}>
                  {publicacion.image_url ? (
                    <Image source={{ uri: publicacion.image_url }} style={styles.cardImage} />
                  ) : (
                    <Image source={require('../assets/cpublicacion.png')} style={styles.cardImage} />
                  )}
                  <View style={styles.userInfo}>
                    <Image source={fotoPerfil} style={styles.profileImage} />
                    <View>
                      <Text style={styles.userPublicado}>Publicado por</Text>
                      <Text style={styles.userName}>{nombreUsuario}</Text>
                      <Text style={styles.userFecha}>{calcularTiempoTranscurrido(publicacion.createdAt)}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>

              {/* Boton de me gusta importado */}
              <View style={styles.likeContainer}>
                <LikeButton 
                  publicacion={publicacion} 
                  currentUserId={currentUserId} 
                  onLikeSuccess={fetchPublicaciones} // Para actualizar la lista tras dar like
                />
              </View>

              <Text style={styles.cardTitle}>{publicacion.titulo}</Text>
              <Text style={styles.cardDescription}>{publicacion.comentario}</Text>
              <Text style={styles.cardMeta}>{numComentarios} Comentarios</Text>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  userPublicado: { color: '#fff', fontSize: 12 },
  userFecha: { color: '#ccc', fontSize: 10 },
  container: { flexGrow: 1, backgroundColor: '#1e1e1e', alignItems: 'center', paddingVertical: 20 },
  text: { color: '#84dc3f', textAlign: 'center', fontSize: 16, marginTop: 20 },
  cabecera: { flexDirection: "row", marginTop:  10},
  usuario: { color: '#fff' },
  titulo: { fontSize: 40, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 20 },
  vedruna: { width: 80, height: 80, marginRight: 8 },
  card: { backgroundColor: '#2c2c2c', paddingBottom: 15, marginVertical: 10, width: '100%' },
  imageContainer: { position: 'relative' },
  cardImage: { width: '100%', height: 400 },
  userInfo: { position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center' },
  profileImage: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    borderWidth: 2, 
    borderColor: '#84dc3f', 
    marginRight: 8 
  },
  userName: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  cardTitle: { fontSize: 25, fontWeight: 'bold', color: '#84dc3f', marginLeft: 20 },
  cardDescription: { fontSize: 16, color: '#fff', marginLeft: 20 },
  cardMeta: { fontSize: 10, color: '#ccc', marginLeft: 20 },
  likeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 10 },
  likeButton: { flexDirection: 'row', alignItems: 'center' },
  likeText: { color: 'white', marginLeft: 8, fontSize: 16 }
});

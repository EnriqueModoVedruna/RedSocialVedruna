import { React, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';  // Importa useNavigation
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import LikeButton from '../componentes/LikeButton';

export function DetailScreen({ route }) {
  const { publicacion, usuario, isLiked, numLikes, tiempoTranscurrido } = route.params;
  const navigation = useNavigation(); // Usa useNavigation para manejar la navegación
  const [isModalVisible, setModalVisible] = useState(false);
  const [comentario, setComentario] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userNombre, setUserNombre] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para el cargado

  const uid = route?.params?.uid;
  const publicacionId = publicacion.id;

  useEffect(() => {
    fetchCurrentUser();
    fetchCurrentName();
    fetchComentarios();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const userId = await AsyncStorage.getItem('user_id');
      if (userId) {
        setCurrentUserId(userId);
      }
    } catch (error) {
      console.error("Error al obtener el usuario logueado:", error);
    }
  };

  const fetchCurrentName = async () => {
    try {
      const nick = await AsyncStorage.getItem('nick');
      if (nick) {
        setUserNombre(nick);
      }
    } catch (error) {
      console.error("Error al obtener el nombre del usuario logueado:", error);
    }
  };

  const fetchComentarios = async () => {
    console.log("Publicación ID:", publicacionId);
    console.log("Usuario ID:", currentUserId);

    try {
      const response = await fetch(`http://192.168.131.73:8080/proyecto01/comentarios/${publicacionId}`);
      if (response.ok) {
        const data = await response.json();
        // Esperamos a que todos los nombres de usuario se obtengan
        const comentariosConNombres = await Promise.all(
          data.map(async (comentario) => {
            const userName = await obtenerNombreUsuario(comentario.user_id);
            return { ...comentario, userName };
          })
        );
        setComentarios(comentariosConNombres);
        setLoading(false); // Cambiar a false cuando se carguen los comentarios
      } else {
        console.error("Error al obtener comentarios");
      }
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
      setLoading(false); // Asegurarse de cambiar a false en caso de error
    }
  };

  const obtenerNombreUsuario = async (userId) => {
    try {
      const response = await fetch(`http://192.168.131.73:8080/proyecto01/usuarios/${userId}`);
      if (!response.ok) return "Usuario desconocido";
      const data = await response.json();
      return data.userName;
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      return "Usuario desconocido";
    }
  };

  // Función que inserta los datos en MongoDB
  const publicarComentario = async () => {
    if (!comentario) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    const comentarioData = {
      idPublicacion: publicacionId,
      comentario: comentario,
      user_id: currentUserId,
    };

    try {
      const response = await fetch('http://192.168.131.73:8080/proyecto01/comentarios/put', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(comentarioData),
      });

      if (!response.ok) {
        const errorResponse = await response.text();
        console.error('Respuesta del servidor:', errorResponse);
        throw new Error('Error al publicar: ' + errorResponse);
      }

      const data = await response.json();
      console.log('Comentario registrado en MongoDB:', data);
      setModalVisible(false); // Cierra el modal
      // Alert.alert('Éxito', 'Tu comentario ha sido creado exitosamente.');
      // navigation.navigate('Home'); // Redirigir a otra pantalla si es necesario
    } catch (error) {
      console.error('Error al registrar el comentario en MongoDB:', error.message);
      Alert.alert('Error', 'No se pudo crear el comentario. Inténtalo de nuevo.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabecera sticky */}
      <View style={styles.stickyHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back-sharp" size={50} color="#84dc3f" />
        </TouchableOpacity>
        <Image source={{ uri: usuario.fotoPerfil }} style={styles.profileImage} />
        <View>
          <Text style={styles.pp}>Publicado por</Text>
          <Text style={styles.userName}>{usuario.nombre}</Text>
        </View>
      </View>

      <Image source={{ uri: publicacion.image_url }} style={styles.image} />

      {/* Mostrar los likes */}
      <View style={styles.likeContainer}>
        <LikeButton publicacion={publicacion} />
      </View>

      <Text style={styles.title}>{publicacion.titulo}</Text>
      <Text style={styles.description}>{publicacion.comentario}</Text>

      {/* Mostrar tiempo transcurrido */}
      <Text style={styles.time}>{tiempoTranscurrido}</Text>

      <Text style={styles.title}>COMENTARIOS</Text>

      {loading ? (
        <Text style={styles.noComments}>Cargando comentarios...</Text> // Muestra mensaje mientras carga
      ) : comentarios.length > 0 ? (
        comentarios.map((c, index) => (
          <View key={index} style={styles.commentContainer}>
            <Image source={{ uri: c.fotoPerfil }} style={styles.profileImage} />
            <View>
            <Text style={styles.commentUser}>{c.userName}</Text>
            <Text style={styles.commentText}>{c.comentario}</Text>
            </View>
            
          </View>
        ))
      ) : (
        <Text style={styles.noComments}>No hay comentarios.</Text>
      )}

      {/* Boton para crear un comentario */}
      <TouchableOpacity 
        style={styles.floatingButton} 
        onPress={() => setModalVisible(true)} // Muestra el modal al presionar el botón
      >
        <Ionicons name="chatbubbles" size={60} color="#84dc3f" />
      </TouchableOpacity>

      {/* Modal para escribir comentario */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Comentario:</Text>
            <TextInput
              style={styles.input}
              placeholder="Máx. 500 Caracteres"
              placeholderTextColor="#ccc"
              textAlignVertical="top"
              value={comentario}
              onChangeText={setComentario}
              multiline
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Publicar" onPress={publicarComentario} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#1e1e1e' },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,  // Asegura que quede encima de otros componentes
    backgroundColor: '#1e1e1e',
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  image: { 
    width: '100%', 
    height: 380, 
    marginBottom: 20, 
    borderBottomWidth: 5, 
    borderBottomColor: 'green' 
  },
  title: { 
    color: '#84dc3f', 
    fontSize: 24, 
    fontWeight: 'bold', 
    paddingBottom: 30 ,
    padding: 20 
  },
  pp: { 
    marginTop: 30,
    color: '#fff', 
    fontSize: 16 ,
  },
  description: { 
    color: '#fff', 
    fontSize: 16 ,
    paddingLeft: 20,
    paddingBottom: 5
  },
  userInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10 ,
    padding: 20 
  },
  backButton: {
    marginRight: 10,
    padding: 10,
    marginTop: 15,
  },
  profileImage: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    borderWidth: 2, 
    borderColor: '#84dc3f', 
    marginRight: 10 ,
    marginTop: 15,
  },
  userName: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' ,
  },
  likes: { 
    color: '#fff', 
    fontSize: 16, 
    paddingLeft: 20,
    paddingBottom: 20 
  },
  time: { 
    color: '#ccc', 
    fontSize: 14, 
    marginTop: 5 ,
    paddingLeft: 20,
    paddingBottom: 20
  },
  likeContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 10, paddingLeft: 20 },
  likeButton: { flexDirection: 'row', alignItems: 'center' },
  likeText: { color: 'white', marginLeft: 8, fontSize: 16 },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#84dc3f', // Borde verde
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#84dc3f',
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 30,
  },
  input: {
    width: '100%',
    height: 270,
    backgroundColor: '#313e45',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 50,
    alignItems: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelar: {
    backgroundColor: 'transparent', // Sin color de fondo
  },
  publicar: {
    backgroundColor: 'transparent', // Sin color de fondo
    borderWidth: 1, // Borde verde
    borderColor: '#84dc3f',
  },
  commentContainer: { padding: 10, flexDirection: 'row',
    alignItems: 'center',},
  commentUser: { color: '#fff', fontWeight: 'bold' },
  commentText: { color: '#ccc' },
  noComments: { color: '#fff', paddingLeft: 20 },
});

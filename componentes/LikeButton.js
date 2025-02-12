import React, { useState, useEffect } from "react";
import { Text, Image, TouchableOpacity, Alert } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const LikeButton = ({ publicacion, currentUserId, onLikeSuccess }) => {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(publicacion.like ? publicacion.like.length : 0);
  const [loading, setLoading] = useState(false);

  // Verificar si el usuario ya ha dado like
  useEffect(() => {
    if (publicacion.like && Array.isArray(publicacion.like)) {
      setLiked(publicacion.like.includes(currentUserId));
    }
  }, [publicacion, currentUserId]);

  // Manejar la acción de Like
  const handleLike = async () => {
    if (loading) return;
  
    if (!currentUserId) {
      console.error("Error: currentUserId es undefined o null");
      Alert.alert("Error", "No se pudo obtener el ID del usuario.");
      return;
    }
  
    console.log("Dando like con ID:", currentUserId, "a publicación:", publicacion.id);
  
    setLoading(true);
  
    try {
      const response = await fetch(`http://192.168.131.73:8080/proyecto01/publicaciones/put/${publicacion.id}/${currentUserId}`, {
        method: "PUT",
      });
  
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
  
      const updatedPost = await response.json();
      setLiked(updatedPost.like.includes(currentUserId));
      setLikesCount(updatedPost.like.length);
  
      if (onLikeSuccess) {
        onLikeSuccess();
      }
    } catch (error) {
      console.error("Error al dar like:", error);
      Alert.alert("Error", "No se pudo actualizar el like.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <TouchableOpacity onPress={handleLike} disabled={loading} style={{ flexDirection: "row", alignItems: "center" }}>
      <Ionicons name={liked ? "heart" : "heart-outline"} size={30} color={liked ? "#84dc3f" : "gray"} />
      <Text style={{ color: "white", marginLeft: 8, fontSize: 16 }}>{likesCount} Me gusta</Text>
    </TouchableOpacity>
  );
};

export default LikeButton;

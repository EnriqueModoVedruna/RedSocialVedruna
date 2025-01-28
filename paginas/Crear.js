import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
const logo = require('../assets/formulario.png');
import { useNavigation } from '@react-navigation/native';

// Importaciones de Firebase
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../utils/firebase';

export function Crear() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nick, setNick] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido1, setApellido1] = useState('');
  const [apellido2, setApellido2] = useState('');
  const navigation = useNavigation();

  // Función para registrar al usuario en Firebase y MongoDB
  const registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Llamada a la función para registrar en MongoDB
      await registrarEnAtlas(user.uid);

      console.log('Usuario registrado en Firebase:', user);
      navigation.navigate('Log');
      Alert.alert('Registro exitoso', 'El usuario fue creado correctamente.');
    } catch (error) {
      console.error('Error al registrar usuario:', error.message);
      Alert.alert('Error', error.message);
    }
  };

  // Función para registrar datos adicionales en MongoDB
  const registrarEnAtlas = async (uid) => {
    const userData = {
      user_id: uid, // UID del usuario generado por Firebase
      nick: nick,
      nombre: nombre,
      apellidos: `${apellido1} ${apellido2}`,
      profile_picture: "", // Valor predeterminado (puede ser modificado más adelante)
    };

    try {
      const response = await fetch("http://192.168.15.73:8080/proyecto01/users", {
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
      console.log("Usuario registrado en MongoDB:", data);
    } catch (error) {
      console.error("Error al registrar en MongoDB:", error.message);
    }
  };

  // Manejar el evento de registro
  const handleRegister = async () => {
    if (!email || !password || !nick || !nombre || !apellido1 || !apellido2) {
      Alert.alert('Error', 'Por favor, complete todos los campos.');
      return;
    }
    await registerUser(email, password);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={logo} style={{ width: 350, height: 350 }} />
      <Text style={styles.titulo}>Completar los siguientes campos:</Text>

      <TextInput
        style={styles.input}
        placeholder="Introduzca su correo"
        keyboardType="email-address"
        placeholderTextColor="#cacbca"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca contraseña"
        secureTextEntry={true}
        placeholderTextColor="#cacbca"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Repita contraseña"
        secureTextEntry={true}
        placeholderTextColor="#cacbca"
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su nick"
        placeholderTextColor="#cacbca"
        value={nick}
        onChangeText={setNick}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su nombre"
        placeholderTextColor="#cacbca"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su primer apellido"
        placeholderTextColor="#cacbca"
        value={apellido1}
        onChangeText={setApellido1}
      />
      <TextInput
        style={styles.input}
        placeholder="Introduzca su segundo apellido"
        placeholderTextColor="#cacbca"
        value={apellido2}
        onChangeText={setApellido2}
      />

      <TouchableOpacity
        onPress={handleRegister}
        style={{
          backgroundColor: '#1e1e1e',
          borderWidth: 3,
          borderColor: '#84dc3f',
          padding: 10,
          borderRadius: 5,
          width: '35%',
        }}
      >
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          FINALIZAR
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#84dc3f',
    marginBottom: 20,
  },
  input: {
    width: '75%',
    height: 40,
    borderColor: '#fff',
    borderBottomWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#1e1e1e',
    color: '#fff',
  },
});

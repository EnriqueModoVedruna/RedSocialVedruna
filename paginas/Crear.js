import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
const logo = require('../assets/formulario.png');
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import {Log} from './Log';

//importaciones de Firebase
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../utils/firebase';
// const auth = getAuth();
const appFirebase = require('../utils/firebase');
import { registerUser } from '../utils/firebase';

export function Crear({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Funciones de Firebase
    //Esta primera funcion es la que se encarga de registrar a el usuario, además si se crea de forma correcta el usuario nos manda a la página de inicio de sesion
    const registerUser = async (email, password) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('Usuario registrado:', user);
        navigation.navigate('Log');
        return user;
      } catch (error) {
        console.error('Error al registrar usuario:', error.message);
        throw error;
      }
    };

    //Este segundo metodo es el que se encarga de recibir el correo y la contraseña
    const handleRegister = async () => {
      try {
        await registerUser(email, password);
        Alert.alert('Registro exitoso', 'El usuario fue creado correctamente.');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    };
  return (
    <View style={styles.container}>
      <Image source={logo} style={{width: 350, height: 350}}/>
      <Text style={styles.titulo}>Completar los siguientes campos:</Text>

      <Text style={styles.label}></Text>
            <TextInput
              style={styles.input}
              placeholder="Introduzca su correo"
              keyboardType="email-address"
              placeholderTextColor="#cacbca"
              value={email}
              onChangeText={setEmail}
            />
      
            <Text style={styles.label}></Text>
            <TextInput
              style={styles.input}
              placeholder="Introduzca contraseña"
              secureTextEntry={true}
              placeholderTextColor="#cacbca"
              value={password}
              onChangeText={setPassword}
            />

            <Text style={styles.label}></Text>
            <TextInput
              style={styles.input}
              placeholder="Repita contraseña"
              secureTextEntry={true}
              placeholderTextColor="#cacbca"
              value={password}
              onChangeText={setPassword}
            />

<Text style={styles.label}></Text>
            <TextInput
              style={styles.input}
              placeholder="Introduzca su nick"
              keyboardType="email-address"
              placeholderTextColor="#cacbca"
              value={email}
              onChangeText={setEmail}
            />

{/* <Text style={styles.label}></Text>
            <TextInput
              style={styles.input}
              placeholder="Introduzca su nombre"
              keyboardType="email-address"
              placeholderTextColor="#cacbca"
              value={email}
              onChangeText={setEmail}
            />

<Text style={styles.label}></Text>
            <TextInput
              style={styles.input}
              placeholder="Introduzca su primer apellido"
              keyboardType="email-address"
              placeholderTextColor="#cacbca"
              value={email}
              onChangeText={setEmail}
            />

<Text style={styles.label}></Text>
            <TextInput
              style={styles.input}
              placeholder="Introduzca su segundo apellido"
              keyboardType="email-address"
              placeholderTextColor="#cacbca"
              value={email}
              onChangeText={setEmail}
            /> */}

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
                  }}
                >
                  <Text style={{fontSize: 16, textAlign: 'center', color: '#fff', fontWeight: 'bold',}}>FINALIZAR</Text>
                </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text:{
    color: '#84dc3f',
    textAlign: 'right',
  },
  titulo:{
    fontSize: 20,
    fontWeight: 'bold',
    color: '#84dc3f',
  },
  label: {
    // fontSize: 18,
    // marginBottom: 5,
    margin: 0,
  },
  input: {
    width: '75%',
    height: 40,
    borderColor: '#fff',
    placeholderTextColor: '#cacbca',
    borderBottomWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    
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
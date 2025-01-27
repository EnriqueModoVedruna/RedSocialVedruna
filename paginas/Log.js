import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert } from 'react-native';
const logo = require('../assets/vedruna.png');
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import {Crear} from './Crear';
import {Home} from './Home';

import appFirebase from '../utils/firebase';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
const auth = getAuth(appFirebase);

export function Log({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Variables de Firebase
  const [user, setUser] = useState(null);
  const login = async() => {
    // login configura que podamos iniciar sesion
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Iniciando sesión','Bienvenido');
      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <Image source={logo} style={{width: 200, height: 200}}/>
      <Text style={styles.titulo}>VEDRUNA EDUCACIÓN</Text>
      <StatusBar style="auto" />

      <Text style={styles.label}></Text>
      <TextInput
        style={styles.input}
        placeholder="Introduzca su correo o nick..."
        keyboardType="email-address"
        placeholderTextColor="#cacbca"
        value={email}
        // onChangeText={setEmail}
        onChangeText={(text)=> setEmail(text)}
      />

      <Text style={styles.label}></Text>
      <TextInput
        style={styles.input}
        placeholder="Introduzca su contraseña..."
        secureTextEntry={true}
        placeholderTextColor="#cacbca"
        value={password}
        // onChangeText={setPassword}
        onChangeText={(text)=> setPassword(text)}

      />
      <Text style={{textAlign: 'right', color: '#84dc3f'}}>¿Olvidaste tu contraseña?</Text>

    <TouchableOpacity
      // onPress={() => navigation.navigate('Home')}
      onPress={login}
      style={{
        backgroundColor: '#84dc3f',
        padding: 10,
        borderRadius: 5,
        width: '75%',
      }}
    >
      <Text style={{fontSize: 16, textAlign: 'center'}}>Log in</Text>
    </TouchableOpacity>

    <Text style={styles.paragraph}>
        ¿No tienes cuenta?{' '}
        <Text
          style={styles.link}
          onPress={() => navigation.navigate('Crear')}
        >
          Crear cuenta
        </Text>
      </Text>
    </View>
  );
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
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
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

import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
const logo = require('../assets/vedruna.png');
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

export function HomeScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>HomeScreen</Text>
    </ScrollView>
  )
  
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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

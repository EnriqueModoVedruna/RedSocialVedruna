import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import 'react-native-gesture-handler';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
const logo = require('./assets/vedruna.png');
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();
import {Log} from './paginas/Log';
import {Crear} from './paginas/Crear';
import {Home} from './paginas/Home';
import {TabNavegation} from './nav/TabNavegation'

export default function App() {
  


    return<NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Log" component={Log} />
        <Stack.Screen name="Crear" component={Crear} />
        <Stack.Screen name="Home" component={TabNavegation} />
      </Stack.Navigator>
    </NavigationContainer> 
    
}

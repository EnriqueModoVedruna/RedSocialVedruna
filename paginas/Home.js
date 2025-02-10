import { StatusBar } from 'react-native';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <Text style={styles.titulo}>Home</Text>
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
  titulo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
});

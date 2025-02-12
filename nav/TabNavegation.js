import React, { useState, useEffect } from "react";
import { View, ActivityIndicator, StatusBar } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; 
import { HomeScreen } from "../paginas/HomeScreen.js";
import { Publicar } from "../paginas/Publicar.js";
import { Incidencias } from "../paginas/Incidencias.js";
import { Cuenta } from "../paginas/Cuenta.js";

export function TabNavegation() {
  const Tab = createBottomTabNavigator();
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true); // Controla la carga de datos

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const storedUserId = await AsyncStorage.getItem("user_Id"); // Recupera el ID
        if (storedUserId) {
          setUid(storedUserId);
        }
      } catch (error) {
        console.error("Error al obtener el user_Id:", error);
      } finally {
        setLoading(false); // Indica que terminó de cargar
      }
    };

    fetchUserId();
  }, []);

  // ⏳ Mientras carga, muestra un ActivityIndicator
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#84dc3f" />
      </View>
    );
  }

  return (
    <>
      <StatusBar hidden={true} />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: { backgroundColor: "#282828" },
          tabBarActiveTintColor: "#84dc3f",
          tabBarInactiveTintColor: "#aaa",
        }}
      >
        <Tab.Screen
          name="Publicaciones"
          component={HomeScreen}
          initialParams={{ uid }} // Pasamos el ID de usuario
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Publicar"
          component={Publicar}
          initialParams={{ uid }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Incidencia"
          component={Incidencias}
          initialParams={{ uid }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Perfil"
          component={Cuenta}
          initialParams={{ uid }}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-circle" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}

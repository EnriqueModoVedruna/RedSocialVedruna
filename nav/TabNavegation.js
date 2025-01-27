import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons"; // Para los íconos de la barra de navegación
import { HomeScreen } from "../paginas/HomeScreen.js";
import { SettingsScreen } from "../paginas/SettingsScreen.js"
import { Publicar } from "../paginas/Publicar.js";

export function TabNavegation() {
  const Tab = createBottomTabNavigator();
  return (
    // crea la barra de navegación inferior
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#282828" },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#aaa",
      }}
    >
      <Tab.Screen
        name="Publicaciones"
        component={HomeScreen}

        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Publicar"
        component={Publicar}

        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Ajustes"
        component={SettingsScreen}

        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
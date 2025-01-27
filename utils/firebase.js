// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';  // Asegúrate de importar AsyncStorage
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD4_ZlQS5vxJzhybZIwRRCD6NDVKfITufE",
    authDomain: "prueba1-faae8.firebaseapp.com",
    projectId: "prueba1-faae8",
    storageBucket: "prueba1-faae8.firebasestorage.app",
    messagingSenderId: "399392895879",
    appId: "1:399392895879:web:b26c9543f6f2411ba71922",
    measurementId: "G-GLDHF0ZHX5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)  // Aquí estamos usando AsyncStorage para persistir el estado de autenticación
  });
  
  export { auth };
// export const auth = getAuth(app);
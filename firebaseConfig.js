// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Importa as funções dos serviços que vamos usar
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFgS3ZQQB7jh5mFQoVUDby5w3V4PNr79k",
  authDomain: "meubancodedados-fb486.firebaseapp.com",
  projectId: "meubancodedados-fb486",
  storageBucket: "meubancodedados-fb486.firebasestorage.app",
  messagingSenderId: "534610517503",
  appId: "1:534610517503:web:c88923048fec0af322dbca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// EXPORTA os serviços "prontos para usar"
// Isso evita o erro de "auth, db não encontrados"
export const auth = getAuth(app);
export const db = getFirestore(app);
// Imports necessários no topo do seu arquivo
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useRouter } from 'expo-router';
// Imports do Firebase (use o caminho relativo correto!)
import { auth } from '@/firebaseConfig'; // <-- '..' significa "subir uma pasta"
import { signInWithEmailAndPassword } from 'firebase/auth';




// Esquema de validação
const schema = yup.object({
email: yup.string().email("E-mail inválido!").required("Informe seu e-mail."),
password: yup.string().min(6, "A senha deve ter no mínimo 6 dígitos.").required("Informe sua senha."),
});



export default function LoginScreen() {
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false); // Para o modal

  
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
  resolver: yupResolver(schema),
  defaultValues: {
    email: '',
    password: '',
  },
});
  

      // Função de Login
    async function handleSignIn(data: any) {
      setIsLoading(true); // Liga o "carregando"

      try {
        // 1. Tentar fazer o login no Authentication
        await signInWithEmailAndPassword(auth, data.email, data.password);

        // 2. Sucesso!
        setIsLoading(false);
        reset()

        // Redireciona para a tela principal do app
        router.replace('/(auth)'); // <-- MUDE '/home' para sua rota principal
      } catch (error: any) {
        // 3. Tratamento de Erros
        setIsLoading(false);
        console.log('Erro no login:', error.code, error.message);
        // 'auth/invalid-credential' é o erro genérico para "usuário não encontrado" ou "senha errada"
        if (error.code === 'auth/invalid-credential' ||
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/wrong-password') {
          Alert.alert('Erro', 'E-mail ou senha inválidos.');
        } else if (error.code === 'auth/invalid-email') {
          Alert.alert('Erro', 'O formato do e-mail é inválido.');
        } else {
          Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login.');
        }
      }
    }

    
  return (
    <View style={style.container}>
      


      {/* E-mail */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={style.input}
                  placeholder="E-mail"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <View style={{ height: 20 }}>
              {errors.email && <Text style={{ color: 'red' }}>{errors.email.message}</Text>}
            </View>
      
            {/* Senha */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  style={style.input}
                  placeholder="Senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <View style={{ height: 20 }}>
              {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}
            </View>


      <TouchableOpacity  onPress={handleSubmit(handleSignIn)} style={style.button}
      >
      {loading ? (
      <ActivityIndicator color="#fff" />
      ) : (
        <Text style={style.buttonText}>Entrar</Text>
      )}
      
      </TouchableOpacity>


    </View >
      
   
  );


}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b0c10",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    color: "#66fcf1",
    fontWeight: "bold",
    marginBottom: 40,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#1f2833",
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "#fff",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#45a29e",
    width: "100%",
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
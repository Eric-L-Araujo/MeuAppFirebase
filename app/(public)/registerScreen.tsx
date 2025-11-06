import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { auth, db } from "@/firebaseConfig";
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';



// Esquema de validação
const schema = yup.object({
  firstname: yup.string().required("Informe seu primeiro nome."),
  email: yup.string().email("E-mail inválido!").required("Informe seu e-mail."),
  password: yup.string().min(6, "A senha deve ter no mínimo 6 dígitos.").required("Informe sua senha."),
});



export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // Para o modal
  const router = useRouter();

  const { control, handleSubmit, formState: { errors }, reset } = useForm({
  resolver: yupResolver(schema)
  })

  // Função de Cadastro
  async function handleSignIn(data: any) {
    setIsLoading(true); // Liga o indicador de "carregando"
    try {

    // 1. Criar o usuário no Authentication (só e-mail e senha)
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const user = userCredential.user;
    // 2. Salvar os dados extras (nome, telefone, etc.) no Firestore
    const userData = {
      uid: user.uid,
      firstname: data.firstname,
      email: data.email.toLowerCase() // Boa prática: salvar e-mail em minúsculas
    };

    // Salva o documento na coleção "users" usando o ID do usuário como nome
    await setDoc(doc(db, "users", user.uid), userData);

    // 3. Sucesso!
    setIsLoading(false); // Desliga o "carregando"
    reset(); // Limpa os campos do formulário
    setShowSuccess(true); // MOSTRA O MODAL DE SUCESSO

      // Redireciona para o login após 3 segundos
    setTimeout(() => {
    setShowSuccess(false);
      router.replace('/(public)/loginScreen'); // Mude '/login' para sua rota de login
    }, 3000);
    } catch (error: any) {
      // 4. Tratamento de Erros
      setIsLoading(false); // Desliga o "carregando"
      console.log('Erro no cadastro:', error.code, error.message);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Erro', 'Este endereço de e-mail já está sendo usado.');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('Erro', 'A senha é muito fraca (mínimo 6 caracteres).');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('Erro', 'O endereço de e-mail é inválido.');
      } else {
        Alert.alert('Erro', 'Ocorreu um erro inesperado ao criar a conta.');
      }
    }
  }

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>

      {/* Nome */}
      <Controller
        control={control}
        name="firstname"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nome"
            autoCapitalize="none"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <View style={{ height: 20 }}>
        {errors.firstname && <Text style={{ color: 'red' }}>{errors.firstname.message}</Text>}
      </View>


      {/* E-mail */}
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
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
            style={styles.input}
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


      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit(handleSignIn)} disabled={loading} // agora sem parâmetro
        >
        {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
         <Text style={styles.buttonText}>Cadastrar</Text>
        )}
      
        

      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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

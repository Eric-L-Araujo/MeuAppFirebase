
import { Link } from "expo-router";
import React from 'react';
import { Text, View } from 'react-native';


export default function SuccessScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Success! Login efetuado.</Text>


        <Link href={'/(public)/loginScreen'}>
        Ir para o login
        </Link>
         <Link href={'/(public)/registerScreen'}>
        Ir para o cadastro
        </Link>
    </View>
  );
}

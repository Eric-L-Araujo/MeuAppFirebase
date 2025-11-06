import Button from '@/components/Button';
import { useSSO } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { Link, useRouter } from "expo-router";
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from "react";
import { Text, View } from "react-native";


WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
 
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { startSSOFlow } = useSSO();

  useEffect(() => {
    WebBrowser.warmUpAsync();
    return () => {
      WebBrowser.coolDownAsync();
    };
  }, []);

  async function onGoogleSignIn() {
    try {
      setIsLoading(true);

      const redirectUrl = Linking.createURL("/"); // volta pro app após login
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace("/(auth)"); // redireciona pra tela logada
      } else {
        console.warn("Sessão não criada ou login cancelado.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Erro no login com Google:", error);
      setIsLoading(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      
      <Link href={'/(public)/loginScreen'}>Ir para o login</Link>
      <Link href={'/(public)/registerScreen'}>Ir para o cadastro</Link>

      <Text>Entrar</Text>
      <Button
        title="Entrar com Google"
        icon="logo-google"
        onPress={onGoogleSignIn}
        isLoading={isLoading}
      />
    </View>
  );
}

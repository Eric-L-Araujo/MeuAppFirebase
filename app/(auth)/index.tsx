import Button from '@/components/Button';
import { useAuth, useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";


export default function NewHome() {

  const {user} = useUser()
  const { signOut } = useAuth()
  return (
    <View style={styles.container}> 

      <Image source={{ uri: user?.imageUrl }} style={styles.image} />
      <Text style={styles.text}>{user?.fullName}</Text>

      <Button icon="exit" title="Sair da conta" onPress={() => signOut()} />
    </View>
  );
}

const styles = StyleSheet.create({
   container: {
   flex: 1,
   justifyContent: "center",
   alignItems: "center",
   },

   image: {
    width: 92,
    height: 92,
    borderRadius: 12,
    margin: 10,

   },

   text: {
      fontSize: 16,
      color: "#000",
      margin: 15,
   },
})

import { styles } from '@/components/Button/styles';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps } from "react-native";


interface ButtonProps extends TouchableOpacityProps {
   title: string,
   isLoading?: boolean,
   // Extraindo a tipagem da biblioteca de icones
   icon: keyof typeof Ionicons.glyphMap
}


export default function Button({title, isLoading = false, icon, ...rest}: ButtonProps){
   return (
      <TouchableOpacity style={styles.container}  disabled={isLoading} activeOpacity={0.8} {...rest}>
      
      { isLoading ? (<ActivityIndicator color={'white'} /> 
      ) : (
         <>
          <Ionicons style={styles.icon} name={icon} /> 
         <Text style={styles.text} >{title}</Text>
         </>
      )}
      </TouchableOpacity>
   );
};
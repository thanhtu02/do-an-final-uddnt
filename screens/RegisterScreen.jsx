import { Alert, Button, Pressable, SafeAreaView, Text, TextInput, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
import axios from 'axios';

const RegisterScreen = () => {
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const navigation = useNavigation()
    const handleNavigateToLogin = () => {
        navigation.navigate("Login")
    }
    const handleRegister = () => {
        const user = {
            name: name,
            email: email,
            password: password
        }
        axios.post('http://localhost:3000/register', user).then((res) => {
            console.log(res)
            Alert.alert("Register successful", "You have been registered successfully")
            setName('')
            setEmail('')
            setPassword('')
        }).catch((err) => {
            Alert.alert("Register failed", "An error occurred during registration")
            console.log('Error ', err)
        })
    }

    return (
        <SafeAreaView className="container px-4 w-full mx-auto">
            <Text className="text-3xl font-bold text-center mt-[160px] mb-10 text-sky-900"> Register Account</Text>
            <View className="flex flex-row items-end gap-2 bg-white mx-8 p-2 pb-4 rounded-[8px] mb-8">
                <MaterialIcons
                    className=""
                    name="people"
                    size={19}
                    color="gray"
                />
                <TextInput
                    value={name}
                    onChangeText={(e) => setName(e)}
                    className="text-base"
                    placeholder="Enter name"
                />
            </View>
            <View className="flex flex-row items-end gap-2 bg-white mx-8 p-2 pb-4 rounded-[8px]  mb-8">
                <MaterialIcons
                    className=""
                    name="email"
                    size={19}
                    color="gray"
                />
                <TextInput
                    value={email}
                    onChangeText={(e) => setEmail(e)}
                    className="text-base"
                    placeholder="Enter email"
                />
            </View>

            <View className="mb-8 flex flex-row items-end gap-2 bg-white mx-8 p-2 pb-4 rounded-[8px]">
                <MaterialIcons
                    className=""
                    name="lock"
                    size={19}
                    color="gray"
                />
                <TextInput
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(e) => setPassword(e)}
                    className="text-base"
                    placeholder="Enter password"
                />
            </View>
            
            <Pressable
                onPress = {handleRegister}
                className="mx-14 bg-sky-900 rounded-[4px] py-4 mt-3">
                <Text className="text-center text-gray-100 font-extrabold text-base">
                    Sign Up</Text>
            </Pressable>
            <View className="mt-4">
                <Pressable
                    onPress={handleNavigateToLogin}>
                    <Text className="text-center text-[13px] text-gray-700 font-medium">You've had an account? Login here.</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}
export default RegisterScreen
import react from "react"
import { Alert, Pressable, SafeAreaView, Text, TextInput, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"

const LoginScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem("authToken")
                if (token) {
                    setTimeout(() => {
                        navigation.replace('Home')
                    }, 400)
                }
            } catch (err) {
                console.log('Error :', err)
            }
        }
        checkLoginStatus()
    }, [])

    const handleNavigateToRegister = () => {
        navigation.navigate("Register")
    }

    const handleLogin = () => {
        const user = {
            email: email,
            password: password
        }
        axios.post('http://localhost:3000/login', user).then((res) => {
            console.log(res)
            console.log(res.data)
            const token = res.data.token
            AsyncStorage.setItem('authToken', token)
            navigation.navigate('Home')
        }).catch((err) => {
            Alert.alert('Login failed')
            console.log('Error :', err)
        })
    }
    return (
        <SafeAreaView className="container px-4 w-full mx-auto">
            <Text className="text-3xl font-bold text-center mt-[180px] mb-10 text-sky-900"> Login to Account</Text>
            <View className="flex flex-row items-end gap-2 bg-white mx-8 p-2 pb-4 rounded-[8px] mb-8">
                <MaterialIcons
                    className=""
                    name="people"
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
            <View className="flex flex-row items-end gap-2 bg-white mx-8 p-2 pb-4 rounded-[8px]">
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
            <View className="mt-2 flex flex-row items-end mx-8 p-2 pb-4 rounded-[8px] mb-8">
                <Pressable
                    onPress={handleNavigateToRegister}>
                    <Text className="text-gray-700 font-medium"> Create new account?</Text>
                </Pressable>
                <Text className="text-blue-400 font-bold ml-auto"> Forgot password</Text>
            </View>
            <Pressable
                onPress={handleLogin}
                className="mx-24 bg-sky-900 rounded-[4px] py-4">
                <Text className="text-center text-gray-100 font-extrabold text-base">Log In</Text>
            </Pressable>
        </SafeAreaView>
    )
}
export default LoginScreen
import { Button, Pressable, SafeAreaView, Text, TextInput, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"

const LoginScreen = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    const handleNavigateToRegister = () => {
        navigation.navigate("Register")
    }
    const handleLogin = () => {

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
                    value={username}
                    onChange={(e)=>setUsername(e.target.value)}
                    className="text-base"
                    placeholder="Enter username"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
            <Pressable className="mx-24 bg-sky-900 rounded-[4px] py-4">
                <Text className="text-center text-gray-100 font-extrabold text-base">Log In</Text>
            </Pressable>
        </SafeAreaView>
    )
}
export default LoginScreen
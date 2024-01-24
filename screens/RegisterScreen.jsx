import { Button, Pressable, SafeAreaView, Text, TextInput, View } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { useState } from "react"
import { useNavigation } from "@react-navigation/native"

const RegisterScreen = () => {
    const [regist_username, setRegistUsername] = useState('')
    const [regist_password, setRegistPassword] = useState('')
    const [regist_email, setRegistEmail] = useState('')
    const navigation = useNavigation()
    const handleNavigateToLogin = () => {
        navigation.navigate("Login")
    }
    const handleLogin = () => {

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
                    value={regist_username}
                    onChange={(e) => setRegistUsername(e.target.value)}
                    className="text-base"
                    placeholder="Enter username"
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
                    value={regist_password}
                    onChange={(e) => setRegistPassword(e.target.value)}
                    className="text-base"
                    placeholder="Enter password"
                />
            </View>
            <View className="flex flex-row items-end gap-2 bg-white mx-8 p-2 pb-4 rounded-[8px]">
                <MaterialIcons
                    className=""
                    name="email"
                    size={19}
                    color="gray"
                />
                <TextInput
                    value={regist_email}
                    onChange={(e) => setRegistEmail(e.target.value)}
                    className="text-base"
                    placeholder="Enter email"
                />
            </View>
            <Pressable className="mx-14 bg-sky-900 rounded-[4px] py-4 mt-10">
                <Text className="text-center text-gray-100 font-extrabold text-base">Sign Up</Text>
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
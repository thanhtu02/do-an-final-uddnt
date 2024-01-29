import React from "react";
import { Button, Image, Keyboard, SafeAreaView, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../store/UserContext";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";

const CreateScreen = () => {
    const { userId, setUserId } = useContext(UserContext)
    const [content, setContent] = useState('')
    const [user, setUser] = useState('')
    const navigation = useNavigation()
    useEffect(() => {
        const getProfileUser = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/profile/${userId}`)
                const { user } = res.data
                setUser(user)
            } catch (err) {
                console.log('Error getting profile :', err)
            }
        }
        getProfileUser()
    },[])
    const handlePost = () => {
        const postData = {
            userId,
        }
        if (content) {
            postData.content = content
        }
        axios.post('http://localhost:3000/create-post', postData).then((res) => {
            setContent('')
        }).catch((err) => {
            console.log('Error creating post :', err)
        })
        Keyboard.dismiss();
    }
    return (
        <SafeAreaView>
            <View className="container w-full px-4 mx-auto">
                <View className="flex flex-row items-center gap-2">
                    <Image
                        className="w-10 h-10 rounded-full"
                        source={{
                            uri: "https://s.net.vn/xAeo"
                        }} />
                    <Text className="text-lg font-medium"> {user?.name} </Text>
                </View>

                <View className="mt-4">
                    <TextInput
                        value={content}
                        onChangeText={(e) => setContent(e)}
                        placeholderTextColor={'#4c4c4c'}
                        placeholder="Type your message..."
                        multiline />
                </View>

                <View className="bg-black w-full mt-4 rounded-[8px] py-1">
                    <Button
                        title="Share"
                        color="white"
                        accessibilityLabel="post"
                        onPress={handlePost}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}
export default CreateScreen

import React from "react";
import { Button, Image, SafeAreaView, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../store/UserContext";
import axios from "axios";

const CreateScreen = () => {
    const { userId, setUserId } = useContext(UserContext)
    const [content, setContent] = useState('')
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
                    <Text> user </Text>
                </View>

                <View className="mt-4">
                    <TextInput
                        value={content}
                        onChangeText={(e) => setContent(e)}
                        placeholderTextColor={'#4c4c4c'}
                        placeholder="Type your message..."
                        multiline />
                </View>

                <Button
                    className=""
                    title="Share"
                    onPress={handlePost}
                />
            </View>
        </SafeAreaView>
    )
}
export default CreateScreen

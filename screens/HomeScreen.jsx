import React from "react";
import { Image, SafeAreaView, ScrollView, Text, View } from "react-native";
import { useEffect, useContext } from 'react'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";
import { UserContext } from "../store/UserContext";
import { useState } from "react";
import axios from "axios";
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

const HomeScreen = () => {
    const { userId, setUserId } = useContext(UserContext);
    const [posts, setPosts] = useState([])
    const [selectedPost, setSelectedPost] = useState('');
    const navigation = useNavigation()
    useEffect(() => {
        const getListUsers = async () => {
            const token = await AsyncStorage.getItem("authToken")
            const parts = token.split('.').map((part) => {
                return Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
            });
            const decodedToken = JSON.parse(parts[1].toString());
            const userId = decodedToken.userId
            setUserId(userId)
        }
        getListUsers()
    }, [])
    const getListPosts = async () => {
        try {
            const res = await axios.get('http://localhost:3000/get-posts')
            setPosts(res.data)
        } catch (err) {
            console.log("Error fetching posts", err)
        }
    }
    useEffect(() => {
        getListPosts()
    }, [])
    useFocusEffect(useCallback(() => {
        getListPosts()
    }, [])
    )

    const handleLike = async (postId) => {
        try {
            const res = await axios.put(`http://localhost:3000/post/${postId}/${userId}/like`)
            const updatedPost = res.data
            const updatedPosts = posts?.map((e) =>
                e?._id === updatedPost._id ? updatedPost : e)
            setPosts(updatedPosts)
        } catch (err) {
            console.log('Error liking the post', err)
        }
    }

    const handleUnLike = async (postId) => {
        try {
            const res = await axios.put(`http://localhost:3000/post/${postId}/${userId}/unlike`)
            const updatedPost = res.data
            const updatedPosts = posts?.map((e) =>
                e?._id === updatedPost._id ? updatedPost : e)
            setPosts(updatedPosts)
        } catch (err) {
            console.log('Error unliking the post', err)
        }
    }

    const handleReply = (postId, content, user_created, handleCloseDetailReply) => {
        navigation.navigate("DetailReply", { postId, content, userId, user_created, handleCloseDetailReply });
        setSelectedPost({ postId });
    };

    const handleCloseDetailReply = () => {
        setSelectedPost('');
        getListPosts();
    };

    // CONSOLE HERE
    console.log('userid: ', userId)
    return (
        <ScrollView className="container w-full mx-auto mt-[50px] mb-2 ">
            <View className="flex flex-row justify-center items-center">
                <Image
                    style={{
                        resizeMode: "contain"
                    }}
                    className="w-[90px] h-[60px]"
                    source={{
                        uri: "https://s.net.vn/LT4L"
                    }} />
            </View>

            <View className="mt-2 border border-[#D0D0D0] h-screen pt-8 mb-[400px] pb-2" >
                {posts.map((e, index) => {
                    return (
                        <View key={index}
                            className="">
                            <View className="flex flex-row items-center gap-2 px-4">
                                <Image
                                    className="w-10 h-10 rounded-full"
                                    source={{
                                        uri: "https://s.net.vn/xAeo"
                                    }} />
                                <Text className="text-base font-medium "> {e?.user?.name}</Text>
                            </View>

                            <View className="my-6 px-4">
                                <Text className="text-base font-normal"> {e?.content}</Text>
                            </View>

                            <View className="flex flex-row items-center gap-4 px-4">
                                <Text className="">
                                    {e?.likes?.length} {e?.likes?.length === 0 ? 'like' : 'likes'}
                                </Text>
                                <Text className="">
                                    {e?.replies?.length} {e?.replies?.length === 0 ? 'reply' : 'replies'}
                                </Text>
                            </View>

                            <View className="flex flex-row justify-between items-center gap-2 border border-gray-200 my-2 pb-2 px-4">
                                {e?.likes?.includes(userId) ? (
                                    <AntDesign
                                        onPress={() => handleUnLike(e?._id)}
                                        name="like1"
                                        size={24}
                                        color="#0a56d2" />
                                ) : (
                                    <AntDesign
                                        onPress={() => handleLike(e?._id)}
                                        name="like2"
                                        size={24}
                                        color="#323232" />
                                )}
                                <FontAwesome
                                    onPress={() => handleReply(e?._id, e?.content, e?.user)}
                                    name="comment-o"
                                    size={24}
                                    color="#323232" />
                                <Fontisto
                                    name="share-a"
                                    size={20}
                                    color="#323232" />
                            </View>

                            <View className="bg-gray-300 w-full h-[7px] mb-8"
                            />
                        </View>
                    )
                })}
            </View>
        </ScrollView>
    )
}
export default HomeScreen

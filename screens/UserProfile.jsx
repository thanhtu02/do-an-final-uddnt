import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../store/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons";
import moment from "moment/moment";

const UserProfileScreen = ({ route }) => {
    const navigation = useNavigation()
    const { userId, setUserId } = useContext(UserContext);
    const [user, setUser] = useState([])
    const { user_created } = route.params
    const [posts, setPosts] = useState([])
    useEffect(() => {
        const getProfileUser = async () => {
            try {
                const res = await axios.get(`http://localhost:3000/profile/${user_created._id}`)
                const { user } = res.data
                setUser(user)
            } catch (err) {
                console.log('Error getting profile :', err)
            }
        }
        getProfileUser()
    }, [])
    useEffect(() => {
        const getAllPosts = async () => {
            try {
                const res = await axios.get('http://localhost:3000/get-posts')
                setPosts(res.data)
            } catch (err) {
                console.log('Error getting posts of user :', err)
            }
        }
        getAllPosts()
    }, [])

    const handleMessage = () => {

    }
    const handleWayBack = () => {
        navigation.goBack();
    }

    const postofUser = posts.filter((e) => e?.user?._id === user_created?._id)

    // CONSOLE HERE
    console.log(postofUser)

    return (
        <View className="container px-4 w-full mx-auto mt-[50px]">
            <View>
                <Ionicons
                    onPress={handleWayBack}
                    name="caret-back-circle-outline"
                    size={36}
                    color="#252525" />
            </View>
            <View>
                <Text className="text-2xl font-medium"> {user_created?.name}</Text>
                <Image
                    className="w-20 h-20 rounded-full my-4"
                    source={{
                        uri: "https://s.net.vn/xAeo"
                    }} />
                <Text className="text-sm text-gray-500 ml-1"> {user?.followers?.length} {user?.followers?.length === 0 ? 'follower' : 'followers'}
                </Text>

                <View className="flex flex-row  gap-1 justify-center items-center mt-2">
                    {user?.followers && user?.followers.includes(userId) && (
                        <View className="flex-2 flex-row gap-4 justify-center items-center">
                            <Pressable
                                className=" flex-1 flex-row justify-center border border-gray-300 rounded-[8px] py-3 px-4">
                                <Text> Unfollow </Text>
                            </Pressable>
                            <Pressable
                                onPress={handleMessage}
                                className=" flex-1 flex-row justify-center border border-gray-300 rounded-[8px] py-3 px-4">
                                <Text> Message </Text>
                            </Pressable>
                        </View>
                    )
                    }
                    {user?.followers && !user?.followers.includes(userId) && (
                        <View className="flex-2 flex-row gap-2 justify-center items-center">
                            <Pressable
                                className=" flex-1 flex-row justify-center border border-gray-300 rounded-[8px] py-3 px-4">
                                <Text> Follow </Text>
                            </Pressable>
                            <Pressable
                                onPress={handleMessage}
                                className=" flex-1 flex-row justify-center border border-gray-300 rounded-[8px] py-3 px-4">
                                <Text> Message </Text>
                            </Pressable>
                        </View>
                    )}

                </View>

                <View className="bg-gray-300 w-full h-[1px] mt-4" />
                <View>
                    {postofUser.map((e) => {
                        return (
                            <View className="my-5">

                                <View className="flex flex-row items-center gap-4">
                                    <View className="flex flex-row items-center">
                                        <Image
                                            className="w-10 h-10 rounded-full"
                                            source={{
                                                uri: "https://s.net.vn/xAeo"
                                            }} />
                                    </View>
                                    <View className="flex flex-col">
                                        <Text className="text-base font-medium ">{e?.user?.name}</Text>
                                        <Text className="text-xs ml-1">{moment(e?.createdAt).format('DD-MM-YYYY')} </Text>
                                    </View>
                                </View>
                                <Text className="text-gray-800 mt-2 text-sm ">{e?.content}</Text>
                            </View>
                        )
                    })}
                </View>
            </View>
        </View>
    )
}
export default UserProfileScreen
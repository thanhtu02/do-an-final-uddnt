import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../store/UserContext";

const ProfileScreen = () => {
    const [user, setUser] = useState('')
    const { userId, setUserId } = useContext(UserContext)
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
    })
    return (
        <View className="container px-4 w-full mx-auto mt-[50px]">
            <View>
                <Text className="text-2xl font-medium"> {user?.name} </Text>
                <Image
                    className="w-20 h-20 rounded-full my-4"
                    source={{
                        uri: "https://s.net.vn/xAeo"
                    }} />
                <Text className="text-sm text-gray-500 ml-1"> {user?.followers?.length} {user?.followers?.length === 0 ? 'follower' : 'followers'}
                </Text>

                <View className="flex flex-row gap-4 justify-center items-center mt-4">
                    <Pressable
                        className="flex-1 flex-row border border-gray-300 rounded-[8px] py-3 px-4">
                        <Text> Edit Profile </Text>
                    </Pressable>
                    <Pressable className="flex-1 flex-row border border-gray-300 rounded-[8px] py-3 px-4">
                        <Text> Logout </Text>
                    </Pressable>
                </View>

            </View>
        </View>
    )
}
export default ProfileScreen
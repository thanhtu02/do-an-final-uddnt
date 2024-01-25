import React from "react";
import { View, Text, Image, Pressable } from 'react-native'
import { useContext } from "react";
import { UserContext } from "../store/UserContext";
import { useState } from "react";


const User = ({ item }) => {
    const { userId, setUserId } = useContext(UserContext);
    const [requestSent, setRequestSent] = useState(false)
    const sendFollow = async (currentUserId, selectedUserId) => {
        try {
            const res = await fetch('http://localhost:3000/follow', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ currentUserId, selectedUserId })
            })
            if (res.ok) {
                setRequestSent(true)
            }
        } catch (err) {
            console.log('Error :', err)
        }
    }
    const handleUnfollow = async (targetId) => {
        try {
            const res = await fetch('http://localhost:3000/users/unfollow', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    loggedInUserId: userId,
                    targetUserId: targetId
                })
            })
            if (res.ok) {
                setRequestSent(false)
                console.log('Unfollow successfully')
            }
        } catch (err) {
            console.log('Error :', err)
        }
    }
    // CONSOLE HERE
    console.log(userId)
    return (
        <View>
            <View className="flex flex-row items-center gap-3">
                <Image
                    className="w-10 h-10 rounded-full"
                    source={{
                        uri: "https://s.net.vn/xAeo"
                    }} />
                <Text className="text-lg text-gray-900 mr-auto font-medium">{item?.name}</Text>

                {requestSent || item?.followers?.includes(userId) ? (
                    <Pressable
                        onPress={() => handleUnfollow(item?._id)}
                        className="bg-gray-400 border border-gray-300 rounded-[8px] py-2 px-6">
                        <Text className="text-center text-base text-white font-extrabold"> Following </Text>
                    </Pressable>
                ) : (
                    <Pressable
                        onPress={() => sendFollow(userId, item._id)}
                        className=" bg-[#0f5fff] rounded-[8px] py-2 px-6">
                        <Text className="text-center text-base text-white font-extrabold"> Follow </Text>
                    </Pressable>
                )
                }
            </View>
        </View>
    )
}

export default User
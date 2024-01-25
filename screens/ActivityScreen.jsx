import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios";
import { UserContext } from "../store/UserContext";
import { Buffer } from "buffer"
import User from "../components/User";

const ActivityScreen = () => {
    const [selected, setSelected] = useState('all')
    const [content, setContent] = useState('All content')
    const [users, setUsers] = useState([])
    const { userId, setUserId } = useContext(UserContext);
    const handleSelectButton = (selectedButton) => {
        setSelected(selectedButton)
    }
    useEffect(() => {
        const getListUsers = async () => {
            const token = await AsyncStorage.getItem("authToken")
            const parts = token.split('.').map((part) => {
                return Buffer.from(part.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
            });
            const decodedToken = JSON.parse(parts[1].toString());
            const userId = decodedToken.userId
            setUserId(userId)
            axios.get(`http://localhost:3000/user/${userId}`)
                .then((res) => {
                    setUsers(res.data)
                }).catch((err) => {
                    console.log("Error :", err)
                })
        }
        getListUsers()
    }, [])
    // CONSOLE HERE
    console.log('users:', users)
    return (
        <ScrollView className="container px-4 w-full mx-auto mt-[50px]">
            <Text className="font-bold text-2xl mb-4">Activity</Text>
            <View className="">
                <View className="flex-1 flex-row gap-4 justify-center items-center">
                    <TouchableOpacity
                        onPress={() => handleSelectButton('all')}
                        className="flex-1 flex-row justify-center items-center bg-white rounded-lg py-3 border border-gray-200"
                        style={[
                            selected === 'all' ? { backgroundColor: 'black' } : null
                        ]}>
                        <Text className="text-center font-bold text-lg "
                            style={[
                                selected === 'all' ? { color: 'white' } : { color: 'black' }
                            ]}> All </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleSelectButton('people')}
                        className="flex-1 flex-row justify-center items-center bg-white rounded-lg py-3 border border-gray-200"
                        style={[
                            selected === 'people' ? { backgroundColor: 'black' } : null
                        ]}>
                        <Text className="text-center font-bold text-lg"
                            style={[
                                selected === 'people' ? { color: 'white' } : { color: 'black' }
                            ]}> People </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleSelectButton('requests')}
                        className="flex-1 flex-row justify-center items-center bg-white rounded-lg py-3 border border-gray-200"
                        style={[
                            selected === 'requests' ? { backgroundColor: 'black' } : null
                        ]}>
                        <Text className="text-center font-bold text-lg"
                            style={[
                                selected === 'requests' ? { color: 'white' } : { color: 'black' }
                            ]}> Requests </Text>
                    </TouchableOpacity>
                </View>

                <View className="mt-6">
                    {selected === 'people' && (
                        <View>
                            {users?.map((item, index) => {
                                return (
                                    <User
                                        key={index}
                                        item={item} />
                                )
                            })}
                        </View>
                    )}
                </View>
            </View>
        </ScrollView>
    )
}
export default ActivityScreen 

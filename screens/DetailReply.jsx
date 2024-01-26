
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DetailReply = ({ route }) => {
    const { postId, content, userId, user_created } = route.params;
    const [replies, setReplies] = useState([]);
    const [reply, setReply] = useState('');
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);
    const handleSubmitReply = () => {
        if (!userId) {
            console.log('Invalid userId:', userId);
            return;
        }
        const replyData = {
            userId: userId,
        };
        if (reply) {
            replyData.reply = reply;
        }
        axios.post(`http://localhost:3000/post/${postId}/${userId}/create-reply`, replyData)
            .then((res) => {
                setReply('');
                fetchReplies();
            })
            .catch((err) => {
                console.log('Error creating reply:', err);
            });
    };
    const fetchReplies = () => {
        axios.get(`http://localhost:3000/post/${postId}/replies`)
            .then((res) => {
                setReplies(res.data);
            })
            .catch((err) => {
                console.log('Error fetching replies:', err);
            });
    };
    useEffect(() => {
        fetchReplies();
    }, []);

    const handleWayBack = () => {
        navigation.goBack();
    };

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/get-users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const getUsername = () => {
        const user = users.find((user) => user._id === userId);
        return user?.name || 'Unknown User'; 
    };
    const username = getUsername();

    // CONSOLE HERE
    console.log(username)
    return (
        <ScrollView className="">
            <View className="container px-4 w-full mx-auto border border-[#D0D0D0] pt-[50px] pb-2">
                <Ionicons
                    onPress={handleWayBack}
                    name="caret-back-circle-outline"
                    size={36}
                    color="#252525" />
            </View>
            <View className="container px-4 mx-auto w-full mt-4">
                <View className="flex flex-row items-center gap-2 px-4">
                    <Image
                        className="w-10 h-10 rounded-full"
                        source={{
                            uri: "https://s.net.vn/xAeo"
                        }} />
                    <Text className="text-base font-medium ">{user_created?.name}</Text>
                </View>
                <View className="my-6 px-4">
                    <Text className="text-base font-normal">{content}</Text>
                </View>

                <TextInput
                    className="px-2 py-4"
                    placeholder="Enter your reply..."
                    placeholderTextColor="#4b4b4b"
                    value={reply}
                    onChangeText={(e) => setReply(e)}
                />

                <TouchableOpacity
                    onPress={handleSubmitReply}
                    className="bg-[#0a56d2] py-3 rounded-lg"
                >
                    <Text className="text-white font-bold text-center">Reply</Text>
                </TouchableOpacity>

                <View className="mt-6">
                    <Text className="mb-1 text-sm font-light"> All replies </Text>
                    {replies.map((e) => (
                        <View key={e._id}>
                            <View className="flex flex-row items-center gap-2 px-0">
                                <View className="flex flex-row items-center gap-2">
                                    <Image
                                        className="w-8 h-8 rounded-full"
                                        source={{
                                            uri: "https://s.net.vn/xAeo"
                                        }} />
                                    <Text className="text-base font-medium ">{username}</Text>
                                </View>
                                <Text className="text-sm pt-[7px]">{e?.content}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

export default DetailReply
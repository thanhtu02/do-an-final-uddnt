
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useState } from 'react';
import axios from 'axios';

const DetailReply = ({ route }) => {
    const { postId, content, userId } = route.params;
    const [replies, setReplies] = useState([]);
    const [reply, setReply] = useState('');
    const handleSubmitReply = () => {
        if (!userId || !userId._id) {
            console.log('Invalid userId:', userId);
            return;
        }
        const replyData = {
            userId: userId._id,
        };
        if (reply) {
            replyData.reply = reply;
        }
        axios.post(`http://localhost:3000/post/${postId}/${userId._id}/create-reply`, replyData)
            .then((res) => {
                setReply('');
                // After successfully creating a reply, fetch and update the replies
                fetchReplies();
            })
            .catch((err) => {
                console.log('Error creating reply:', err);
            });
    };
    const fetchReplies = () => {
        // Fetch replies from the server
        axios.get(`http://localhost:3000/post/${postId}/replies`)
            .then((res) => {
                setReplies(res.data);
            })
            .catch((err) => {
                console.log('Error fetching replies:', err);
            });
    };
    useEffect(() => {
        // Fetch replies when the component mounts
        fetchReplies();
    }, []);
    console.log(route.params)
    return (
        <ScrollView className="mt-[50px]">
            <View className="container px-4 mx-auto w-full">
                <View className="flex flex-row items-center gap-2 px-4">
                    <Image
                        className="w-10 h-10 rounded-full"
                        source={{
                            uri: "https://s.net.vn/xAeo"
                        }} />
                    <Text className="text-base font-medium ">{userId?.name}</Text>
                </View>
                <View className="my-6 px-4">
                    <Text className="text-base font-normal">{content}</Text>
                </View>

                {/* Input field for reply */}
                <TextInput
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 10, marginBottom: 10 }}
                    placeholder="Enter your reply..."
                    value={reply}
                    onChangeText={(e) => setReply(e)}
                />

                {/* Button to submit reply */}
                <TouchableOpacity
                    onPress={handleSubmitReply} 
                    className="bg-[#0a56d2] py-3 rounded-lg"
                >
                    <Text className="text-white font-bold text-center">Reply</Text>
                </TouchableOpacity>

                <View className="mt-4">
                    <Text> Replies </Text>
                    {replies.map((e) => (
                        <View key={e._id}>
                            <Text>{e?.content}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

export default DetailReply
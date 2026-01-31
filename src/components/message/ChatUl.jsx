import React, { useState, useEffect, useRef, useCallback } from 'react';
import socket from '../../utils/SocketIO';
import api from '../../utils/api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Search, MoreHorizontal, Send } from 'lucide-react';
import { toast } from 'react-toastify';

function ChatUI() {
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const userId = localStorage.getItem('userId');
    const { messageUserId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }

        const fetchCurrentUser = async () => {
            try {
                const response = await api.get(`/api/auth/get-user/${userId}`);
                setCurrentUser(response.data);
            } catch {
                toast.error('Failed to load user data.');
            }
        };
        fetchCurrentUser();
    }, [userId, navigate]);

    useEffect(() => {
        if (!currentUser) return;

        const fetchConversations = async () => {
            try {
                const response = await api.get(`/api/messages/${currentUser._id}`);
                setConversations(response.data);

                if (messageUserId) {
                    const directMessageUser = response.data.find(conv => conv._id === messageUserId);
                    if (directMessageUser) {
                        setSelectedConversation(directMessageUser);
                    } else {
                        const userResponse = await api.get(`api/auth/get-user/${messageUserId}`);
                        setSelectedConversation(userResponse.data);
                    }
                }
            } catch {
                toast.error('Failed to load conversations.');
            }
        };
        fetchConversations();
    }, [currentUser, messageUserId]);

    useEffect(() => {
        if (!currentUser) return;

        socket.connect();
        socket.emit('joinRoom', currentUser._id);

        const handleReceiveMessage = (message) => {
            setMessages(prev =>
                selectedConversation &&
                ((message.sender === currentUser._id && message.receiver === selectedConversation._id) ||
                    (message.sender === selectedConversation._id && message.receiver === currentUser._id))
                    ? [...prev, message]
                    : prev
            );
        };

        socket.on('receiveMessage', handleReceiveMessage);
        socket.on('messageError', toast.error);

        return () => {
            socket.off('receiveMessage', handleReceiveMessage);
            socket.off('messageError');
            socket.disconnect();
        };
    }, [currentUser, selectedConversation]);

    useEffect(() => {
        const fetchHistory = async () => {
            if (!currentUser || !selectedConversation) {
                setMessages([]);
                return;
            }
            try {
                const response = await api.get(`/api/messages/${currentUser._id}/${selectedConversation._id}`);
                setMessages(response.data);
            } catch {
                toast.error('Failed to load message history.');
            }
        };
        fetchHistory();
    }, [selectedConversation, currentUser]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = useCallback((e) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation || !currentUser) return;

        const messageData = {
            senderId: currentUser._id,
            receiverId: selectedConversation._id,
            content: newMessage.trim(),
        };

        socket.emit('sendMessage', messageData);
        setMessages(prev => [
            ...prev,
            {
                sender: currentUser._id,
                receiver: selectedConversation._id,
                content: newMessage.trim(),
                timestamp: new Date().toISOString(),
            },
        ]);
        setNewMessage('');

        if (messageUserId) navigate('/user/messages');
    }, [newMessage, selectedConversation, currentUser, navigate, messageUserId]);

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100 dark:bg-gray-900 font-sans">
            <div className={`w-full md:w-1/3 lg:w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-lg ${selectedConversation ? 'hidden md:flex' : 'flex'} h-full`}>
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-4">Messaging</h2>
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search messages"
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.length === 0 ? (
                        <p className="p-4 text-gray-500 dark:text-gray-400 text-center">No conversations found.</p>
                    ) : (
                        conversations.map(conv => (
                            <div
                                key={conv._id}
                                onClick={() => setSelectedConversation(conv)}
                                className={`flex items-center p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedConversation?._id === conv._id ? 'bg-blue-50 dark:bg-gray-700 border-l-4 border-blue-600' : ''}`}
                            >
                                <img
                                    src={conv.profilePicture || 'https://placehold.co/48x48/CCCCCC/666666?text=User'}
                                    className="h-12 w-12 rounded-full object-cover"
                                    alt=""
                                />
                                <div className="ml-3">
                                    <span className="font-semibold text-gray-900 dark:text-gray-100">{conv.username}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div className={`flex-1 flex flex-col bg-white dark:bg-gray-800 shadow-lg ${selectedConversation ? 'flex' : 'hidden md:flex'}`}>
                {selectedConversation ? (
                    <>
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex items-center">
                                <button onClick={() => setSelectedConversation(null)} className="md:hidden mr-3 text-gray-600 dark:text-gray-300">&larr;</button>
                                <img
                                    src={selectedConversation.profilePicture || 'https://placehold.co/40x40/CCCCCC/666666?text=User'}
                                    className="h-10 w-10 rounded-full object-cover"
                                    alt=""
                                />
                                <Link to={`/servicer-profile/${selectedConversation._id}`} className="ml-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                    {selectedConversation.username}
                                </Link>
                            </div>
                            <MoreHorizontal className="text-gray-600 dark:text-gray-300" />
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50 dark:bg-gray-900">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.sender === currentUser._id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs px-4 py-2 rounded-lg shadow ${msg.sender === currentUser._id ? 'bg-blue-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-100'}`}>
                                        <p>{msg.content}</p>
                                        <sub className="block text-xs mt-1 opacity-75 text-right">
                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </sub>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center space-x-3">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                                placeholder="Write a message..."
                                className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-gray-400"
                            >
                                <Send size={20} />
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="flex flex-1 items-center justify-center text-gray-500 dark:text-gray-400 text-lg">
                        Select a conversation to start chatting.
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatUI;

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import api from "../../utils/api";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

const AgriSathiBot = () => {
    const userId = localStorage.getItem('userId')
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        {
            text: "Namaste! 🌾 I am Agri Sathi. Ask me anything about farming.",
            sender: "bot",
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [listening, setListening] = useState(false);

    const recognitionRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return;

        const recognition = new SpeechRecognition();
        recognition.lang = "en-IN";

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            handleSend(transcript);
        };

        recognitionRef.current = recognition;
    }, []);

    const startListening = () => {
        recognitionRef.current?.start();
    };

    const handleSend = async (queryText) => {
        const textToSend = queryText || input;
        if (!textToSend.trim()) return;

        setMessages((prev) => [...prev, { text: textToSend, sender: "user" }]);
        setInput("");
        setLoading(true);

        try {
            const response = await api.post("/api/chat-bot/query", {
                message: textToSend,
                userId
            });

            setMessages((prev) => [
                ...prev,
                { text: response.data.reply, sender: "bot" },
            ]);
        } catch {
            setMessages((prev) => [
                ...prev,
                { text: "⚠️ Server error. Try again.", sender: "bot" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-[460px] h-[550px] flex flex-col rounded-2xl shadow-md bg-white dark:bg-gray-800"
        >
            <div className="bg-green-600 p-4 text-white text-center font-semibold">
                🌾 Agri Sathi AI Bot
            </div>

            <ChatMessages
                messages={messages}
                loading={loading}
                scrollRef={scrollRef}
            />

            <ChatInput
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                startListening={startListening}
                listening={listening}
            />
        </motion.div>
    );
};

export default AgriSathiBot;
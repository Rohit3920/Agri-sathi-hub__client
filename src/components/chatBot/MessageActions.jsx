import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Volume2, VolumeX, ThumbsUp } from "lucide-react";

const MessageActions = ({ text }) => {
    const [liked, setLiked] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, []);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
    };

    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            return;
        }

        window.speechSynthesis.cancel();

        // ✅ 1. Remove special symbols 
        // ✅ 2. Filter to keep ONLY English letters and numbers (removes Hindi, Marathi, etc.)
        const cleanText = text
            .replace(/[*#_~`>\-]/g, "") // Remove symbols
            .replace(/[^\x00-\x7F]+/g, "") // Remove Non-ASCII (Hindi/Regional scripts)
            .replace(/\s+/g, " ") // Clean extra spaces
            .trim();

        // If after cleaning there is no English text, don't speak
        if (!cleanText) return;

        const speech = new SpeechSynthesisUtterance(cleanText);
        
        // ✅ Force English Voice
        speech.lang = "en-US"; 
        
        // Find a specific English voice available on the browser
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith("en"));
        if (englishVoice) {
            speech.voice = englishVoice;
        }

        speech.onstart = () => setIsSpeaking(true);
        speech.onend = () => setIsSpeaking(false);
        speech.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(speech);
    };

    return (
        <div className="flex items-center gap-3 mt-2 opacity-70 hover:opacity-100 transition">
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleCopy}>
                <Copy size={16} />
            </motion.button>

            <motion.button 
                whileTap={{ scale: 0.9 }} 
                onClick={handleSpeak}
                className={isSpeaking ? "text-green-600" : ""}
            >
                {isSpeaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </motion.button>

            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setLiked(!liked)}
                className={liked ? "text-green-600" : ""}
            >
                <ThumbsUp size={16} fill={liked ? "currentColor" : "none"} />
            </motion.button>
        </div>
    );
};

export default MessageActions;
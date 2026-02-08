import React, { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Volume2, ThumbsUp } from "lucide-react";

const MessageActions = ({ text }) => {
    const [liked, setLiked] = useState(false);

    // ✅ Copy Text
    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
    };

    // ✅ Text To Speech
    const handleSpeak = () => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-IN";
        window.speechSynthesis.speak(speech);
    };

    return (
        <div className="flex items-center gap-3 mt-2 opacity-70 hover:opacity-100 transition">
            {/* Copy */}
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleCopy}>
                <Copy size={16} />
            </motion.button>

            {/* Speak */}
            <motion.button whileTap={{ scale: 0.9 }} onClick={handleSpeak}>
                <Volume2 size={16} />
            </motion.button>

            {/* Like */}
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
import React from "react";
import { motion } from "framer-motion";
import MessageActions from "./MessageActions";

const ChatMessageBubble = ({ msg }) => {
    const formatMessage = (text) => {
        const formattedText = text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
        return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: msg.sender === "user" ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
        >
            <div
                className={`max-w-[75%] px-4 py-2 rounded-xl text-sm shadow-sm ${msg.sender === "user"
                        ? "bg-green-600 text-white"
                        : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    }`}
            >
                {formatMessage(msg.text)}

                {/* ✅ Only show actions for BOT messages */}
                {msg.sender === "bot" && <MessageActions text={msg.text} />}
            </div>
        </motion.div>
    );
};

export default ChatMessageBubble;
import React from "react";
import { AnimatePresence } from "framer-motion";
import ChatMessageBubble from "./ChatMessageBubble";

const ChatMessages = ({ messages, loading, scrollRef }) => {
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-900">
            <AnimatePresence>
                {messages.map((msg, i) => (
                    <ChatMessageBubble key={i} msg={msg} />
                ))}
            </AnimatePresence>

            {loading && (
                <div className="text-xs text-gray-500 dark:text-gray-400 italic">
                    🌱 Thinking...
                </div>
            )}

            <div ref={scrollRef} />
        </div>
    );
};

export default ChatMessages;
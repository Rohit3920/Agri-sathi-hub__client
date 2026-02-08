import React from "react";
import { motion } from "framer-motion";
import { Mic, Send } from "lucide-react";

const ChatInput = ({
    input,
    setInput,
    handleSend,
    startListening,
    listening,
}) => {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleSend();
            }}
            className="p-3 flex gap-2 items-center bg-white dark:bg-gray-800"
        >
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask something..."
                className="flex-1 px-3 py-2 rounded-lg outline-none bg-gray-100 dark:bg-gray-700"
            />

            <motion.button
                type="button"
                onClick={startListening}
                animate={
                    listening
                        ? { scale: [1, 1.2, 1], backgroundColor: "#ef4444" }
                        : { scale: 1 }
                }
                transition={{ repeat: listening ? Infinity : 0, duration: 1 }}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600"
            >
                <Mic size={18} />
            </motion.button>

            <motion.button
                whileTap={{ scale: 0.9 }}
                type="submit"
                className="p-2 bg-green-600 text-white rounded-lg"
            >
                <Send size={18} />
            </motion.button>
        </form>
    );
};

export default ChatInput;
import React from "react";
import { motion } from "framer-motion";

const words = [
    { text: ".", color: "text-green-600 dark:text-green-400 opacity-70" },
    { text: ".", color: "text-purple-300 dark:text-purple-200 opacity-70" },
    { text: ".", color: "text-red-600 dark:text-red-400 opacity-70" },
    { text: "Agri", color: "text-green-600 dark:text-green-400" },
    { text: "Sathi", color: "text-purple-300 dark:text-purple-200" },
    { text: "Hub", color: "text-red-600 dark:text-red-400" },
    { text: ".", color: "text-green-600 dark:text-green-400 opacity-70" },
    { text: ".", color: "text-purple-300 dark:text-purple-200 opacity-70" },
    { text: ".", color: "text-red-600 dark:text-red-400 opacity-70" },
];

const AgriLoader = ({ contentHeader = "Agri Sathi Hub bro" }) => {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center
    bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden transition-colors duration-500 opacity-50">

            {/* Blinking Logo */}
            <motion.img
                src="/mainLogo.png"
                alt="Agri Sathi Hub Logo"
                className="w-32 md:w-44 mb-6 object-contain"
                animate={{
                    opacity: [1, 0.4, 1],
                    scale: [1, 1.05, 1],
                }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            {/* Animated Text */}
            <motion.div
                className="flex gap-3 text-2xl md:text-3xl font-bold"
                animate={{
                    x: [300, 0, 0, -300],
                }}
                transition={{
                    duration: 4,
                    times: [0, 0.3, 0.7, 1],
                    ease: "easeInOut",
                    repeat: Infinity,
                }}
            >
                {words.map((word, index) => (
                    <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 1, 0] }}
                        transition={{
                            duration: 4,
                            delay: index * 0.4,
                            repeat: Infinity,
                        }}
                        className={`tracking-wide ${word.color}`}
                    >
                        {word.text}
                    </motion.span>
                ))}
            </motion.div>

            <motion.div
                className="mt-4 text-gray-600 text-sm dark:text-gray-300 italic"
            >
                Loading {contentHeader}...
            </motion.div>
        </div>
    );
};

export default AgriLoader;

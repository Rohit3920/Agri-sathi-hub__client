import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const aboutData = {
  "Who We Are": {
    description: [
      "Agri-Sathi Hub is a farmer-centric digital platform built to support and empower farmers by combining traditional agricultural knowledge with modern technology.",
      "We act as a digital companion for farmers, helping them access accurate information, expert guidance, and practical tools needed for day-to-day farming decisions.",
      "Our platform bridges the gap between farmers, technology, and agricultural experts, ensuring reliable information reaches the farming community at the right time.",
      "Agri-Sathi Hub is designed to be simple, accessible, and inclusive for small and marginal farmers as well as agricultural stakeholders.",
    ],
  },

  "Our Mission": {
    description: ["Our mission is to improve farmers’ livelihoods by providing:"],
    points: [
      "Reliable agricultural guidance",
      "Real-time, data-driven information",
      "Easy-to-use digital tools",
    ],
    extra: [
      "We support farmers throughout the entire farming lifecycle:",
      "Planning – crop selection, soil preparation, and seasonal guidance",
      "Cultivation – best practices, pest management, and irrigation advice",
      "Harvesting – yield optimization and post-harvest handling",
      "Selling – market price insights and profit-driven decisions",
    ],
  },

  "What We Offer": {
    points: [
      "Agricultural Knowledge & Resources – verified crop, fertilizer, and pest control information",
      "Crop Guidance & Best Practices – season- and region-based recommendations",
      "Weather Updates & Alerts – timely forecasts for farming decisions",
      "Market Price Insights – up-to-date prices to maximize profits",
      "Simple & User-Friendly Platform – lightweight and low-bandwidth friendly",
    ],
  },

  "Our Vision": {
    points: [
      "Increase crop productivity using technology",
      "Reduce losses caused by climate uncertainty",
      "Promote sustainable and eco-friendly farming practices",
    ],
    description: [
      "Agri-Sathi Hub aims to become a trusted digital agriculture partner, helping farmers grow smarter, stronger, and more resilient.",
    ],
  },

  "Future Plans": {
    points: [
      "AI-based crop recommendations using soil, weather, and historical data",
      "Government scheme awareness in simple language",
      "Farmer-to-buyer digital connectivity to reduce middlemen",
      "Multilingual support for regional languages",
      "Dedicated mobile application integration",
    ],
  },
};

export default function About() {
  const [active, setActive] = useState("Who We Are");

  return (
    <section className="w-full bg-green-50 dark:bg-gray-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* TITLE */}
        <h1 className="text-4xl font-bold text-green-700 dark:text-green-400 text-center mb-10">
          🌾 About Agri-Sathi Hub
        </h1>

        {/* MENU */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {Object.keys(aboutData).map((item) => (
            <button
              key={item}
              onClick={() => setActive(item)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition
                ${
                  active === item
                    ? "bg-green-600 text-white dark:bg-green-500 dark:text-white"
                    : "bg-white text-green-700 hover:bg-green-100 dark:bg-gray-800 dark:text-green-300 dark:hover:bg-gray-700"
                }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-black/30 p-8 sm:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-2xl font-semibold text-green-700 dark:text-green-400 mb-6 text-center">
                {active}
              </h2>

              {/* Paragraphs */}
              {aboutData[active].description?.map((text, i) => (
                <p
                  key={i}
                  className="text-gray-700 dark:text-gray-200 mb-4 leading-relaxed"
                >
                  {text}
                </p>
              ))}

              {/* Bullet Points */}
              {aboutData[active].points && (
                <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 space-y-2 mb-4">
                  {aboutData[active].points.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}

              {/* Extra Lines */}
              {aboutData[active].extra?.map((line, i) => (
                <p key={i} className="text-gray-700 dark:text-gray-200 mt-2">
                  {line}
                </p>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

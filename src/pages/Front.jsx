import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import About from "./About";
import { Tractor, Users, Sprout, ShieldCheck, ChevronLeft, ChevronRight, Mail, Phone, MapPin } from "lucide-react";
import Footer from "../components/Footer";

export default function Front() {
    const images = [
        "https://images.unsplash.com/photo-1501004318641-b39e6451bec6",
        "frontImg/farmer2.jpg",
        "frontImg/farmer3.jpg",
        "frontImg/farmer4.jpg",
        "frontImg/farmer5.jpg",
        "frontImg/farmer6.jpg",
        "frontImg/farmer7.jpg",
        "frontImg/farmer8.jpg",
    ];

    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [images.length]);

    const nextSlide = () => setCurrent((current + 1) % images.length);
    const prevSlide = () => setCurrent((current - 1 + images.length) % images.length);

    return (
        <div className="scroll-smooth bg-slate-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans selection:bg-green-100">

            {/* --- HERO SLIDER --- */}
            <section id="home" className="relative w-full h-[550px] md:h-[700px] overflow-hidden group pt-16">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={current}
                        src={images[current]}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Overlay with Gradient */}
                <div className="absolute inset-0 bg-black/40 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col items-center justify-center text-center px-6">
                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-white text-4xl md:text-7xl font-extrabold tracking-tight max-w-5xl"
                    >
                        Smart Farming Solutions for <span className="text-green-400">Modern Agriculture</span> 🌾
                    </motion.h1>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-200 mt-6 text-lg md:text-2xl max-w-2xl font-light"
                    >
                        Bridging the gap between traditional wisdom and future technology.
                    </motion.p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-10 bg-green-600 hover:bg-green-500 text-white px-10 py-4 rounded-full font-bold shadow-2xl transition-all"
                    >
                        Explore Services
                    </motion.button>
                </div>

                {/* Navigation Arrows */}
                <button onClick={prevSlide} className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-lg p-4 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 border border-white/20">
                    <ChevronLeft size={28} />
                </button>
                <button onClick={nextSlide} className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 backdrop-blur-lg p-4 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 border border-white/20">
                    <ChevronRight size={28} />
                </button>
            </section>

            {/* --- WELCOME SECTION --- */}
            <section className="max-w-7xl mx-auto py-24 px-6 text-center">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                    <h2 className="text-sm font-black text-green-600 uppercase tracking-[0.3em] mb-3">Welcome to Agri Sathi HUB</h2>
                    <h3 className="text-4xl md:text-6xl font-bold mb-8">Revolutionizing Rural Livelihoods</h3>
                    <div className="w-24 h-2 bg-green-500 mx-auto mb-10 rounded-full"></div>
                    <p className="max-w-4xl mx-auto text-gray-600 dark:text-gray-400 text-xl leading-relaxed font-medium">
                        Empowering farmers with modern solutions like machine rentals, labor hiring,
                        crop prediction, and government services—all in one intelligent platform.
                    </p>
                </motion.div>
            </section>

            {/* --- FEATURE GRID --- */}
            <section className="max-w-7xl mx-auto pb-24 px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <motion.div initial={{ x: -50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-green-500/20 rounded-3xl blur-2xl group-hover:bg-green-500/30 transition-all"></div>
                            <img src='frontImg/farmer1.jpg' alt="Farmer" className="relative rounded-3xl shadow-2xl w-full object-cover" />
                        </div>
                    </motion.div>
                    <motion.div initial={{ x: 50, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} viewport={{ once: true }}>
                        <h3 className="text-4xl font-bold mb-6 text-green-600">Comprehensive Farmer Support</h3>
                        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                            Access real-time farming advice and government schemes tailored to your region. We ensure you're never alone in the field.
                        </p>
                        <ul className="space-y-5">
                            {['Direct Govt. Schemes', 'Expert Consultations', 'Cultivation Process', 'labors and machines'].map((item) => (
                                <li key={item} className="flex items-center text-lg font-semibold text-gray-700 dark:text-gray-200">
                                    <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg mr-4">
                                        <ShieldCheck className="text-green-600" size={24} />
                                    </div>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </section>

            {/* --- SERVICES CARDS --- */}
            <section id="services" className="bg-slate-100 dark:bg-gray-800/40 py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">Our Core Services</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-lg">Specialized tools for every stage of farming</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
                        <ServiceCard
                            icon={<Sprout className="text-green-500" />}
                            title="Crop Prediction"
                            desc="AI-driven suggestions based on soil and weather data."
                        />
                        <ServiceCard
                            icon={<Users className="text-blue-500" />}
                            title="Labor Hiring"
                            desc="Connect with verified workers based on skills and location."
                        />
                        <ServiceCard
                            icon={<Tractor className="text-red-500" />}
                            title="Machine Rental"
                            desc="Rent high-end machinery without the burden of ownership."
                        />
                        <ServiceCard
                            icon={<ShieldCheck className="text-yellow-500" />}
                            title="Govt. Services"
                            desc="Easy digital application for agricultural subsidies."
                        />
                    </div>
                </div>
            </section>

            {/* --- MOTTO --- */}
            <section className="py-24 bg-green-600 text-white text-center px-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10"><Tractor size={100} /></div>
                    <div className="absolute bottom-10 right-10"><Sprout size={100} /></div>
                </div>
                <motion.div initial={{ scale: 0.95, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} className="relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black italic mb-8 leading-tight">
                        "Empowering Farmers with Technology <br /> for a Better Tomorrow"
                    </h2>
                    <p className="text-white/90 mb-10 max-w-4xl mx-auto text-lg md:text-xl leading-relaxed italic opacity-80">
                        Agri Sathi HUB is more than just a platform; it is a digital companion designed to
                        simplify the complexities of modern farming. By integrating real-time data analytics,
                        seamless labor management, and cost-effective machinery rentals, we reduce the
                        operational burden on individual farmers.
                    </p>
                    <p className="text-green-100 text-2xl font-bold tracking-widest">— Agri Sathi HUB 🌱</p>
                </motion.div>
            </section>

            <div id="about">
                <About />
            </div>
        </div>
    );
}

function ServiceCard({ icon, title, desc }) {
    return (
        <motion.div
            whileHover={{ y: -12, scale: 1.02 }}
            className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-2xl shadow-gray-200/40 dark:shadow-none border border-gray-100 dark:border-gray-700 group transition-all"
        >
            <div className="mb-6 bg-slate-50 dark:bg-gray-700 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                {React.cloneElement(icon, { size: 36 })}
            </div>
            <h4 className="text-2xl font-bold mb-4">{title}</h4>
            <p className="text-gray-500 dark:text-gray-400 text-base leading-relaxed">{desc}</p>
        </motion.div>
    );
}
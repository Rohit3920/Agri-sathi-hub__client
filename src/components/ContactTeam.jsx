import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";
import api from "../utils/api";

const team = [
    {
        name: "Rohit Jaysing Nittawadekar",
        email: "rohitnittawadekar@gmail.com",
        img: "/team/rohit.jpeg",
        github: "https://github.com/Rohit3920",
        linkedin: "https://www.linkedin.com/in/rohit-nittawadekar-922984265",
    },
    {
        name: "Dhanaraj Rajendra Patil",
        email: "patildhanaraj2075@gmail.com",
        img: "/team/dhanaraj.jpeg",
        github: "https://github.com/dhanaraj1922",
        linkedin: "https://www.linkedin.com/in/dhanaraj-patil2219",
    },
    {
        name: "Rushikesh Suresh Kharche",
        email: "rushikharche007@gmail.com",
        img: "/team/rushikesh.jpeg",
        github: "https://github.com/rushikharche",
        linkedin: "https://www.linkedin.com/in/rushikesh-kharche-b7230a263",
    },
    {
        name: "Tatoba Shivaji Pandhare",
        email: "tatobapandhare8326@gmail.com",
        img: "/team/tatoba.jpeg",
        github: "https://github.com/TatobaPandhare33",
        linkedin: "https://www.linkedin.com/in/tatoba-pandhare-952365298",
    },
];

const guide = {
    name: "Prof. R. M. Jadhav",
    email: "computer science & engineering",
};

const hod = {
    name: "Prof. R. M. Jadhav",
    email: "computer science & engineering",
};

const principal = {
    name: "Dr. D. B. Ghewade",
    email: "principal@adshindecoe.edu.in",
};

export default function ContactTeam() {
    useEffect(() => {
        const container = document.getElementById("particles");
        if (!container) return;

        container.innerHTML = ""; // prevent duplicates on re-render

        for (let i = 0; i < 20; i++) {
            const div = document.createElement("div");
            div.className = "absolute bg-white rounded-full opacity-30 animate-pulse";
            const size = Math.random() * 6 + 3;
            div.style.width = `${size}px`;
            div.style.height = `${size}px`;
            div.style.left = `${Math.random() * 100}%`;
            div.style.top = `${Math.random() * 100}%`;
            container.appendChild(div);
        }
    }, []);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("api/feedback/send", {
                name: formData.name,
                email: formData.email,
                message: formData.message
            });
            alert("Feedback sent!");
            setFormData({ name: "", email: "", message: "" });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-200 dark:from-gray-900 dark:via-black dark:to-gray-900 text-gray-900 dark:text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/50 dark:bg-black/70"></div>
            <div id="particles" className="absolute inset-0"></div>

            <div className="relative z-10 p-6 md:p-12">
                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold text-center mb-4"
                >
                    <span className="text-green-600">Agri</span> Sathi <span className="text-red-600">HUB</span>
                </motion.h1>

                <p className="text-center text-lg mb-10 text-gray-700 dark:text-gray-300">
                    Smart Agriculture Platform for Farmers
                </p>

                {/* Project Guidance */}
                <div className="mb-12">
                    <div className="bg-white/70 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg text-center">
                        <h2 className="text-2xl font-semibold mb-4">Project Vision & Mission</h2>
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed max-w-3xl mx-auto">
                            Agri Sathi HUB helps farmers with weather updates, crop recommendations, market prices, and labor hiring. It improves productivity and enables smart decision-making using modern technology.
                        </p>
                    </div>
                </div>

                {/* Team */}
                <h2 className="text-3xl text-center font-semibold mb-8">Meet Our Team</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {team.map((member, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-white/70 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center shadow-lg hover:scale-105 hover:shadow-2xl transition"
                        >
                            <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gray-300 dark:border-white/30">
                                <img
                                    src={member.img}
                                    alt={member.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <h3 className="text-lg font-semibold">{member.name}</h3>

                            <p className="text-sm mt-2 flex justify-center items-center gap-2">
                                <Mail size={16} /> {member.email}
                            </p>

                            <div className="flex justify-center gap-4 mt-4 text-xl">
                                <a href={member.linkedin} target="_blank" rel="noreferrer">
                                    <Linkedin className="hover:text-green-500 cursor-pointer" />
                                </a>
                                <a href={member.github} target="_blank" rel="noreferrer">
                                    <Github className="hover:text-green-500 cursor-pointer" />
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Guide / HOD / Principal */}
                <div className="grid md:grid-cols-3 gap-6 mb-12">
                    {[{ title: "Project Guide", ...guide }, { title: "HOD", ...hod }, { title: "Principal", ...principal }].map((item, i) => (
                        <div key={i} className="bg-white/70 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center shadow-lg">
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm flex justify-center items-center gap-2 mt-2">
                                <Mail size={16} /> {item.email}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Contact Form */}
                <div className="grid lg:grid-cols-2 gap-8">
                    <div className="bg-white/70 dark:bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">Send Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input type="text"
                                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your Name" className="w-full p-3 rounded bg-white/80 dark:bg-white/10 border border-gray-300 dark:border-white/20" />
                            <input type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="Email" className="w-full p-3 rounded bg-white/80 dark:bg-white/10 border border-gray-300 dark:border-white/20" />
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                rows="4" placeholder="Message" className="w-full p-3 rounded bg-white/80 dark:bg-white/10 border border-gray-300 dark:border-white/20"></textarea>
                            <button className="bg-green-500 px-6 py-2 rounded-full hover:bg-blue-600 transition text-white">
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Info */}
                    <div className="space-y-6">
                        <div className="bg-white/70 dark:bg-white/10 p-6 rounded-2xl backdrop-blur-lg">
                            <h3 className="text-xl mb-2">Our College</h3>
                            <p>Dr. A.D. Shinde College Of Engineering</p>
                        </div>

                        <div className="bg-white/70 dark:bg-white/10 p-6 rounded-2xl backdrop-blur-lg">
                            <h3 className="text-xl mb-2">Email</h3>
                            <p>principal@adshindecoe.edu.in</p>
                        </div>

                        <div className="bg-white/70 dark:bg-white/10 p-6 rounded-2xl backdrop-blur-lg">
                            <h3 className="text-xl mb-2">Address</h3>
                            <p>At- Guddai, Post- Bhadgaon, Tal- Gadhinglaj, Dist- Kolhapur - 416502</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

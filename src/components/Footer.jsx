import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
    return (
        <footer id="contact" className="bg-gray-950 text-gray-400 py-10 px-6 font-sans">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">

                {/* Brand Section - Centered Content */}
                <div className="flex flex-col items-center text-center gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <h3 className="text-3xl font-bold text-white tracking-tighter">
                            Agri Sathi HUB
                        </h3>
                        {/* Logo - Centered, no hover effects, as is */}
                        <img
                            className="w-40 h-auto object-contain"
                            src="mainLogo.png"
                            alt="AGRI SATHI HUB"
                        />
                    </div>
                    <p className="leading-loose text-lg max-w-sm">
                        The ultimate digital ecosystem for Indian agriculture. Join us in making farming more sustainable and profitable.
                    </p>
                </div>

                {/* Quick Links Section */}
                <div className="flex flex-col items-center md:items-start">
                    <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-sm text-green-500">
                        Our Services
                    </h4>
                    <ul className="space-y-5 text-center md:text-left">
                        {['Weather Forecast', 'Crop Prediction', 'labours Hiring', 'rental machines', 'eGov Schemes'].map((link) => (
                            <li
                                key={link}
                                className="hover:text-green-400 cursor-pointer transition-colors text-lg flex items-center gap-3 justify-center md:justify-start"
                            >
                                <div className="bg-green-900/30 p-1.5 rounded-lg shrink-0">
                                    <ShieldCheck className="text-green-600" size={18} />
                                </div>
                                <span>{link}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Section */}
                <div className="flex flex-col items-center md:items-start">
                    <h4 className="text-white font-bold mb-8 uppercase tracking-[0.2em] text-sm text-green-500">
                        Get In Touch
                    </h4>
                    <div className="space-y-6 text-lg">
                        <div className="flex items-center gap-4 hover:text-white transition-colors">
                            <Mail size={22} className="text-green-500 shrink-0" />
                            <span>agrisathihub@gamil.com</span>
                        </div>
                        <div className="flex items-center gap-4 hover:text-white transition-colors">
                            <Phone size={22} className="text-green-500 shrink-0" />
                            <span>+91 8767100736</span>
                        </div>
                        <div className="flex items-center gap-4 hover:text-white transition-colors">
                            <MapPin size={22} className="text-green-500 shrink-0" />
                            <span>kolhapur-Maharashtra, India</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright Bar */}
            <div className="max-w-7xl mx-auto border-t border-gray-900 mt-20 pt-10 text-center">
                <p className="text-sm tracking-widest uppercase opacity-60">
                    © {new Date().getFullYear()} Agri Sathi HUB.  All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
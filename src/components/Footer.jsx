import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer id="contact" className="bg-gray-100 dark:bg-gray-950 text-gray-600 dark:text-gray-400 py-10 px-6 font-sans transition-colors duration-300">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">

                {/* Brand Section */}
                <div className="flex flex-col items-center text-center gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tighter">
                            <span className="text-green-600">Agri</span> Sathi <span className="text-red-600">HUB</span>
                        </h3>

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

                {/* Our Services */}
                <div className="flex flex-col items-center md:items-start">
                    <h4 className="text-gray-900 dark:text-white font-bold mb-8 uppercase tracking-[0.2em] text-sm text-green-500">
                        Our Services
                    </h4>
                    <ul className="space-y-5 text-center md:text-left">

                        <li>
                            <Link to="/" className="hover:text-green-400 transition-colors text-lg flex items-center gap-3 justify-center md:justify-start">
                                <div className="bg-green-900/30 p-1.5 rounded-lg shrink-0">
                                    <ShieldCheck className="text-green-600" size={18} />
                                </div>
                                <span>Weather Forecast</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/" className="hover:text-green-400 transition-colors text-lg flex items-center gap-3 justify-center md:justify-start">
                                <div className="bg-green-900/30 p-1.5 rounded-lg shrink-0">
                                    <ShieldCheck className="text-green-600" size={18} />
                                </div>
                                <span>Crop Prediction</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/labor-hire" className="hover:text-green-400 transition-colors text-lg flex items-center gap-3 justify-center md:justify-start">
                                <div className="bg-green-900/30 p-1.5 rounded-lg shrink-0">
                                    <ShieldCheck className="text-green-600" size={18} />
                                </div>
                                <span>Labours Hiring</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/machine-rentals" className="hover:text-green-400 transition-colors text-lg flex items-center gap-3 justify-center md:justify-start">
                                <div className="bg-green-900/30 p-1.5 rounded-lg shrink-0">
                                    <ShieldCheck className="text-green-600" size={18} />
                                </div>
                                <span>Rental Machines</span>
                            </Link>
                        </li>

                        <li>
                            <Link to="/egov-services" className="hover:text-green-400 transition-colors text-lg flex items-center gap-3 justify-center md:justify-start">
                                <div className="bg-green-900/30 p-1.5 rounded-lg shrink-0">
                                    <ShieldCheck className="text-green-600" size={18} />
                                </div>
                                <span>eGov Schemes</span>
                            </Link>
                        </li>

                    </ul>
                </div>

                {/* Contact Section */}
                <div className="flex flex-col items-center md:items-start">
                    <h4 className="text-gray-900 dark:text-white font-bold mb-8 uppercase tracking-[0.2em] text-sm text-green-500">
                        Get In Touch
                    </h4>

                    <div className="space-y-6 text-lg">
                        <div className="flex items-center gap-4 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <Mail size={22} className="text-green-500 shrink-0" />
                            <span>agrisathihub@gamil.com</span>
                        </div>

                        <div className="flex items-center gap-4 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <Phone size={22} className="text-green-500 shrink-0" />
                            <span>+91 8767100736</span>
                        </div>

                        <div className="flex items-center gap-4 hover:text-gray-900 dark:hover:text-white transition-colors">
                            <MapPin size={22} className="text-green-500 shrink-0" />
                            <span>Kolhapur-Maharashtra, India</span>
                        </div>

                        {/* Admin Link */}
                        <Link to="/admin">
                            <div className="flex items-center gap-4 hover:text-green-400 transition-colors cursor-pointer">
                                <ShieldCheck size={22} className="text-green-500 shrink-0" />
                                <span>Admin Panel</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto border-t border-gray-300 dark:border-gray-900 mt-20 pt-10 text-center">
                <p className="text-sm tracking-widest uppercase opacity-60">
                    © {new Date().getFullYear()} Agri Sathi HUB. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
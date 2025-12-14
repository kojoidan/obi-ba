import { footerLinks } from "../assets/assets";
import { NavLink } from "react-router-dom";

const Footer = () => {

    return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-24 bg-yellow-600/10">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500">
                <div>
                    <h3 className="text-2xl font-semibold text-yellow-600">Obi Ba Cold Store</h3>
                    <p className="max-w-[410px] mt-6">We provide fresh and affordable quality frozen foods across Ghana. Trusted by thousands. We aim to deliver the best service for you.</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {footerLinks.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        {link.text === "Contact Us" ? (
                                            <NavLink to="/contact" className="hover:underline transition">{link.text}</NavLink>
                                        ) : link.text === "Home" ? (
                                            <NavLink to="/" className="hover:underline transition">{link.text}</NavLink>
                                        ) : link.text === "Best Product" || link.text === "Best Products" ? (
                                            <NavLink to="/products" className="hover:underline transition">{link.text}</NavLink>
                                        ) : (
                                            <a href={link.url} className="hover:underline transition">{link.text}</a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Contact Section */}
            <div className="py-8 border-b border-gray-500/30">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 text-center">Contact Us</h3>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 text-sm text-gray-600">
                    <div className="text-center">
                        <h4 className="font-semibold text-gray-900 mb-1">Email</h4>
                        <a href="mailto:info@obibacoldstore.com" className="hover:text-yellow-600 transition">
                            info@obibacoldstore.com
                        </a>
                    </div>
                    <div className="text-center">
                        <h4 className="font-semibold text-gray-900 mb-1">Phone</h4>
                        <a href="tel:+233508720466" className="hover:text-yellow-600 transition">
                            +233 508 720 466
                        </a>
                    </div>
                    <div className="text-center">
                        <h4 className="font-semibold text-gray-900 mb-1">Address</h4>
                        <p>Accra, Ghana</p>
                    </div>
                </div>
            </div>
            
            <p className="py-4 text-center text-sm md:text-base text-gray-700/80">
                Copyright 2025 © Obi Ba Cold Store All Right Reserved.
            </p>
        </div>
    );
};

export default Footer;
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Contact = () => {
    const { axios, user } = useAppContext();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            return toast.error('Please fill in all fields');
        }

        setIsSubmitting(true);
        try {
            const { data } = await axios.post('/api/contact/submit', {
                name: formData.name,
                email: formData.email,
                subject: formData.subject,
                message: formData.message,
                userId: user?._id || null
            });
            
            if (data.success) {
                toast.success(data.message);
                setFormData({
                    name: user?.name || '',
                    email: user?.email || '',
                    subject: '',
                    message: ''
                });
            } else {
                toast.error(data.message || 'Failed to send message. Please try again.');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message || 'Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="mt-16 mb-16">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Contact Us</h1>
                <p className="text-center text-gray-600 mb-12">
                    Have a question or need help? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-yellow-600">Get in Touch</h2>
                            <p className="text-gray-600 mb-6">
                                We provide fresh and affordable quality frozen foods across Ghana. 
                                Trusted by thousands. We aim to deliver the best service for you.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                                <p className="text-gray-600">info@obibacoldstore.com</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                                <p className="text-gray-600">+233 508 720 466</p>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                                <p className="text-gray-600">
                                    Ghana<br />
                                    Accra, Ghana
                                </p>
                            </div>
                        </div>

                        <div className="pt-6">
                            <h3 className="font-semibold text-gray-900 mb-4">Business Hours</h3>
                            <div className="space-y-2 text-gray-600">
                                <p>Monday - Friday: 8:00 AM - 6:00 PM</p>
                                <p>Saturday: 10:00 AM - 4:00 PM</p>
                                <p>Sunday: Closed</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 p-6 md:p-8 rounded-lg">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="5"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-600 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;


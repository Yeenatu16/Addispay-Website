"use client";

import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Send a Message</h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
          <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A36D] focus:border-transparent transition-shadow bg-gray-50 hover:bg-white" placeholder="John Doe" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address <span className="text-red-500">*</span></label>
          <input type="email" id="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A36D] focus:border-transparent transition-shadow bg-gray-50 hover:bg-white" placeholder="john@example.com" />
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Reason for Contact <span className="text-red-500">*</span></label>
          <select id="reason" name="reason" required value={formData.reason} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A36D] focus:border-transparent transition-shadow bg-gray-50 hover:bg-white">
            <option value="" disabled>Select a reason...</option>
            <option value="support">Customer Support</option>
            <option value="sales">Sales Inquiry</option>
            <option value="partnership">Partnership</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message <span className="text-red-500">*</span></label>
          <textarea id="message" name="message" required rows={4} value={formData.message} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00A36D] focus:border-transparent transition-shadow bg-gray-50 hover:bg-white resize-none" placeholder="How can we help you?"></textarea>
        </div>
        <button type="submit" className="w-full bg-[#00A36D] text-white font-semibold py-4 rounded-xl hover:bg-[#008f5d] transition-colors flex justify-center items-center gap-2 group">
          Send Message <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </form>
    </div>
  );
}

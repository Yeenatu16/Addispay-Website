"use client";

import React, { useState } from 'react';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-gray-700">Email *</label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#00A36D] focus:ring-1 focus:ring-[#00A36D]"
        />
      </div>
      
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-gray-700">Password*</label>
        <input
          id="password"
          type="password"
          placeholder="Enter Your Password Here"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border border-gray-300 rounded-md px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-[#00A36D] focus:ring-1 focus:ring-[#00A36D]"
        />
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          className="bg-[#F5A414] text-white px-10 py-2.5 rounded-full font-medium hover:bg-orange-500 transition-colors shadow-sm"
        >
          Login
        </button>
      </div>
    </form>
  );
}

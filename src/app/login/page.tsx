// app/login/page.tsx
"use client";

import { useState } from "react";
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import LoadingScreen from '@/components/LoadingScreen'

export default function LoginPage() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
    
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
    
        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
        } else {
          const {
            data: { user },
          } = await supabase.auth.getUser();
        
          if (user) {
            setLoading(true);
            setTimeout(() => {
              router.push(`/user/${user.id}/home`);
            }, 800); // ⏱ aguarda 800ms antes de redirecionar
          }
      };
    }

  return (
    <>
    {loading && <LoadingScreen />}
    <div className="w-screen h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-green-700 px-4">
      <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 w-full max-w-sm sm:max-w-md">
        
        {/* Logo Section */}
        <div className="flex justify-center mb-4">
          {/* Replace with your actual logo */}
          <Image src="/images/dinno_logo_no_bg.png" alt="Logo" width={200} height={200} />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email or Phone Number
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              placeholder="Digite o seu email"
              onChange={e => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
              placeholder="Digite a sua senha"
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {errorMsg && <p className="text-red-500">{errorMsg}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-700 text-white py-2 rounded-md hover:opacity-90 transition text-sm"
          >
            Login
          </button>
        </form>

        {/* Links */}
        <div className="flex flex-col sm:flex-row justify-between mt-4 text-sm text-center sm:text-left">
          <a href="#" className="text-green-600 hover:underline mb-2 sm:mb-0">Forgot Password?</a>
          <a href="#" className="text-green-600 hover:underline">Sign up</a>
        </div>
      </div>
    </div>
    </>
  );
}


'use client'

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import LoadingScreen from '@/components/LoadingScreen'

export default function UserHomePage() {
  const params = useParams();
  const router = useRouter();
  const [currentUser, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkUserAccess = async () =>{
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || user.id !== params.id) {
            setLoading(true);
            setTimeout(() => {
              router.push(`/login`);
            }, 800); // ⏱ aguarda 800ms antes de redirecionar
          } else {
            setLoading(false); // Libera a página
            setUser(user)
          }
        };
    
        checkUserAccess();
    }, [params.id]);

    if (loading) return (<>{loading && <LoadingScreen />}</>);

    return (
        <div>
          <h1 className="text-2xl font-bold">Bem-vindo, usuário {currentUser.user_metadata?.displayName}</h1>
        </div>
      );
}
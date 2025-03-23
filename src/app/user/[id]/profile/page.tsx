'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import LoadingScreen from '@/components/LoadingScreen'

export default function ProfilePage() {
  const router = useRouter();
  const { id: routeId } = useParams() as { id: string };

  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState('');
  const [phone, setPhone] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const loadUser = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !sessionData.session) {
        setErrorMsg('Sessão expirada. Faça login novamente.');
        router.push('/login');
        return;
      }

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        setErrorMsg('Erro ao recuperar o usuário.');
        router.push('/login');
        return;
      }

      if (user.id !== routeId) {
        setErrorMsg('Acesso não autorizado.');
        router.push('/unauthorized');
        return;
      }

      setDisplayName(user.user_metadata?.displayName || '');
      setPhone(user.user_metadata?.phone || '');
      setLoading(false);
    };

    loadUser();
  }, [routeId, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !sessionData.session) {
      setErrorMsg('Sessão expirada. Faça login novamente.');
      router.push('/login');
      return;
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        displayName,
        phone,
      },
    });

    if (error) {
      setErrorMsg('Erro ao atualizar: ' + error.message);
    } else {
      setSuccessMsg('Informações atualizadas com sucesso!');
    }
  };

  if (loading) return <>{loading && <LoadingScreen />}</>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Seu Perfil</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black">Nome</label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            placeholder="Digite seu nome"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">Telefone</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-black"
            placeholder="Digite seu telefone"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:opacity-90 transition"
        >
          Salvar
        </button>
      </form>

      {successMsg && <p className="mt-4 text-green-600">{successMsg}</p>}
      {errorMsg && <p className="mt-4 text-red-500">{errorMsg}</p>}
    </div>
  );
}

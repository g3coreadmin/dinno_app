'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import LoadingScreen from '@/components/LoadingScreen';

interface Lancamento {
  id: number;
  categoria: string;
  valor: number;
  data: string;
  user_number: string;
  descricao: string;
}

interface CategoriaTotal {
  categoria: string;
  total: number;
}

export default function GraficosPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<CategoriaTotal[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchDados = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        router.push('/login');
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user || user.id !== params.id) {
        router.push('/unauthorized');
        return;
      }

      const phone = user.user_metadata?.phone;
      if (!phone) {
        setErrorMsg('Telefone não encontrado no perfil do usuário.');
        return;
      }

      const { data, error } = await supabase
        .from('lancamentos_categorias_with_name')
        .select('*')
        .eq('user_number', phone);

      if (error) {
        setErrorMsg('Erro ao buscar dados: ' + error.message);
        return;
      }

      // 🧠 Agrupar por categoria
      const agrupado: { [categoria: string]: number } = {};

      data?.forEach((item: Lancamento) => {
        if (!agrupado[item.categoria]) {
          agrupado[item.categoria] = 0;
        }
        agrupado[item.categoria] += item.valor;
      });

      const resultado: CategoriaTotal[] = Object.entries(agrupado).map(([categoria, total]) => ({
        categoria,
        total,
      }));

      setDados(resultado);
      setLoading(false);
    };

    fetchDados();
  }, [params.id, router]);

  if (loading) return <LoadingScreen />;
  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-700">Gastos por Categoria</h1>

      {dados.length === 0 ? (
        <p className="text-gray-500">Nenhum dado disponível.</p>
      ) : (
        <div className="w-full h-[700px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2)}`} />
              <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

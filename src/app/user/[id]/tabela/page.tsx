'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import LoadingScreen from '@/components/LoadingScreen';

interface Lancamento {
  id: number;
  descricao: string;
  valor: number;
  categoria: string;
  data: string; // formato ISO ou YYYY-MM-DD
}

export default function LancamentosPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchLancamentos = async () => {
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
        setErrorMsg('Erro ao buscar lançamentos: ' + error.message);
      } else {
        console.log(data)
        // Ordenar por data do mais recente para o mais antigo
        const sorted = [...(data || [])].sort((a, b) =>
          new Date(b.data).getTime() - new Date(a.data).getTime()
        );

        setLancamentos(sorted);
      }

      setLoading(false);
    };

    fetchLancamentos();
  }, [params.id, router]);

  if (loading) return <LoadingScreen />;
  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-green-700">Lançamentos</h1>

    {/* Botão Exportar CSV */}
    <div className="mb-4">
        <button
        onClick={() => exportToCSV(lancamentos)}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
        Exportar CSV
        </button>
    </div>

      <div className="overflow-y-auto max-h-[77vh] border rounded-lg shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-green-700 text-white sticky top-0 z-10">
            <tr>
              <th className="p-3 text-left">Data</th>
              <th className="p-3 text-left">Descrição</th>
              <th className="p-3 text-left">Categoria</th>
              <th className="p-3 text-left">Valor</th>
            </tr>
          </thead>
          <tbody className="bg-white text-gray-800">
            {lancamentos.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-100 transition">
                <td className="p-3">{new Date(item.data).toLocaleDateString()}</td>
                <td className="p-3">{item.descricao}</td>
                <td className="p-3">{item.categoria}</td>
                <td className="p-3">R$ {Number(item.valor)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

    // 🔽 Função para exportar como CSV
    function exportToCSV(data: Lancamento[]) {
        if (data.length === 0) return;
    
        const headers = ['Data', 'Descrição', 'Categoria', 'Valor'];
        const rows = data.map((item) => [
        new Date(item.data).toLocaleDateString(),
        item.descricao,
        item.categoria,
        item.valor,
        ]);
    
        const csvContent = [headers, ...rows]
        .map((row) => row.map((field) => `"${field}"`).join(','))
        .join('\n');
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'lancamentos.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

import React, { useState } from 'react';
import { Donor } from '../types';
import { Search, Download, FileText } from './Icons';

interface DonorListProps {
  donors: Donor[];
}

const DonorList: React.FC<DonorListProps> = ({ donors }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDonors = donors.filter(d => 
    d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.course && d.course.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.semester && d.semester.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (d.teacher && d.teacher.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDownloadCSV = () => {
    // Define CSV headers
    const headers = ['Nome Completo', 'Email', 'Telefone', 'Curso', 'Semestre', 'Professor', 'Qtd. Itens/Kg', 'Data da Doação'];
    
    // Map data to rows
    const rows = filteredDonors.map(donor => [
      `"${donor.fullName}"`,
      `"${donor.email}"`,
      `"${donor.phone}"`,
      `"${donor.course || ''}"`,
      `"${donor.semester || ''}"`,
      `"${donor.teacher || ''}"`,
      donor.quantity,
      `"${new Date(donor.date).toLocaleDateString('pt-BR')} ${new Date(donor.date).toLocaleTimeString('pt-BR')}"`
    ]);

    // Join headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `doadores_alimentos_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-slate-800">Banco de Dados de Alimentos</h2>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Pesquisar por nome, curso..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={handleDownloadCSV}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium shadow-sm"
              title="Baixar planilha compatível com Excel e Google Sheets"
            >
              <Download className="w-4 h-4" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 whitespace-nowrap">Data</th>
                <th className="px-6 py-4">Nome Completo</th>
                <th className="px-6 py-4">Curso / Semestre</th>
                <th className="px-6 py-4">Professor</th>
                <th className="px-6 py-4">Contato</th>
                <th className="px-6 py-4 text-center">Qtd. (Kg/Unid)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-8 h-8 opacity-20" />
                      <p>Nenhum registro encontrado.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDonors.map((donor) => (
                  <tr key={donor.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {new Date(donor.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{donor.fullName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700">{donor.course || '-'}</div>
                      <div className="text-xs text-slate-400">{donor.semester || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700">{donor.teacher || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-600">{donor.email}</div>
                      <div className="text-xs text-slate-400">{donor.phone}</div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {donor.quantity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
           <span>Exibindo {filteredDonors.length} de {donors.length} registros</span>
           <span>Use o botão "Exportar CSV" para abrir no Google Planilhas</span>
        </div>
      </div>
    </div>
  );
};

export default DonorList;
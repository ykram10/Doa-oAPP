import React, { useMemo } from 'react';
import { QrCode } from './Icons';

const SharePage: React.FC = () => {
  
  const publicLink = useMemo(() => {
    // Construct the URL. Using window.location.origin ensures it works in the current environment.
    // We add ?mode=public to trigger the "Donor Mode" in App.tsx
    return `${window.location.origin}${window.location.pathname}?mode=public`;
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicLink);
    // Optional: You could add a toast notification here
    alert("Link copiado para a área de transferência!");
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 py-10 animate-fade-in">
      <div className="text-center space-y-2 max-w-lg">
        <h2 className="text-2xl font-bold text-slate-900">Compartilhar Link de Doação</h2>
        <p className="text-slate-500">
          Copie o link abaixo e envie para os alunos. Eles serão direcionados para uma página exclusiva de registro, sem acesso aos dados administrativos.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 w-full max-w-xl">
        <div className="flex flex-col gap-4">
           <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 break-all">
             <p className="text-sm font-mono text-slate-600 select-all text-center">{publicLink}</p>
           </div>
           
           <button 
            onClick={handleCopy}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2"
           >
             <span>Copiar Link de Acesso</span>
           </button>
        </div>
      </div>

      <div className="flex gap-4 text-sm text-slate-500 bg-indigo-50 px-4 py-3 rounded-lg border border-indigo-100 max-w-xl">
        <div className="shrink-0">
          <QrCode className="w-5 h-5 text-indigo-600" />
        </div>
        <span><strong>Modo Quiosque:</strong> Este link ativa um modo de segurança onde a barra lateral e as listas de doadores são ocultadas, permitindo apenas novos registros.</span>
      </div>
    </div>
  );
};

export default SharePage;
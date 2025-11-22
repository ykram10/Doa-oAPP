import React, { useState, useEffect } from 'react';
import { Donor, ViewState } from './types';
import { LayoutDashboard, UserPlus, FileText } from './components/Icons';
import DonationForm from './components/DonationForm';
import Dashboard from './components/Dashboard';
import DonorList from './components/DonorList';

// Mock initial data for demonstration if storage is empty
const INITIAL_DATA: Donor[] = [
  { id: '1', fullName: 'Alice Silva', email: 'alice.silva@email.com', phone: '(11) 98765-4321', course: 'Nutrição', semester: '4º Sem', teacher: 'Prof. Carlos', quantity: 12, date: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', fullName: 'Roberto Santos', email: 'roberto.s@email.com', phone: '(21) 91234-5678', course: 'Engenharia de Alimentos', semester: '2º Sem', teacher: 'Prof. Ana', quantity: 5, date: new Date(Date.now() - 172800000).toISOString() },
  { id: '3', fullName: 'Carolina Oliveira', email: 'carol.oli@email.com', phone: '(31) 99887-7766', course: 'Gastronomia', semester: '8º Sem', teacher: 'Prof. Marcos', quantity: 24, date: new Date().toISOString() },
];

function App() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [isPublicMode, setIsPublicMode] = useState(false);

  // Load from local storage on mount and check URL params
  useEffect(() => {
    // Check for public mode in URL parameters
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    
    if (mode === 'public') {
      setIsPublicMode(true);
      setView('register');
    }

    // Load Data
    const stored = localStorage.getItem('donationManager_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Backward compatibility check: ensure new fields exist
        const fixedData = parsed.map((d: any) => ({
            ...d,
            course: d.course || '',
            semester: d.semester || '',
            teacher: d.teacher || ''
        }));
        setDonors(fixedData);
      } catch (e) {
        console.error("Failed to parse stored data", e);
        setDonors(INITIAL_DATA);
      }
    } else {
      setDonors(INITIAL_DATA);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('donationManager_data', JSON.stringify(donors));
    }
  }, [donors, isLoaded]);

  const handleAddDonor = (data: Omit<Donor, 'id' | 'date'>) => {
    const newDonor: Donor = {
      ...data,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    setDonors(prev => [newDonor, ...prev]); // Add to top
    
    // If in public mode, stay on register page and maybe show alert
    if (isPublicMode) {
        alert('Doação registrada com sucesso! Obrigado por ajudar quem precisa.');
        // Ideally reset form here or just keep view as register. 
        // Since DonationForm clears itself or we can force remount
        return;
    }
    setView('dashboard');
  };

  const handleUpdateDonor = (data: Omit<Donor, 'id' | 'date'>) => {
    if (!editingDonor) return;

    const updatedDonor: Donor = {
      ...editingDonor,
      ...data,
    };

    setDonors(prev => prev.map(d => d.id === editingDonor.id ? updatedDonor : d));
    setEditingDonor(null);
    setView('dashboard');
  };

  const handleEditClick = (donor: Donor) => {
    setEditingDonor(donor);
    setView('edit');
  };

  const handleCancelEdit = () => {
    setEditingDonor(null);
    if (isPublicMode) {
        // In public mode, cancel just resets/does nothing
        return;
    }
    setView('dashboard');
  };

  const handleDeleteDonor = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este registro?")) {
      setDonors(prev => prev.filter(d => d.id !== id));
    }
  };

  const handleNavigation = (targetView: ViewState) => {
    if (isPublicMode) return; // Prevent navigation in public mode

    if (targetView === 'register') {
      setEditingDonor(null); // Clear edit state if manually clicking register
    }
    setView(targetView);
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return (
          <Dashboard 
            donors={donors} 
            onDelete={handleDeleteDonor} 
            onEdit={handleEditClick}
          />
        );
      case 'register':
      case 'edit':
        return (
          <DonationForm 
            key={editingDonor ? editingDonor.id : 'new'}
            onSubmit={view === 'edit' ? handleUpdateDonor : handleAddDonor} 
            onCancel={handleCancelEdit}
            initialData={editingDonor}
          />
        );
      case 'list':
        return <DonorList donors={donors} />;
      default:
        return null;
    }
  };

  const getHeaderTitle = () => {
    if (isPublicMode) return 'Bem-vindo à Campanha de Alimentos';
    switch(view) {
      case 'dashboard': return 'Visão Geral da Campanha';
      case 'register': return 'Doar Alimentos';
      case 'edit': return 'Editar Doação';
      case 'list': return 'Lista Completa de Doadores';
      default: return '';
    }
  };

  const getHeaderDesc = () => {
    if (isPublicMode) return 'Preencha seus dados abaixo para doar alimentos e combater a fome.';
     switch(view) {
      case 'dashboard': return 'Acompanhe a arrecadação de alimentos, gerencie doadores e gere análises.';
      case 'register': return 'Registre uma nova doação de alimentos no banco de dados.';
      case 'edit': return 'Atualize as informações da doação abaixo.';
      case 'list': return 'Visualize, pesquise e exporte os dados de doação de alimentos.';
      default: return '';
    }
  };

  // If Public Mode, render a simplified layout
  if (isPublicMode) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-10">
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                 <h1 className="text-3xl font-bold text-indigo-600 mb-2">Campanha de Alimentos</h1>
                 <p className="text-slate-600">{getHeaderDesc()}</p>
            </div>
            <DonationForm 
                onSubmit={handleAddDonor} 
                onCancel={handleCancelEdit}
            />
            <div className="text-center text-xs text-slate-400">
                <p>Modo Seguro de Registro - Acesso Administrativo Bloqueado</p>
            </div>
        </div>
      </div>
    );
  }

  // Admin Layout
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-500">
            FoodDrive
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => handleNavigation('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              view === 'dashboard' 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Painel
          </button>
          <button
            onClick={() => handleNavigation('register')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              view === 'register' || view === 'edit'
                ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            {view === 'edit' ? 'Editar Doação' : 'Registrar Doação'}
          </button>
          <button
            onClick={() => handleNavigation('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              view === 'list'
                ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <FileText className="w-5 h-5" />
            Lista de Doadores
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Status da Campanha</p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs font-bold text-slate-700">65% da meta atingida</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-20 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">FoodDrive</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => handleNavigation('dashboard')} 
              className={`p-2 rounded-lg ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}
            >
              <LayoutDashboard className="w-6 h-6" />
            </button>
            <button 
              onClick={() => handleNavigation('register')} 
              className={`p-2 rounded-lg ${view === 'register' || view === 'edit' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}
            >
              <UserPlus className="w-6 h-6" />
            </button>
             <button 
              onClick={() => handleNavigation('list')} 
              className={`p-2 rounded-lg ${view === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}
            >
              <FileText className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* Header Area */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {getHeaderTitle()}
            </h2>
            <p className="text-slate-500 mt-2">
              {getHeaderDesc()}
            </p>
          </div>

          {/* View Content */}
          <div className="animate-fade-in">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
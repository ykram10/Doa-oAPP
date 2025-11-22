import React, { useState, useEffect } from 'react';
import { Donor, ViewState } from './types';
import { LayoutDashboard, UserPlus } from './components/Icons';
import DonationForm from './components/DonationForm';
import Dashboard from './components/Dashboard';

// Mock initial data for demonstration if storage is empty
const INITIAL_DATA: Donor[] = [
  { id: '1', fullName: 'Alice Johnson', email: 'alice@example.com', phone: '555-0101', quantity: 12, date: new Date(Date.now() - 86400000).toISOString() },
  { id: '2', fullName: 'Bob Smith', email: 'bob@example.com', phone: '555-0102', quantity: 5, date: new Date(Date.now() - 172800000).toISOString() },
  { id: '3', fullName: 'Carol White', email: 'carol@example.com', phone: '555-0103', quantity: 24, date: new Date().toISOString() },
];

function App() {
  const [view, setView] = useState<ViewState>('dashboard');
  const [donors, setDonors] = useState<Donor[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const stored = localStorage.getItem('donationManager_data');
    if (stored) {
      try {
        setDonors(JSON.parse(stored));
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
    setView('dashboard');
  };

  const handleDeleteDonor = (id: string) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setDonors(prev => prev.filter(d => d.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-100">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-emerald-500">
            DonationMgr
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              view === 'dashboard' 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button
            onClick={() => setView('register')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              view === 'register' 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200' 
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            Register Donation
          </button>
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-lg p-4">
            <p className="text-xs text-slate-500 mb-1">Campaign Status</p>
            <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-xs font-bold text-slate-700">65% of goal reached</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-slate-200 p-4 sticky top-0 z-20 flex justify-between items-center">
          <h1 className="text-xl font-bold text-indigo-600">DonationMgr</h1>
          <div className="flex gap-2">
            <button 
              onClick={() => setView('dashboard')} 
              className={`p-2 rounded-lg ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}
            >
              <LayoutDashboard className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setView('register')} 
              className={`p-2 rounded-lg ${view === 'register' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500'}`}
            >
              <UserPlus className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {/* Header Area */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">
              {view === 'dashboard' ? 'Campaign Overview' : 'Donor Registration'}
            </h2>
            <p className="text-slate-500 mt-2">
              {view === 'dashboard' 
                ? 'Track donations, manage donors, and generate analytics.' 
                : 'Add a new donation record to the database.'}
            </p>
          </div>

          {/* View Content */}
          <div className="animate-fade-in">
            {view === 'dashboard' ? (
              <Dashboard donors={donors} onDelete={handleDeleteDonor} />
            ) : (
              <DonationForm 
                onSubmit={handleAddDonor} 
                onCancel={() => setView('dashboard')} 
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

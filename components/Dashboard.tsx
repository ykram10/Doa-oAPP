import React, { useState } from 'react';
import { DonationStats, Donor } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import StatsCard from './StatsCard';
import { Users, Shirt, Sparkles, Mail, Trash2, Search } from './Icons';
import { generateThankYouMessage } from '../services/geminiService';

interface DashboardProps {
  donors: Donor[];
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ donors, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [generatedMessage, setGeneratedMessage] = useState<{ id: string, msg: string } | null>(null);

  // Calculate stats
  const stats: DonationStats = {
    totalDonors: donors.length,
    totalItems: donors.reduce((acc, curr) => acc + curr.quantity, 0),
    averageItemsPerDonor: donors.length > 0 
      ? Math.round((donors.reduce((acc, curr) => acc + curr.quantity, 0) / donors.length) * 10) / 10 
      : 0,
  };

  // Prepare chart data (last 5 donations for simplicity or grouped)
  // Grouping by date would be better, but for this demo, we'll just show recent individual donations
  const chartData = donors.slice(-7).map(d => ({
    name: d.fullName.split(' ')[0], // First name
    items: d.quantity
  }));

  const filteredDonors = donors.filter(d => 
    d.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateNote = async (donor: Donor) => {
    setGeneratingId(donor.id);
    setGeneratedMessage(null);
    try {
      const msg = await generateThankYouMessage(donor);
      setGeneratedMessage({ id: donor.id, msg });
    } catch (error) {
      console.error("Failed to generate", error);
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Items Donated" 
          value={stats.totalItems} 
          icon={<Shirt className="w-6 h-6" />} 
          colorClass="bg-indigo-500"
          trend="+12% this week"
        />
        <StatsCard 
          title="Total Donors" 
          value={stats.totalDonors} 
          icon={<Users className="w-6 h-6" />} 
          colorClass="bg-emerald-500"
          trend="Active Campaign"
        />
        <StatsCard 
          title="Avg. Items / Donor" 
          value={stats.averageItemsPerDonor} 
          icon={<Sparkles className="w-6 h-6" />} 
          colorClass="bg-amber-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main List Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800">Recent Donors</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search donors..." 
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Donor Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4 text-center">Items</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                      No donors found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredDonors.map((donor) => (
                    <tr key={donor.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-900">{donor.fullName}</div>
                        <div className="text-xs text-slate-400">{new Date(donor.date).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-slate-600">{donor.email}</div>
                        <div className="text-xs text-slate-400">{donor.phone}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {donor.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleGenerateNote(donor)}
                            className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Generate AI Thank You Note"
                            disabled={generatingId === donor.id}
                          >
                            {generatingId === donor.id ? (
                              <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                          </button>
                          <button 
                            onClick={() => onDelete(donor.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Charts & Messages */}
        <div className="space-y-8">
          {/* Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
             <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Donation Trends</h3>
             <div className="h-48 w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                   <Tooltip 
                      cursor={{fill: '#f8fafc'}}
                      contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                   />
                   <Bar dataKey="items" radius={[4, 4, 0, 0]}>
                     {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#818cf8'} />
                     ))}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
             </div>
          </div>

          {/* AI Message Area */}
          {generatedMessage && (
            <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-sm border border-indigo-100 p-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-3 text-indigo-800">
                <Mail className="w-5 h-5" />
                <h3 className="font-bold">AI Draft: Thank You Note</h3>
              </div>
              <div className="bg-white p-4 rounded-lg border border-indigo-50 text-sm text-slate-600 leading-relaxed italic relative">
                "{generatedMessage.msg}"
                <div className="absolute -left-2 top-6 w-4 h-4 bg-white border-b border-l border-indigo-50 transform rotate-45"></div>
              </div>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedMessage.msg)}
                className="mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                Copy to clipboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

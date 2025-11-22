import React, { useState } from 'react';
import { Donor } from '../types';
import { Shirt } from './Icons';

interface DonationFormProps {
  onSubmit: (donor: Omit<Donor, 'id' | 'date'>) => void;
  onCancel: () => void;
}

const DonationForm: React.FC<DonationFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    quantity: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      quantity: parseInt(formData.quantity, 10) || 0,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-indigo-600 px-8 py-6">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-lg">
            <Shirt className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">New Donation</h2>
            <p className="text-indigo-100 text-sm">Enter donor details and item count.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="e.g., Jane Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="jane@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="(555) 123-4567"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">Number of Items</label>
            <div className="relative">
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all pl-4"
                placeholder="0"
                value={formData.quantity}
                onChange={handleChange}
              />
              <div className="absolute right-3 top-2 text-slate-400 text-sm pointer-events-none">
                pcs
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Please count individual items (shirts, pants, etc.)</p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all shadow-lg shadow-indigo-200"
          >
            Register Donation
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;

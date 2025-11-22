import React, { useState, useEffect } from 'react';
import { Donor } from '../types';
import { Package } from './Icons';

interface DonationFormProps {
  onSubmit: (donor: Omit<Donor, 'id' | 'date'>) => void;
  onCancel: () => void;
  initialData?: Donor | null;
}

const DonationForm: React.FC<DonationFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    course: '',
    semester: '',
    teacher: '',
    quantity: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName,
        email: initialData.email,
        phone: initialData.phone,
        course: initialData.course || '',
        semester: initialData.semester || '',
        teacher: initialData.teacher || '',
        quantity: initialData.quantity.toString(),
      });
    } else {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        course: '',
        semester: '',
        teacher: '',
        quantity: '',
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      course: formData.course,
      semester: formData.semester,
      teacher: formData.teacher,
      quantity: parseInt(formData.quantity, 10) || 0,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const isEditing = !!initialData;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-indigo-600 px-8 py-6">
        <div className="flex items-center gap-3 text-white">
          <div className="p-2 bg-white/20 rounded-lg">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{isEditing ? 'Editar Doação' : 'Doação de Alimentos'}</h2>
            <p className="text-indigo-100 text-sm">
              {isEditing ? 'Atualize os detalhes do doador.' : 'Insira os detalhes do aluno e a quantidade de alimentos.'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              required
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="ex: João Silva"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-slate-700 mb-1">Curso / Graduação</label>
              <input
                type="text"
                id="course"
                name="course"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="ex: Nutrição"
                value={formData.course}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="semester" className="block text-sm font-medium text-slate-700 mb-1">Semestre / Período</label>
              <input
                type="text"
                id="semester"
                name="semester"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="ex: 3º Semestre"
                value={formData.semester}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="teacher" className="block text-sm font-medium text-slate-700 mb-1">Nome do Professor (Opcional)</label>
            <input
              type="text"
              id="teacher"
              name="teacher"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              placeholder="ex: Prof. Dr. Santos"
              value={formData.teacher}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="joao@exemplo.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Telefone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="(11) 99999-9999"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-slate-700 mb-1">Quantidade de Itens</label>
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
                unid/kg
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-1">Conte cada item (ex: 1 pacote de arroz = 1, 2 latas de óleo = 2).</p>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 rounded-lg text-slate-700 font-medium hover:bg-slate-100 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all shadow-lg shadow-indigo-200"
          >
            {isEditing ? 'Atualizar Doação' : 'Registrar Doação'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DonationForm;
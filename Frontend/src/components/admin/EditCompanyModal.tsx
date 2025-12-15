"use client"
import React, { useState } from 'react';
import { Company } from '@/types/company';
import GenericButton from '../GenericButton/GenericButton';

interface EditCompanyModalProps {
  company: Company;
  onClose: () => void;
  onSave: (data: Partial<Company>) => void;
}

const EditCompanyModal = ({ company, onClose, onSave }: EditCompanyModalProps) => {
  const [formData, setFormData] = useState({
    name: company.name,
    industry: company.industry,
    employees: company.employees,
    activeUsers: company.activeUsers,
    plan: company.plan,
    adminName: company.admin.name,
    adminRole: company.admin.role
  });

  const handleSubmit = () => {
    onSave({
      name: formData.name,
      industry: formData.industry,
      employees: formData.employees,
      activeUsers: formData.activeUsers,
      plan: formData.plan,
      admin: {
        name: formData.adminName,
        role: formData.adminRole
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Editar Empresa</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <span className="text-2xl">&times;</span>
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre de la empresa
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industria
              </label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Empleados
                </label>
                <input
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Usuarios activos
                </label>
                <input
                  type="number"
                  value={formData.activeUsers}
                  onChange={(e) => setFormData({ ...formData, activeUsers: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plan
              </label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Basic">Basic</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del administrador
              </label>
              <input
                type="text"
                value={formData.adminName}
                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol del administrador
              </label>
              <input
                type="text"
                value={formData.adminRole}
                onChange={(e) => setFormData({ ...formData, adminRole: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <GenericButton
                textButton="Guardar"
                type="button"
                onClick={handleSubmit}
                size="full"
                variant="black"
                className="mb-0"
              />
              <GenericButton
                textButton="Cancelar"
                type="button"
                onClick={onClose}
                size="full"
                variant="white"
                className="mb-0"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCompanyModal;
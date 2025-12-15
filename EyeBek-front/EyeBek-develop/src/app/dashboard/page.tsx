"use client"
import React, { useState, useEffect } from 'react';
import { Building2, Users } from 'lucide-react';
import { Company } from '@/types/company';
import { CompanyService } from '@/services/admin';
import CompanyCard from '@/components/companiesCard/Card';
import EditCompanyModal from '@/components/admin/EditCompanyModal';

export default function AdminDashboard() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const data = await CompanyService.getAll();
      setCompanies(data);
    } catch (error) {
      console.error('Error al cargar empresas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
  };

  const handleSave = async (data: Partial<Company>) => {
    if (!editingCompany) return;
    
    try {
      await CompanyService.update(editingCompany.id, data);
      setCompanies(companies.map(c => 
        c.id === editingCompany.id ? { ...c, ...data } : c
      ));
      setEditingCompany(null);
    } catch (error) {
      console.error('Error al actualizar empresa:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta empresa?')) return;
    
    try {
      await CompanyService.delete(id);
      setCompanies(companies.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error al eliminar empresa:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl font-semibold text-gray-600">Cargando empresas...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Panel de Administración EyeBek</h1>
          <p className="text-gray-600">Gestiona las empresas registradas en el sistema</p>
        </div>

        <div className="mb-6 bg-white rounded-xl shadow p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Building2 className="text-blue-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-900">{companies.length}</p>
              <p className="text-sm text-gray-600">Empresas registradas</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Users className="text-green-600" size={24} />
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {companies.reduce((sum, c) => sum + c.employees, 0)}
              </p>
              <p className="text-sm text-gray-600">Total empleados</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <CompanyCard
              key={company.id}
              company={company}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {companies.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-xl text-gray-600">No hay empresas registradas</p>
          </div>
        )}
      </div>

      {editingCompany && (
        <EditCompanyModal
          company={editingCompany}
          onClose={() => setEditingCompany(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
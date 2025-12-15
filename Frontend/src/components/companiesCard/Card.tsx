"use client";
import React from "react";
import { Building2, Users, CreditCard, TrendingUp, Trash2, Edit } from "lucide-react";
import GenericButton from "@/components/GenericButton/GenericButton";
import { Company } from "@/types/company";

interface CompanyCardProps {
  company: Company;
  onEdit: (company: Company) => void;
  onDelete: (id: string) => void;
}

const CompanyCard = ({ company, onEdit, onDelete }: CompanyCardProps) => {
  const planTone = "bg-gray-50 text-gray-700"; // sobrio para todas las planillas

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 transition-shadow duration-200 border border-gray-100 hover:shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-4">

          <div>
            <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
            <p className="text-sm text-gray-500">{company.industry}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
          <div className="p-2 rounded-md bg-white/60">
            <Users className="text-gray-600" size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{company.employees}</p>
            <p className="text-xs text-gray-500">Empleados</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
          <div className="p-2 rounded-md bg-white/60">
            <TrendingUp className="text-gray-600" size={20} />
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{company.activeUsers}</p>
            <p className="text-xs text-gray-500">Activos</p>
          </div>
        </div>
      </div>

      <div className="space-y-3 pt-3 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="text-gray-500" size={16} />
            <span className="text-sm font-medium text-gray-700">Plan</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${planTone}`}>
            {company.plan}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="text-gray-500" size={16} />
            <span className="text-sm font-medium text-gray-700">Vinculada desde</span>
          </div>
          <span className="text-sm text-gray-600">{company.linkedSince}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold text-gray-900">{company.admin.name}</p>
            <p className="text-xs text-gray-500">{company.admin.role}</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 flex items-center gap-2">
            <GenericButton
              textButton="Editar"
              type="button"
              onClick={() => onEdit(company)}
              size="full"
              variant="black"
              className="flex-1"
            />
          </div>

          <div className="flex-1 flex items-center gap-2">
            <GenericButton
              textButton="Eliminar"
              type="button"
              onClick={() => onDelete(company.id)}
              size="full"
              variant="white"
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;

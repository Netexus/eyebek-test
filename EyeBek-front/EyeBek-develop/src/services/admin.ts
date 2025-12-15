import { Company } from '@/types/company';

const initialCompanies: Company[] = [
  {
    id: '1',
    name: "TechCorp SA",
    industry: "Tecnología",
    description: "Empresa de desarrollo de software",
    employees: 245,
    activeUsers: 238,
    plan: "Enterprise",
    linkedSince: "Ene 2024",
    admin: {
      name: "Carlos Rodríguez",
      role: "Director de Recursos Humanos"
    }
  },
  {
    id: '2',
    name: "InnovateLab",
    industry: "Consultoría",
    description: "Consultoría empresarial",
    employees: 87,
    activeUsers: 82,
    plan: "Professional",
    linkedSince: "Mar 2024",
    admin: {
      name: "María González",
      role: "Gerente de Operaciones"
    }
  },
  {
    id: '3',
    name: "StartUp Hub",
    industry: "Coworking",
    description: "Espacio de coworking",
    employees: 42,
    activeUsers: 40,
    plan: "Basic",
    linkedSince: "May 2024",
    admin: {
      name: "Pedro Sánchez",
      role: "Community Manager"
    }
  }
];

export const CompanyService = {
  getAll: (): Promise<Company[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...initialCompanies]);
      }, 500);
    });
  },
  
  update: (id: string, data: Partial<Company>): Promise<Company> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updated = { ...initialCompanies.find(c => c.id === id)!, ...data };
        resolve(updated);
      }, 500);
    });
  },
  
  delete: (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 500);
    });
  }
};
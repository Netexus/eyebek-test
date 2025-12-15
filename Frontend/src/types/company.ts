export interface Company {
  id: string;
  name: string;
  industry: string;
  description: string;
  employees: number;
  activeUsers: number;
  plan: string;
  linkedSince: string;
  admin: {
    name: string;
    role: string;
  };
}
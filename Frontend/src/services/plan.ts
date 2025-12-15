import apiClient from './apiClient';
import { Plan } from '@/types/plan.types';

class PlanService {
    /**
     * Get all available plans
     */
    async getAll(): Promise<Plan[]> {
        const response = await apiClient.get<Plan[]>('/plans');
        return Array.isArray(response) ? response : [];
    }

    /**
     * Get a specific plan by ID
     */
    async getById(id: string): Promise<Plan | null> {
        const plans = await this.getAll();
        return plans.find(plan => plan.id === id) || null;
    }

    /**
     * Get active plans only
     */
    async getActive(): Promise<Plan[]> {
        const plans = await this.getAll();
        return plans.filter(plan => plan.active);
    }
}

export const planService = new PlanService();
export default planService;

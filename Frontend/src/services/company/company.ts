import apiClient from '../apiClient';
import { authService } from '../authService';

export interface CompanyUpdateRequest {
    name?: string;
    phone?: string;
    address?: string;
}

class CompanyService {
    /**
     * Get current authenticated company data (or SuperAdmin if no token)
     */
    async getMe(): Promise<any> {
        try {
            const headers = authService.getAuthHeaders();
            const response = await apiClient.get('/companies/me', { headers });
            return response;
        } catch (error) {
            console.error('Error getting company:', error);
            throw error;
        }
    }

    /**
     * Update current authenticated company data
     */
    async updateMe(data: CompanyUpdateRequest): Promise<any> {
        try {
            const headers = authService.getAuthHeaders();
            const response = await apiClient.put('/companies/me', data, { headers });
            return response;
        } catch (error) {
            console.error('Error updating company:', error);
            throw error;
        }
    }
}

export const companyService = new CompanyService();
export default companyService;

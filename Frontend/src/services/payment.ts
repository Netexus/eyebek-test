import apiClient from './apiClient';
import { PaymentCreateRequest, Payment, PaymentResponse, PaymentHistoryResponse } from '@/types/payment.types';
import { authService } from './authService';

class PaymentService {
    /**
     * Create a new payment and apply plan to company
     */
    async create(data: PaymentCreateRequest): Promise<PaymentResponse> {
        const headers = authService.getAuthHeaders();
        const response = await apiClient.post<PaymentResponse>(
            '/payments',
            data,
            { headers }
        );
        return response;
    }

    /**
     * Get payment history for the authenticated company
     */
    async getHistory(): Promise<Payment[]> {
        const headers = authService.getAuthHeaders();
        const response = await apiClient.get<PaymentHistoryResponse>(
            '/payments/history',
            { headers }
        );
        return response.payments || [];
    }
}

export const paymentService = new PaymentService();
export default paymentService;

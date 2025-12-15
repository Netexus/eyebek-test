import { PaymentStatus } from './enums';

export interface PaymentCreateRequest {
    planId: string;
    amount: number;
    paymentMethod: string;
    paymentReference?: string;
    receipt?: string;
}

export interface Payment {
    id: string;
    companyId: string;
    planId: string;
    amount: number;
    paymentMethod: string;
    paymentStatus: PaymentStatus;
    paymentReference?: string;
    receipt?: string;
    paymentDate: Date;
    createdAt: Date;
}

export interface PaymentResponse {
    message: string;
    companyId: string;
}

export interface PaymentHistoryResponse {
    companyId: string;
    payments: Payment[];
}

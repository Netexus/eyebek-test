export interface User {
    id: string;
    email: string;
    name: string;
    role: 'SUPER_ADMIN' | 'COMPANY';
    companyId?: string;
}

export interface AuthSession {
    user: User;
    token: string;
}

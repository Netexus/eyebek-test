import { UserRole, UserStatus } from './enums';

export interface UserCreateRequest {
    name: string;
    document: string;
    email: string;
    phone: string;
    role?: UserRole;
    photo?: string;
    facialEmbedding?: number[];
}

export interface User {
    id: string;
    companyId: string;
    name: string;
    email: string;
    document: string;
    role: UserRole;
    status: UserStatus;
    phone: string;
    photo?: string;
    facialEmbedding?: number[];
    createdAt: Date;
    updatedAt: Date;
}

export interface UserListResponse {
    message?: string;
    companyId: string;
    users: User[];
}

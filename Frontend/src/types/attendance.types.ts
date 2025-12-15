import { AttendanceType, AttendanceMethod, AttendanceStatus } from './enums';

export interface AttendanceCreateRequest {
    userId: string;
    type: AttendanceType;
    method: AttendanceMethod;
    confidence?: number;
    capturePhoto?: string;
    latitude?: number;
    longitude?: number;
    status: AttendanceStatus;
}

export interface AttendanceListItem {
    id: string;
    userId: string;
    userName: string;
    timestamp: Date;
    type: AttendanceType;
    method: AttendanceMethod;
    status: AttendanceStatus;
    confidence?: number;
    capturePhoto?: string;
}

export interface AttendanceResponse {
    message: string;
}

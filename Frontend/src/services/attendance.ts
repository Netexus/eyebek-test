import apiClient from './apiClient';
import { AttendanceCreateRequest, AttendanceListItem, AttendanceResponse } from '@/types/attendance.types';
import { authService } from './authService';

class AttendanceService {
    /**
     * Register a new attendance record (check-in or check-out)
     */
    async register(data: AttendanceCreateRequest): Promise<AttendanceResponse> {
        const headers = authService.getAuthHeaders();
        const response = await apiClient.post<AttendanceResponse>(
            '/attendance',
            data,
            { headers }
        );
        return response;
    }

    /**
     * Get all attendance records for the authenticated company
     */
    async getAll(): Promise<AttendanceListItem[]> {
        const headers = authService.getAuthHeaders();
        const response = await apiClient.get<AttendanceListItem[]>(
            '/attendance',
            { headers }
        );
        return Array.isArray(response) ? response : [];
    }

    /**
     * Check in with facial recognition
     */
    async checkInWithFacial(userId: string, capturePhoto: string, latitude?: number, longitude?: number): Promise<AttendanceResponse> {
        return this.register({
            userId,
            type: 0, // CheckIn
            method: 0, // Facial
            capturePhoto,
            latitude,
            longitude,
            status: 1 // Pending (will be approved/rejected by backend)
        });
    }

    /**
     * Check out with facial recognition
     */
    async checkOutWithFacial(userId: string, capturePhoto: string, latitude?: number, longitude?: number): Promise<AttendanceResponse> {
        return this.register({
            userId,
            type: 1, // CheckOut
            method: 0, // Facial
            capturePhoto,
            latitude,
            longitude,
            status: 1 // Pending
        });
    }

    /**
     * Manual check in (no facial recognition)
     */
    async checkInManual(userId: string): Promise<AttendanceResponse> {
        return this.register({
            userId,
            type: 0, // CheckIn
            method: 1, // Manual
            status: 0 // Approved
        });
    }

    /**
     * Manual check out (no facial recognition)
     */
    async checkOutManual(userId: string): Promise<AttendanceResponse> {
        return this.register({
            userId,
            type: 1, // CheckOut
            method: 1, // Manual
            status: 0 // Approved
        });
    }
}

export const attendanceService = new AttendanceService();
export default attendanceService;

import apiClient from './apiClient';
import { UserCreateRequest, User, UserListResponse } from '@/types/user.types';
import { authService } from './authService';

class UserService {
  /**
   * Create a new user for the authenticated company
   */
  async create(data: UserCreateRequest): Promise<User> {
    const headers = authService.getAuthHeaders();
    const response = await apiClient.post<any>('/users', data, { headers });

    // Backend returns placeholder, extract user from response
    return response.user || data as any;
  }

  /**
   * Get all users for the authenticated company
   */
  async getAll(): Promise<User[]> {
    const headers = authService.getAuthHeaders();
    const response = await apiClient.get<UserListResponse>('/users', { headers });

    // Backend returns { message, companyId, users }
    return response.users || [];
  }
}

export const userService = new UserService();
export default userService;
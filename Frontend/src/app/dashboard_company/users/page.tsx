"use client";

import { useState } from 'react';
import UserList from '@/components/users/UserList';
import CreateUserForm from '@/components/users/CreateUserForm';

export default function UsersPage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleUserCreated = () => {
        // Trigger refresh of user list
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <CreateUserForm onUserCreated={handleUserCreated} />
                    </div>

                    <div className="lg:col-span-2">
                        <UserList key={refreshKey} />
                    </div>
                </div>
            </div>
        </div>
    );
}

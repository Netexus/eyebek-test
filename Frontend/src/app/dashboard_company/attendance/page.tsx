"use client";

import { useState } from 'react';
import AttendanceList from '@/components/attendance/AttendanceList';
import AttendanceCheckIn from '@/components/attendance/AttendanceCheckIn';

export default function AttendancePage() {
    const [refreshKey, setRefreshKey] = useState(0);

    const handleAttendanceRecorded = () => {
        // Trigger refresh of attendance list
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Attendance Tracking</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                        <AttendanceCheckIn onAttendanceRecorded={handleAttendanceRecorded} />
                    </div>

                    <div className="lg:col-span-2">
                        <AttendanceList key={refreshKey} />
                    </div>
                </div>
            </div>
        </div>
    );
}

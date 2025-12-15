"use client";

import { useState, useEffect } from 'react';
import { attendanceService } from '@/services';
import { AttendanceListItem } from '@/types/attendance.types';
import { AttendanceType, AttendanceMethod, AttendanceStatus } from '@/types/enums';

export default function AttendanceList() {
    const [attendances, setAttendances] = useState<AttendanceListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAttendances();
    }, []);

    const loadAttendances = async () => {
        try {
            setLoading(true);
            const data = await attendanceService.getAll();
            setAttendances(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error loading attendance records');
            console.error('Error loading attendances:', err);
        } finally {
            setLoading(false);
        }
    };

    const getTypeName = (type: AttendanceType): string => {
        return type === AttendanceType.CheckIn ? 'Check In' : 'Check Out';
    };

    const getMethodName = (method: AttendanceMethod): string => {
        switch (method) {
            case AttendanceMethod.Facial: return 'Facial';
            case AttendanceMethod.Manual: return 'Manual';
            case AttendanceMethod.QR: return 'QR Code';
            default: return 'Unknown';
        }
    };

    const getStatusName = (status: AttendanceStatus): string => {
        switch (status) {
            case AttendanceStatus.Approved: return 'Approved';
            case AttendanceStatus.Pending: return 'Pending';
            case AttendanceStatus.Rejected: return 'Rejected';
            default: return 'Unknown';
        }
    };

    const formatDate = (date: Date): string => {
        return new Date(date).toLocaleString();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    return (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">Attendance Records</h2>
                <button
                    onClick={loadAttendances}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    Refresh
                </button>
            </div>

            {attendances.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                    No attendance records found.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Method
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Confidence
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Timestamp
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {attendances.map((attendance) => (
                                <tr key={attendance.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {attendance.userName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${attendance.type === AttendanceType.CheckIn ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                            {getTypeName(attendance.type)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getMethodName(attendance.method)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${attendance.status === AttendanceStatus.Approved ? 'bg-green-100 text-green-800' :
                                                attendance.status === AttendanceStatus.Pending ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'}`}>
                                            {getStatusName(attendance.status)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {attendance.confidence ? `${(attendance.confidence * 100).toFixed(0)}%` : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(attendance.timestamp)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

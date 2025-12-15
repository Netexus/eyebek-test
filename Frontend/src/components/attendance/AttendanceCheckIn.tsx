"use client";

import { useState } from 'react';
import { attendanceService } from '@/services';
import { AttendanceType } from '@/types/enums';

interface AttendanceCheckInProps {
    onAttendanceRecorded?: () => void;
}

export default function AttendanceCheckIn({ onAttendanceRecorded }: AttendanceCheckInProps) {
    const [userId, setUserId] = useState('');
    const [checkType, setCheckType] = useState<'in' | 'out'>('in');
    const [method, setMethod] = useState<'facial' | 'manual'>('manual');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId.trim()) {
            setError('User ID is required');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            if (method === 'facial') {
                // Simulate facial recognition - in production, this would capture from webcam
                const mockPhoto = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';

                if (checkType === 'in') {
                    await attendanceService.checkInWithFacial(userId, mockPhoto);
                } else {
                    await attendanceService.checkOutWithFacial(userId, mockPhoto);
                }
            } else {
                // Manual check-in/out
                if (checkType === 'in') {
                    await attendanceService.checkInManual(userId);
                } else {
                    await attendanceService.checkOutManual(userId);
                }
            }

            setSuccess(true);
            setUserId('');

            if (onAttendanceRecorded) {
                onAttendanceRecorded();
            }

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err.message || 'Error recording attendance');
            console.error('Error recording attendance:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Record Attendance</h2>

            {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                    Attendance recorded successfully!
                </div>
            )}

            {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                        User ID *
                    </label>
                    <input
                        type="text"
                        id="userId"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        required
                        placeholder="Enter user ID"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        Enter the user's ID to record attendance
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Check Type
                    </label>
                    <div className="flex space-x-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="in"
                                checked={checkType === 'in'}
                                onChange={(e) => setCheckType(e.target.value as 'in')}
                                className="mr-2"
                            />
                            <span className="text-sm">Check In</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="out"
                                checked={checkType === 'out'}
                                onChange={(e) => setCheckType(e.target.value as 'out')}
                                className="mr-2"
                            />
                            <span className="text-sm">Check Out</span>
                        </label>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Method
                    </label>
                    <div className="flex space-x-4">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="manual"
                                checked={method === 'manual'}
                                onChange={(e) => setMethod(e.target.value as 'manual')}
                                className="mr-2"
                            />
                            <span className="text-sm">Manual</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="facial"
                                checked={method === 'facial'}
                                onChange={(e) => setMethod(e.target.value as 'facial')}
                                className="mr-2"
                            />
                            <span className="text-sm">Facial Recognition</span>
                        </label>
                    </div>
                </div>

                {method === 'facial' && (
                    <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
                        <strong>Note:</strong> Facial recognition will use a simulated photo.
                        In production, this would capture from your webcam and send to the facial recognition API.
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
            ${checkType === 'in'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-orange-600 hover:bg-orange-700'}
            disabled:bg-gray-400 disabled:cursor-not-allowed`}
                >
                    {loading ? 'Recording...' : `${checkType === 'in' ? 'Check In' : 'Check Out'}`}
                </button>
            </form>
        </div>
    );
}

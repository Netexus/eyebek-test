"use client"
import GenericButton from '@/components/GenericButton/GenericButton'
import FacialRecognitionButton from '@/components/recognition/FacialRecognitionButton'
import { Pencil, Trash, UserCircle } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    document: string;
    phone?: string;
    photo?: string;
}

interface CompanyData {
    id: string;
    name: string;
    email: string;
    status: string;
    planId?: string;
    planStartDate?: string;
    planEndDate?: string;
    currentUsers: number;
}

interface Plan {
    id: string;
    category: string;
    userCapacity: number;
}

export default function CompanyDashboard() {
    const { data: session } = useSession();
    const [company, setCompany] = useState<CompanyData | null>(null);
    const [plan, setPlan] = useState<Plan | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!session) return;

            try {
                const token = (session as any)?.accessToken;

                const companyRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/me`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (companyRes.ok) {
                    const companyData = await companyRes.json();
                    setCompany(companyData);

                    if (companyData.planId) {
                        const planRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/plans/${companyData.planId}`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (planRes.ok) {
                            setPlan(await planRes.json());
                        }
                    }
                }

                const usersRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (usersRes.ok) {
                    setUsers(await usersRes.json());
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [session]);

    const activeUsers = users.filter(u => u.status === 'Active').length;
    const maxUsers = plan?.userCapacity || 0;
    const remainingSlots = maxUsers - users.length;
    const remainingDays = company?.planEndDate
        ? Math.max(0, Math.ceil((new Date(company.planEndDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
        : 0;

    if (loading) return <div className="p-6">Cargando...</div>;

    return (
        <>
            <section className='p-6 flex flex-col gap-6'>
                <div className='bg-white shadow-sm rounded-xl p-6 flex justify-between'>
                    <p className='text-2xl font-bold text-gray-900'>
                        Tienes <span className='text-white bg-black rounded-md p-1'>{remainingSlots}</span> cupos disponibles para empleados
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                        {activeUsers} empleados <span className='text-white bg-black rounded-md p-1'>Activos</span>
                    </p>
                    <p className='text-2xl font-bold text-gray-900'>
                        Quedan <span className='text-white bg-black rounded-md p-1'>{remainingDays}</span> días de plan
                    </p>
                </div>

                <div className='bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm rounded-xl p-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <div>
                            <h3 className='text-xl font-bold text-gray-900 mb-2'>Control de Asistencia</h3>
                            <p className='text-gray-600'>Selecciona un empleado para registrar su asistencia mediante reconocimiento facial</p>
                        </div>
                    </div>

                    {users.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-lg border-2 border-dashed border-gray-300">
                            <UserCircle className='w-16 h-16 text-gray-400 mx-auto mb-3' />
                            <p className="text-gray-600 font-medium">No hay empleados registrados</p>
                            <p className="text-gray-500 text-sm mt-1">Crea tu primer empleado para comenzar</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {users.map(user => (
                                <div key={user.id} className='bg-white rounded-lg p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow'>
                                    <div className='flex items-center gap-3 mb-3'>
                                        {user.photo ? (
                                            <img src={user.photo} alt={user.name} className='w-12 h-12 rounded-full object-cover' />
                                        ) : (
                                            <UserCircle className='w-12 h-12 text-gray-400' />
                                        )}
                                        <div className='flex-1 min-w-0'>
                                            <p className='font-bold text-gray-900 truncate'>{user.name}</p>
                                            <p className='text-sm text-gray-600 truncate'>{user.email}</p>
                                        </div>
                                    </div>

                                    <div className='flex items-center justify-between'>
                                        <span className={`text-xs px-2 py-1 rounded-full ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {user.status}
                                        </span>

                                        {user.photo && user.status === 'Active' ? (
                                            <FacialRecognitionButton userId={user.id} userName={user.name} />
                                        ) : (
                                            <span className='text-xs text-gray-500'>{!user.photo ? 'Sin foto' : 'Inactivo'}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='flex mt-10 justify-end'>
                    <GenericButton textButton="Crear usuario" variant="black" size="none" type="button" className="w-[200px]" />
                </div>

                <div>
                    <div className="bg-white shadow-sm rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Administradores</h2>
                            <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                {users.filter(u => u.role === 'Admin').length} users
                            </span>
                        </div>

                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-500">
                                    <th className="py-3"><input type="checkbox" /></th>
                                    <th className="py-3">Name</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Role</th>
                                    <th className="py-3">Email address</th>
                                    <th className="py-3">Teams</th>
                                    <th className="py-3">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm text-gray-700">
                                {users.filter(u => u.role === 'Admin').map(user => (
                                    <tr key={user.id} className="border-t">
                                        <td className="py-4"><input type="checkbox" /></td>
                                        <td className="py-4">
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-gray-500">@{user.email.split('@')[0]}</p>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`flex items-center font-medium gap-1 ${user.status === 'Active' ? 'text-green-600' : 'text-gray-600'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
                                                    }`}></span>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4">{user.role}</td>
                                        <td className="py-4">{user.email}</td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-lg">Admin</span>
                                        </td>
                                        <td className="py-4 text-gray-400">
                                            <div className='flex gap-3'>
                                                <button><Pencil size={18} /></button>
                                                <button><Trash size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <div className="bg-white shadow-sm rounded-xl p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Empleados</h2>
                            <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                {users.filter(u => u.role === 'Employee').length} users
                            </span>
                        </div>

                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-500">
                                    <th className="py-3"><input type="checkbox" /></th>
                                    <th className="py-3">Name</th>
                                    <th className="py-3">Status</th>
                                    <th className="py-3">Role</th>
                                    <th className="py-3">Email address</th>
                                    <th className="py-3">Teams</th>
                                    <th className="py-3">Acciones</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm text-gray-700">
                                {users.filter(u => u.role === 'Employee').map(user => (
                                    <tr key={user.id} className="border-t">
                                        <td className="py-4"><input type="checkbox" /></td>
                                        <td className="py-4">
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-gray-500">@{user.email.split('@')[0]}</p>
                                            </div>
                                        </td>
                                        <td className="py-4">
                                            <span className={`flex items-center font-medium gap-1 ${user.status === 'Active' ? 'text-green-600' : 'text-gray-600'
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
                                                    }`}></span>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="py-4">{user.role}</td>
                                        <td className="py-4">{user.email}</td>
                                        <td className="py-4">
                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg">Employee</span>
                                        </td>
                                        <td className="py-4 text-gray-400">
                                            <div className='flex gap-3'>
                                                <button><Pencil size={18} /></button>
                                                <button><Trash size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </>
    )
}

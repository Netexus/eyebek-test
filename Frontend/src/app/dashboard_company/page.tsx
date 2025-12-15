"use client"
import GenericButton from '@/components/GenericButton/GenericButton'
import { Pencil, Trash } from 'lucide-react'
import React from 'react'


export const page = () => {
    return (

        <>
            <section className='p-6 flex flex-col gap-6'>


                <div className='bg-white shadow-sm rounded-xl p-6 flex justify-between'>
                    <p className='text-2xl font-bold text-gray-900'>Tienes <span className='text-white bg-black rounded-md p-1'>6</span> cupos disponibles para empleados</p>
                    <p className='text-2xl font-bold text-gray-900'>28 empleados <span className='text-white bg-black rounded-md p-1'>Activos</span></p>
                    <p className='text-2xl font-bold text-gray-900'>Quedan <span className='text-white bg-black rounded-md p-1'>25</span> días de plan</p>

                </div>
                <div className=' flex mt-10 justify-end  '>
                    <GenericButton textButton="Crear usuario"  variant="black" size="none" type="button" className="w-[200px]" />
                </div>
                <div>
                    <div className="">
                        <div className="bg-white shadow-sm rounded-xl p-6">

                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Administradores</h2>
                                <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">100 users</span>
                            </div>

                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-500">
                                        <th className="py-3"><input type="text" /></th>
                                        <th className="py-3">Name</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3">Role</th>
                                        <th className="py-3">Email address</th>
                                        <th className="py-3">Teams</th>
                                        <th className="py-3">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody className="text-sm text-gray-700">

                                    <tr className="bg-white shadow-sm rounded-lg">
                                        <td className="py-4"><input type="text" /></td>

                                        <td className="py-4 flex items-center gap-3">

                                            <div>
                                                <p className="font-medium">Olivia Rhye</p>
                                                <p className="text-gray-500">@olivia</p>
                                            </div>
                                        </td>

                                        <td className="py-4">
                                            <span className="flex items-center text-green-600 font-medium gap-1">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Active
                                            </span>
                                        </td>

                                        <td className="py-4">Product Designer</td>

                                        <td className="py-4">olivia@untitledui.com</td>

                                        <td className="py-4 flex gap-2">
                                            <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-lg">Design</span>
                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg">Product</span>
                                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-lg">Marketing</span>
                                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg">+4</span>
                                        </td>

                                        <td className="py-4 text-gray-400">
                                            <div className='flex gap-3'>
                                                <button><Pencil/></button>
                                                <button><Trash/></button>
                                            </div>
                                        </td>
                                    </tr>


                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="">
                        <div className="bg-white shadow-sm rounded-xl p-6">

                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">Empleados</h2>
                                <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-full">100 users</span>
                            </div>

                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-sm text-gray-500">
                                        <th className="py-3"><input type="text" /></th>
                                        <th className="py-3">Name</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3">Role</th>
                                        <th className="py-3">Email address</th>
                                        <th className="py-3">Teams</th>
                                        <th className="py-3">Acciones</th>
                                    </tr>
                                </thead>

                                <tbody className="text-sm text-gray-700">

                                    <tr className="bg-white shadow-sm rounded-lg">
                                        <td className="py-4"><input type="text" /></td>

                                        <td className="py-4 flex items-center gap-3">

                                            <div>
                                                <p className="font-medium">Olivia Rhye</p>
                                                <p className="text-gray-500">@olivia</p>
                                            </div>
                                        </td>

                                        <td className="py-4">
                                            <span className="flex items-center text-green-600 font-medium gap-1">
                                                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                                Active
                                            </span>
                                        </td>

                                        <td className="py-4">Product Designer</td>

                                        <td className="py-4">olivia@untitledui.com</td>

                                        <td className="py-4 flex gap-2">
                                            <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-600 rounded-lg">Design</span>
                                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-lg">Product</span>
                                            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-lg">Marketing</span>
                                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg">+4</span>
                                        </td>

                                        <td className="py-4 text-gray-400">
                                            <div className='flex gap-3'>
                                                <button><Pencil/></button>
                                                <button><Trash/></button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>


        </>
    )
}

export default page

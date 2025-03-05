"use client"
import { useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { Input, Button, IconButton } from "@/once-ui/components";

interface Order {
    orderId: number;
    patientRut: string;
    patientName: string;
    patientPaterno: string;
    patientMaterno: string;
    date: string;
    state: "pending" | "processing" | "completed";
    labName: string;
}

interface Lab {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    rut: string;
    orders: Order[];
    remainingOrders: number;
}

interface LabsTableProps {
    labs: Lab[];
}

export default function LabsTable({ labs }: LabsTableProps) {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    const filteredLabs = labs.filter(lab => lab.name.toLowerCase().includes(search.toLowerCase()));
    const paginatedLabs = filteredLabs.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    const totalPages = Math.ceil(filteredLabs.length / itemsPerPage);

    return (
        <div className="relative overflow-x-auto rounded-2xl bg-white shadow-md p-4 gap-4 flex flex-col">
            <div className="flex justify-between mb-4">
                <Input 
                label="Buscar laboratorio"
                id="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <table className="w-full rounded-2xl text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                    <tr>
                        <th className="px-6 py-3">RUT</th>
                        <th className="px-6 py-3">Laboratorio</th>
                        <th className="px-6 py-3">Órdenes Totales</th>
                        <th className="px-6 py-3">Órdenes Restantes</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedLabs.map((lab) => (
                        <tr key={lab.id} className="bg-white border-b border-gray-200">
                            <td className="px-6 py-4">{lab.rut}</td>
                            <td className="px-6 py-4">{lab.name}</td>
                            <td className="px-6 py-4">{lab.orders.length}</td>
                            <td className="px-6 py-4 w-28">
                                <div className="w-full bg-gray-200 rounded-full h-2.5 relative">
                                    <div
                                        className="bg-blue-500 h-2.5 rounded-full"
                                        style={{ width: `${(lab.remainingOrders / lab.orders.length)}%` }}
                                    ></div>
                                    <span className="bg-gray-500 h-2.5 rounded-full w-full absolute left-0 top-0 -z-10"
                                    ></span>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-4 flex justify-center gap-8 items-center">
                <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Anterior</Button>
                <span>Página {page} de {totalPages}</span>
                <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Siguiente</Button>
            </div>
        </div>
    );
}

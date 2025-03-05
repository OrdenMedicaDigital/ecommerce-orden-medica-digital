import { getOrderById, getOrdersByFilter } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req:NextRequest) => {
    const {name, startDate, endDate,labId} = await req.json();
    const orders = await getOrdersByFilter(labId,name, startDate, endDate);
    const mappedOrders = await Promise.all(orders.map(async order => {
        const data = await getOrderById(order.orderId);
        return {
            orderId: data?.orderId,
            patientName: data?.patient.name,
            patientPaterno: data?.patient.paterno,
            patientMaterno: data?.patient.materno,
            date: data?.orderDate,
            state: order.state,
            exams: data?.exams
        }
    }))
    return NextResponse.json(mappedOrders)
}
import { createOrder, getAllOrders, getOrderById } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";



export const POST = async (req:NextRequest) => {
    const {labId} = await req.json()
    const orders = await getAllOrders(labId);
    const mappedOrders = await Promise.all(orders.map(async order => {
        const data = await getOrderById(order.orderId);
        return {
            orderId: data?.orderId,
            patientName: data?.patient.name,
            patientPaterno: data?.patient.paterno,
            patientMaterno: data?.patient.materno,
            date: data?.orderDate,
            state: order.orderState,
            exams: data?.exams
    }}))
    return NextResponse.json(mappedOrders);
}
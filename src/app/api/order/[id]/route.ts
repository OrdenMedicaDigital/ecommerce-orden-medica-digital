import { getOrderById, updateStateOrder } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest,{ params }: { params: Promise<{ id: string }> }) => {
    const id = Number((await params).id);
    const order = await getOrderById(id);
    return order ? NextResponse.json(order) : new NextResponse("No encontrado",{
        status: 404
    });
}

export const PATCH = async (req: NextRequest,{ params }: { params: Promise<{ id: string }> }) => {
    const {state} = await req.json()
    const id = Number((await params).id);
    await updateStateOrder(id,state);
    return new NextResponse("Estado actualizado",{status:200});
}
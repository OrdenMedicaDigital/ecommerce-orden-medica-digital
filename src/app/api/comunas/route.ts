import { getComunas } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const {regionId} = await req.json();
    const comunas = await getComunas(regionId);
    return NextResponse.json(comunas);
}
import { getRegiones } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const regiones = await getRegiones()
    return NextResponse.json(regiones)
}
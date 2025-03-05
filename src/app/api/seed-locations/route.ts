import { insertRegionesYComunas } from "@/db/location-data";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.json();
        
        if (!data || !data.regiones || !Array.isArray(data.regiones)) {
            return NextResponse.json(
                { error: "Formato de datos inválido" },
                { status: 400 }
            );
        }
        
        const result = await insertRegionesYComunas(data);
        
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error al insertar regiones y comunas:", error);
        return NextResponse.json(
            { error: "Error al procesar la solicitud", details: (error as Error).message },
            { status: 500 }
        );
    }
}
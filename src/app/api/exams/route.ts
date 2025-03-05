import { db, getAllExams } from "@/db/queries"
import { exams } from "@/db/schema"
import { NextRequest, NextResponse } from "next/server"

export const GET = async () => {
    return NextResponse.json(await getAllExams())
}

export const POST = async (req:NextRequest) => {
    const { code, name, description } = await req.json()
    await db.insert(exams).values({
        code,name,description
    })
    return NextResponse.json({message:"Examen creado correctamente"})
}
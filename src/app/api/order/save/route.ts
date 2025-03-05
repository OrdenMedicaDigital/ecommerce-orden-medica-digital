import { createOrder } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req:NextRequest) => {
    try{
    const {patient,exams,labId,date} : {
        patient: Patient,
        exams: Exam[],
        labId: number,
        date: string
    } = await req.json();
    console.log(labId)
    const {id} = await createOrder({
        ...patient,
        labId: labId,
        countryId:1,
        region: patient.region.name,
        comuna: patient.comuna.name,
    }, exams.map(exam => exam.code),date);
    return NextResponse.json({message: "Orden creada con exito", id});
    }catch(e){
        if(e instanceof Error){
        return NextResponse.json({message: "Error creating order", error: e.message},{
            status:500
        });
    }
    }
}
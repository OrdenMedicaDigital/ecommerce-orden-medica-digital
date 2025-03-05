import api from "@/api";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const { planId, labId } = await req.json();
    const url =await api.message.payPlan({
        planId,
        labId
      })
    return NextResponse.json({url})
}
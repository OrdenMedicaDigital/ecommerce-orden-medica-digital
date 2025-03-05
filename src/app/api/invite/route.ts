import EmailMessage from "@/components/EmailMessage"
import { NextRequest, NextResponse } from "next/server"
import {Resend} from "resend"

export const POST = async (req:NextRequest) => {
    const {email} = await req.json()
    const resend = new Resend(process.env.RESEND_APIKEY)

    const response = await resend.emails.send({
        from: "Invitacion <noreply@ordenmedica.digital>",
        to:[email],
        subject: "Invitación a Orden Médica Digital",
        react:EmailMessage()
    })
    console.log(response)

    return NextResponse.json({
        email,
        success:true
    })
}
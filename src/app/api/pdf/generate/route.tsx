import { NextRequest, NextResponse } from "next/server"


const templateId = "36e0a1f19a0c1fac40cd13d7e83fbd897fa51626a954b337b6279ac6b4906b20"

export const POST = async (req:NextRequest) => {
    const {data} = await req.json()
    const res = await fetch(`http://209.46.120.43:4000/render/${templateId}`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({data,convertTo:"pdf"})
    })
    const result = await res.json()
    return NextResponse.json(result)
}
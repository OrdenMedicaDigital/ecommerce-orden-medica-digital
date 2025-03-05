import { NextRequest } from "next/server"

export const GET = async (req: NextRequest) => {
    const pdf = req.nextUrl.searchParams.get("pdf")
    const res = await fetch("http://209.46.120.43:4000/render/"+pdf)
    return new Response(res.body,{
        headers: {
            "Content-Type": "application/pdf"
        }
    })
}
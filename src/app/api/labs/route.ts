import { createLab, createUser, db } from "@/db/queries";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/nextauth";

import { labs } from "@/db/schema";
import { eq } from "drizzle-orm";

export const POST = async (req: NextRequest) => {
    const {lab, users} = await req.json();
    const labId  = await createLab(lab);
    const promises = users.map(async (user:{
        email:string,
        password:string,
        rol: "Admin" | "Recepcionista" | "Gerente General"
    }) => {
        const hash = bcrypt.hashSync(user.password, 10);
        const userId = await createUser({email:user.email,password:hash,role:user.rol},labId);
    });
    await Promise.all(promises);
    return NextResponse.json({message: "Lab created", labId});
}

export const GET = async () => {
    const session = await getServerSession(authOptions);
    const labId = session?.user.labId;
    const [lab] = await db.select().from(labs).where(eq(labs.id,Number(labId))).limit(1);
    return NextResponse.json(lab);
}
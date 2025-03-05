import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { AuthOptions } from "next-auth";
import { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import { db, getUser } from "./db/queries";
import { admins, labs } from "./db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

export const authOptions : AuthOptions = {
    session:{
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    adapter: DrizzleAdapter(db) as Adapter,
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                password: {  label: "Password", type: "password" },
                email: { label: "Email", type: "text" }
            },
            async authorize(credentials) {
                if(!credentials){
                    return null
                }
                const admin = (await db.select().from(admins).where(eq(admins.email,credentials.email)).limit(1))[0]
                if(admin && await bcrypt.compare(credentials.password,admin.password)){
                    return {
                        id: admin.id.toString(),
                        email: admin.email,
                        role: "MainAdmin",
                        labId: 0,
                    }
                }
                const [user] = await getUser(credentials.email);
                const labResult = await db.select().from(labs).where(eq(labs.id, user.labId)).limit(1);
                const lab = labResult[0];
                if(!user){
                    return null;
                }
                if(await bcrypt.compare(credentials.password,user.password)){
                    return {
                        id: user.id.toString(),
                        email: user.email,
                        role: user.role,
                        labId: user.labId,
                        name: user.email,
                        labType: lab.type,
                    };
                }else{
                    return null
                }
            }
        })
    ],
    pages:{
        signIn: "/",
    },
    callbacks:{
        async jwt({token, user}) {
            if (user) {
              token.id = user.id;
              token.email = user.email;
              token.role = user.role;
              token.labId = user.labId;
              token.labType = user.labType;
              return token;
            }
            return token;
        },
          async session({ session, token }) {
            session.user = token;
            return session;
          },
    }
  }
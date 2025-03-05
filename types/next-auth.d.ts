import { JWT } from "next-auth/jwt"
import { User } from "next-auth/jwt"
import { Session } from "next-auth/jwt"
import { AdapterUser } from "next-auth/jwt"

declare module "next-auth/jwt" {
  interface JWT {
    id:number | string,
    role:string,
    email:string,
    labId:number
  }
}


declare module "next-auth" {
    /**
     * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session {
      user: User
    }

    interface User{
        id: number | string;
        email: string;
        role: string;
        labId: number;
        labType?: string;
    }

    interface AdapterUser {
        id: number | string;
        email: string;
        role: string;
        labId: number;
        labType?: string;
    }
  }
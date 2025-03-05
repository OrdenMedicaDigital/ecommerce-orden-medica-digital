"use client"
import Main from "@/components/Main";
import { Sidebar } from "@/once-ui/modules/layout/SidebarAdmin";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function LayoutDashboardAdmin({children}:{children:React.ReactNode}){
    const session = useSession()

    useEffect(()=>{
        if(session?.data?.user.role !== "MainAdmin"){
            window.location.href = "/"
        }
    },[session])


    if(session.status === "loading") return null

    return (
        <div>
            <Sidebar />
            <Main>
            {children}
            </Main>
        </div>
    )
}
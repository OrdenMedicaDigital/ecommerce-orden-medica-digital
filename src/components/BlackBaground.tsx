"use client"

import { useSidebarStore } from "@/app/store/sidebar"
import { Row } from "@/once-ui/components"

export default function BlackBackround(){
    const {isMobile,open,toggle} = useSidebarStore()
    return (
        <Row onClick={()=>toggle()} zIndex={2} position="fixed" top="0" left="0" right="0" bottom="0" style={{
            background: "rgba(0,0,0,0.5)",
            display: isMobile && open ? "block" : "none"
          }} />
    )
}
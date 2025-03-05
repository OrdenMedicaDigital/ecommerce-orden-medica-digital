'use client'
import { Column, NavIcon, Row } from "@/once-ui/components"
import BlackBackround from "./BlackBaground"
import { useSidebarStore } from "@/app/store/sidebar"
import { CartButton } from "./Cart"

export default function Main({
    children
}:{
    children: React.ReactNode
}){
    const {isMobile, toggle} = useSidebarStore()
    console.log(isMobile)
    return (
        <Column fillHeight fillWidth maxWidth={"xl"} paddingX="m" style={{paddingLeft:isMobile ? "16px" : "280px"}} paddingY="l" gap="24" horizontal="center" zIndex={1}>
        <BlackBackround />
        <Row fillWidth gap="16" horizontal="space-between" hidden={!isMobile} vertical="center">
        <NavIcon onClick={()=>toggle()} />
        <CartButton />
        </Row>
          {children}
        </Column>
    )
}
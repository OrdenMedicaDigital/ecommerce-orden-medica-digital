"use client"
import { usePlanStore } from "@/app/store/plan";
import { formatCurrency } from "@/lib/formatCurrency";
import { Button, Card, Column, Heading, RevealFx } from "@/once-ui/components";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Resume(){
    const {selectedPlan,labId} = usePlanStore()
    const session = useSession();

    if(!selectedPlan.name) return null

    const handleBuy = () => {
        fetch("/api/checkout", {
            method: "POST",
            body: JSON.stringify({
                planId: selectedPlan.id,
                labId: session.data?.user.labId ?? labId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(res=>res.json()).then(data=>{
            redirect(data.url)
        })
    }

    return (
        <RevealFx style={{width:"320px"}}>
        <Card padding="16"  fillWidth direction="row" position="sticky" top="12" right="0" fitHeight>
        <Column gap="24">
            <Heading variant="heading-strong-xl">Resumen</Heading>
            <Column gap="16">
                <Heading variant="heading-strong-m">{selectedPlan.name}</Heading>
                <Heading variant="heading-default-m">Precio</Heading>
                <Heading variant="heading-strong-m">{formatCurrency(Number(selectedPlan.price))}</Heading>
            </Column>
            <Button onClick={handleBuy}>Comprar ahora</Button>
        </Column>
    </Card>
    </RevealFx>
    )
}
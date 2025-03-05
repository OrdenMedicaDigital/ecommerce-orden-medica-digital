"use client"
import { usePlanStore } from "@/app/store/plan";
import { formatCurrency } from "@/lib/formatCurrency";
import { Button, Card, Column, Heading, Text } from "@/once-ui/components";

export default function SelectPlan({plan}:{plan:{
    id: number;
    name: string;
    price: string | null;
    ordersIncluded: string;
    pricePerOrder: string | null
}}){
    const {setSelectedPlan, selectedPlan} = usePlanStore()
    const selected = selectedPlan.name === plan.name
    return (
        <Card direction="column" padding="24" radius="m" gap="16">
            <Heading variant="heading-strong-xl">{plan.name}</Heading>
            <Column gap="8">
            <Text variant="body-default-s">Precio: {formatCurrency(Number(plan.price))}</Text>
            <Text variant="body-default-s">Ordenes incluidas: {plan.ordersIncluded}</Text>
            <Text variant="body-default-s">Precio por orden: {formatCurrency(Number(plan.pricePerOrder))}</Text>
            </Column>
            <Button variant={selected ? "primary" : "secondary"} onClick={()=>setSelectedPlan(plan)}>{selected ? "Seleccionado" : "Seleccionar"}</Button>
        </Card>
    )
}
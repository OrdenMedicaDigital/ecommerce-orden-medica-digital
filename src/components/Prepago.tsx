"use client"
import useLab from "@/hooks/useLab";
import { Card, Column, Skeleton, Text } from "@/once-ui/components";

export default function Prepago() {
    const lab = useLab();
    return (
        <Card title="Ordenes restantes" padding="16" fillWidth>
            <Column gap="8" fillWidth>
                <Text variant="heading-default-xs">Ordenes restantes</Text>
                {lab ? <Text variant="heading-default-xl">{lab.orders}</Text> :
                <Skeleton shape="block" height="xl" fillWidth />}
                </Column>
            </Card>
    )
}
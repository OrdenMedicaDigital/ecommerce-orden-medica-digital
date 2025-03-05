"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, Heading, Column } from "@/once-ui/components";

export default function EarningsChart({data}:{
    data: {name: string, Ingresos: number}[]
}) {
    return (
        <Card padding="24" radius="l" fillWidth>
            <Column fillWidth>
                <Heading variant="heading-strong-xl">Tendencia de Ingresos</Heading>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="Ingresos" stroke="#4CAF50" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
                </ResponsiveContainer>
            </Column>
        </Card>
    );
}

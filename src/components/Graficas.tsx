"use client"
import { Column, Heading } from "@/once-ui/components";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, LineChart } from 'recharts';

export default function Graficas({ordenesDiarias,ordenesDelMes,ordenesPorSemana}: {
  ordenesDiarias: { day: string; count: number }[];
  ordenesDelMes: number;
  ordenesPorSemana: number[];
}) {
  return (
    <>
      {/* Gráfica de Órdenes Diarias */}
      <Column gap="16">
        <Heading as="h3">Órdenes Diarias en el Mes</Heading>
        <ResponsiveContainer width="100%" height={290}>
                    <LineChart data={ordenesDiarias} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="#4CAF50" strokeWidth={3} dot={{ r: 4 }} />
                    </LineChart>
        </ResponsiveContainer>
      </Column>

      {/* Comparativa Semanal/Mensual */}
      <Column gap="16">
        <Heading as="h3">Comparativa Semanal/Mensual</Heading>
        <ResponsiveContainer width="100%" height={290}>
          <BarChart
            data={[
              { name: "1ra Semana", semanal: ordenesPorSemana[0] , mensual: ordenesDelMes },
              { name: "Semana 2", semanal: ordenesPorSemana[1], mensual: ordenesDelMes },
              { name: "Semana 3", semanal: ordenesPorSemana[2], mensual: ordenesDelMes },
              { name: "Semana 4", semanal: ordenesPorSemana[3], mensual: ordenesDelMes },
            ]}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="semanal" fill="#82ca9d" />
            <Bar dataKey="mensual" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Column>
    </>
  );
}

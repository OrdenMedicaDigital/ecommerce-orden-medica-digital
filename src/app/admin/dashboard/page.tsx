import InviteButton from "@/components/InviteButton";
import LabsTable from "@/components/LabsTable";
import { db, getAllLabs, getOrdersByFilter } from "@/db/queries";
import { payments } from "@/db/schema";
import { formatCurrency } from "@/lib/formatCurrency";
import { Button, Card, Column, Dialog, Grid, Heading, Input, Row, Text } from "@/once-ui/components";
import { sum } from "drizzle-orm";
import { FaDollarSign, FaFlask, FaShoppingCart } from "react-icons/fa";
import EarningsChart from "@/components/EarningsChart";

export default async function DashboardAdmin() {
    let labs = await getAllLabs();
    const labWithOrder = await Promise.all(
        labs.map(async (lab) => {
            const orders = await getOrdersByFilter(lab.id);
            return {
                ...lab,
                orders,
                remainingOrders: lab.orders,
            };
        })
    );
    const earningsData = await db
        .select({ amount: payments.amount, date: payments.paymentDate })
        .from(payments);

    const earningsByMonth: Record<string, number> = earningsData.reduce((acc: Record<string, number>, { amount, date }) => {
        const month = new Date(date).toLocaleString('es-ES', { month: 'short' });
        acc[month] = (acc[month] || 0) + Number(amount);
        return acc;
    }, {});

    const formattedEarnings = Object.keys(earningsByMonth).map(month => ({
        name: month,
        Ingresos: earningsByMonth[month]
    }));

    const totalEarnings = formattedEarnings.reduce((acc, item) => acc + item.Ingresos, 0);

    return (
        <Row fillWidth>
            <Column gap="16" fillWidth>
                <Row gap="24" vertical="center"  horizontal="space-between">
                    <Heading variant="heading-strong-xl">Dashboard</Heading>
                    <InviteButton />
                </Row>

                <Grid columns={4} mobileColumns={1} tabletColumns={2} gap="24">
                    <Card padding="24" radius="l">
                        <Column>
                            <FaDollarSign className="text-green-500" size={24} />
                            <Heading variant="heading-strong-xl">Ingresos Totales</Heading>
                            <Text variant="body-strong-xl">{formatCurrency(Number(totalEarnings) || 0)}</Text>
                        </Column>
                    </Card>
                    <Card padding="24" radius="l">
                        <Column>
                            <FaShoppingCart className="text-blue-500" size={24} />
                            <Heading variant="heading-strong-xl">Total de Órdenes</Heading>
                            <Text variant="body-strong-xl">{labWithOrder.reduce((acc, lab) => acc + lab.orders.length, 0)}</Text>
                        </Column>
                    </Card>
                    <Card padding="24" radius="l">
                        <Column>
                            <FaFlask className="text-purple-500" size={24} />
                            <Heading variant="heading-strong-xl">Laboratorios Activos</Heading>
                            <Text variant="body-strong-xl">{labWithOrder.length}</Text>
                        </Column>
                    </Card>
                </Grid>

                <Row>
                    <EarningsChart data={formattedEarnings} />
                </Row>

                {labWithOrder.length > 0 ? (
                    <LabsTable labs={labWithOrder} />
                ) : (
                    <Text variant="heading-default-xl">No hay laboratorios registrados</Text>
                )}
            </Column>
        </Row>
    );
}

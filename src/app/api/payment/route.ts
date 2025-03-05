import {Payment} from "mercadopago";
import {revalidatePath} from "next/cache";

import api, {mercadopago} from "@/api";
import { createLab, db, getPlanById } from "@/db/queries";
import { labBilling, labs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  // Obtenemos el cuerpo de la petición que incluye información sobre la notificación
  const body: {data: {id: string}} = await request.json();

  // Obtenemos el pago
  const payment = await new Payment(mercadopago).get({id: body.data.id});
  // Si se aprueba, agregamos el mensaje
  if (payment.status === "approved") {
    if(payment.metadata.type === "plan"){
      await api.message.add({labId: payment.metadata.lab_id, paymentStatus: payment.status, paymentDate: payment.date_created as string, transactionId: payment.id?.toString()!, amount: payment.metadata.amount});
      const [plan] = await getPlanById(payment.metadata.plan_id);
      const orders = (await db.select().from(labs).where(eq(labs.id,payment.metadata.lab_id)).limit(1))[0].orders
      
      await db.update(labs).set({
        orders: orders +  Number(plan.ordersIncluded),
        planId: payment.metadata.plan_id
      })
    }else if(payment.metadata.type==="payment"){
      await api.message.add({labId: payment.metadata.lab_id, paymentStatus: payment.status, paymentDate: payment.date_created as string, transactionId: payment.id?.toString()!, amount: payment.metadata.amount});
      const totalAmountDue = (await db.select().from(labBilling).where(eq(labBilling.labId,payment.metadata.lab_id)).limit(1))[0].totalAmountDue
      await db.update(labBilling).set({
          totalAmountDue: (Number(totalAmountDue) - Number(payment.net_amount)).toString(),
          lastPaymentDate: payment.date_approved
      }).where(eq(labBilling.labId,payment.metadata.lab_id))
      // Revalidamos la página de inicio para mostrar los datos actualizados
    }
  }
  revalidatePath("/");
  // Respondemos con un estado 200 para indicarle que la notificación fue recibida
  return new Response(null, {status: 200});
}
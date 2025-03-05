import {MercadoPagoConfig, Preference} from "mercadopago";
import { getPaymentsMP, getPlanById, insertPaymentMP } from "./db/queries";
import { formatCurrency } from "./lib/formatCurrency";

export interface Payment {
    id?: number;
    labId: number;
    paymentStatus: "pending" | "approved" | "rejected";
    paymentDate: string;
    transactionId:string;
    amount: string;
}


export const mercadopago = new MercadoPagoConfig({accessToken: process.env.MP_ACCESS_TOKEN!});

const api = {
  message: {
    async list(): Promise<Payment[]> {
        return await getPaymentsMP()
    },
    async add(payment: Payment): Promise<void> {
      // Obtenemos los mensajes
      const payments = await api.message.list();

      // Si ya existe un mensaje con ese id, lanzamos un error
      if (payments.some((pay) => pay.id === payment.id)) {
        throw new Error("Message already added");
      }

        // Agregamos el mensaje
        await insertPaymentMP(payment);
    },
    async submit({
        labId,
        paymentDate,
        amount,
    }:{
        labId:number,
        paymentDate:Date,
        amount:number
    }) {
      // Creamos la preferencia incluyendo el precio, titulo y metadata. La información de `items` es standard de Mercado Pago. La información que nosotros necesitamos para nuestra DB debería vivir en `metadata`.
      const preference = await new Preference(mercadopago).create({
        body: {
          items: [
            {
              id: "Pago de creditos",
              unit_price: Number(amount),
              quantity: 1,
              title: "Pago de factura",
              description: `Pago de la factura de un total de ${formatCurrency(amount)}`,
              currency_id: "CLP",
            },
          ],
          auto_return: "approved",
          back_urls: {
            success: "http://localhost:3000/dashboard"
          },
          metadata: {
            labId,
            paymentDate,
            amount,
            type: "payment",
          },
        },
      });

      // Devolvemos el init point (url de pago) para que el usuario pueda pagar
      return preference.init_point!;
    },
    async payPlan({
      planId,
      labId,
    }:{
      planId:number,
      labId:number
    }){
      const [plan] = await getPlanById(planId);
      const preference = await new Preference(mercadopago).create({
        body: {
          items: [
            {
              id: "Pago de plan",
              unit_price: Number(plan.price),
              quantity: 1,
              title: "Pago de plan",
              description: `Pago del plan ${plan.name}`,
              currency_id: "CLP",
            },
          ],
          auto_return: "approved",
          back_urls: {
            success: "http://localhost:3000/dashboard"
          },
          metadata: {
            labId,
            planId,
            type: "plan",
            amount: plan.price
          },
        },
      });
      return preference.init_point!;
    }
  },
};

export default api;
import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres";
import { patients, orders, orderExams, exams, labs, payments, plans, users, regions, cities, labBilling } from "./schema";
import { and, eq, gte, like, lte } from "drizzle-orm";
import { Payment } from "@/api";

export const db = drizzle(process.env.DATABASE_URL as string);

interface Patient {
    rut: string;
    name: string;
    paterno: string;
    materno: string;
    birthDate: string;
    email: string;
    phone: string;
    region: string;
    comuna: string;
    address: string;
    labId: number;
    countryId: number;
}

export async function getAllLabs(){
    return await db.select().from(labs);
}

export async function createOrder(patient: Patient, examCodes: string[],date:string) {
    const existingPatient = await db.select().from(patients).where(eq(patients.rut, patient.rut));

    if (existingPatient.length === 0) {
        await db.insert(patients).values(patient);
    }

    const [lab] = await db.select().from(labs).where(eq(labs.id, patient.labId)).limit(1);

    if(lab.type === "Prepago" && lab.orders === 0){
        throw new Error("No tienes ordenes disponibles")
    }

    const [newOrder] = await db.insert(orders)
        .values({ patientRut: patient.rut, date: date ,state: "pending", labId: patient.labId })
        .returning({ id: orders.id });

    if (!newOrder) {
        throw new Error("Order creation failed");
    }

    if (examCodes.length > 0) {
        await db.insert(orderExams).values(
            examCodes.map((examCode) => ({
                orderId: newOrder.id,
                examCode: examCode,
            }))
        );
    }


    if(lab.type === "Prepago"){
        await db.update(labs).set({
            orders: lab.orders - 1
        }).where(eq(labs.id,patient.labId))
    }else{
        const [{totalAmountDue}] = await db.select().from(labBilling).where(eq(labBilling.labId,patient.labId)).limit(1)

        // Calculate new price: 1600 + 16% IVA (sales tax)
        const basePrice = 1600;
        const iva = basePrice * 0.16; // 16% IVA (sales tax)
        const totalPrice = basePrice + iva;
        
        await db.update(labBilling).set({
            totalAmountDue: (Number(totalAmountDue) + Number(totalPrice)).toString()
        }).where(eq(labBilling.labId,patient.labId))
    }

    return newOrder;
}

export async function getAllOrders(labId:number) {
    return await db
        .select({
            orderId: orders.id,
            orderDate: orders.date,
            orderState: orders.state,
            patient: {
                rut: patients.rut,
                name: patients.name,
                paterno: patients.paterno,
                materno: patients.materno,
                birthDate: patients.birthDate,
                email: patients.email,
                phone: patients.phone,
                region: patients.region,
                comuna: patients.comuna,
                address: patients.address,
            },
            lab: {
                id: labs.id,
                name: labs.name,
            },
        })
        .from(orders)
        .innerJoin(patients, eq(orders.patientRut, patients.rut))
        .innerJoin(labs, eq(orders.labId, labs.id))
        .where(eq(orders.labId,labId));
}

export async function getPatientInfo(patientId:string,labId:number){
    return await (db.select().from(patients).where(
        and(
        eq(patients.rut,patientId),
        eq(patients.labId,labId)
        )
    ).limit(1))
}

export async function getOrderById(orderId: number) {
    const order = await db
        .select({
            orderId: orders.id,
            orderDate: orders.date,
            patient: {
                rut: patients.rut,
                name: patients.name,
                paterno: patients.paterno,
                materno: patients.materno,
                birthDate: patients.birthDate,
                email: patients.email,
                phone: patients.phone,
                region: patients.region,
                comuna: patients.comuna,
                address: patients.address,
            },
            lab: {
                id: labs.id,
                name: labs.name,
            },
            state: orders.state,
        })
        .from(orders)
        .innerJoin(patients, eq(orders.patientRut, patients.rut))
        .innerJoin(labs, eq(orders.labId, labs.id))
        .where(eq(orders.id, orderId))
        .limit(1);

    if (order.length === 0) {
        return null;
    }

    const examsList = await db
        .select({
            examCode: exams.code,
            examName: exams.name,
            description: exams.description,
        })
        .from(orderExams)
        .innerJoin(exams, eq(orderExams.examCode, exams.code))
        .where(eq(orderExams.orderId, orderId));

    return {
        ...order[0],
        exams: examsList,
    };
}

export async function updateStateOrder(orderId: number, state: "pending" | "processing" | "completed") {
    return await db.update(orders).set({ state }).where(eq(orders.id, orderId));
}

export async function getAllExams() {
    return await db.select().from(exams);
}

export async function getOrdersByFilter(labId:number,name?: string, startDate?: string, endDate?: string) {
    return await db
        .select({
            orderId: orders.id,
            patientRut: patients.rut,
            patientName: patients.name,
            patientPaterno: patients.paterno,
            patientMaterno: patients.materno,
            date: orders.date,
            state: orders.state,
            labName: labs.name,
        })
        .from(orders)
        .innerJoin(patients, eq(orders.patientRut, patients.rut))
        .innerJoin(labs, eq(orders.labId, labs.id))
        .where(
            and(
                name ? like(patients.name, `%${name}%`) : undefined,
                startDate ? gte(orders.date, startDate) : undefined,
                endDate ? lte(orders.date, endDate) : undefined,
                eq(labs.id,labId)
            )
        );
}

export async function getUser(email:string){
    return await db.select().from(users).where(eq(users.email,email)).limit(1);
}

export async function getPlanById(id: number) {
    return await db.select().from(plans).where(eq(plans.id, id)).limit(1);
}

export async function getPlans(){
    return await db.select().from(plans).orderBy(plans.id);
}


export async function getPaymentsMP() {
    return await db.select().from(payments);
}

export async function insertPaymentMP(payment:Payment) {
    const pay = await db.insert(payments).values(payment);
    return pay
}

export async function createLab(lab:{
    name:string,
    address:string,
    phone:string,
    encargado:string,
    email:string,
    rut:string,
    razon_social:string
}){
    const [{id:labId}] = await db.insert(labs).values(lab).returning({id:labs.id});
    await db.insert(labBilling).values({labId, totalAmountDue: "0" })
    return labId;
}

export async function createUser(user:{
    email:string,
    password:string,
    role:"Admin" | "Recepcionista" | "Gerente General"
},labId:number){
    return await db.insert(users).values({...user,labId}).returning({id:users.id});
}

export async function getRegiones(){
    return await db.select().from(regions);
}

export async function getComunas(regionId:number){
    return await db.select().from(cities).where(eq(cities.idRegion,regionId));
}

export async function getTotalExams(labId:number){
    return await db.select().from(orderExams).innerJoin(orders,eq(orderExams.orderId,orders.id)).where(eq(orders.labId,labId));
}

export async function getPatientsLab(labId:number){
    return await db.select().from(patients).where(eq(patients.labId,labId));
}

export async function getBillingInfo(labId:number){
    return (await db.select().from(labBilling).where(eq(labBilling.labId,labId)).limit(1))[0]
}

export async function getAllBillingInfo(){
    return await db.select().from(labBilling);
}
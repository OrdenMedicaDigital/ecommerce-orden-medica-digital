import { date, integer, pgTable, serial, varchar, primaryKey, foreignKey, decimal, text, boolean, timestamp } from "drizzle-orm/pg-core";
import type { AdapterAccount } from "next-auth/adapters"

// Tabla de países
export const countries = pgTable("countries", {
    idCountry: serial().primaryKey(),
    name: varchar().notNull(),
});

// Tabla de regiones
export const regions = pgTable("regions", {
    idRegion: serial().primaryKey(),
    idCountry: integer().notNull().references(() => countries.idCountry, { onDelete: "cascade" }),
    name: varchar().notNull(),
});

// Tabla de ciudades
export const cities = pgTable("cities", {
    idCity: serial().primaryKey(),
    idRegion: integer().notNull().references(() => regions.idRegion, { onDelete: "cascade" }),
    idCountry: integer().notNull().references(() => countries.idCountry, { onDelete: "cascade" }),
    name: varchar().notNull(),
});

// Tabla de laboratorios
export const labs = pgTable("labs", {
    id: serial().primaryKey(),
    name: varchar().notNull(),
    address: varchar().notNull(),
    phone: varchar().notNull(),
    email: varchar().notNull(),
    rut: varchar().notNull(),
    razon_social: varchar().notNull(),
    encargado: varchar().notNull(),
    type: varchar({ enum: ["Uso","Prepago"] }).default("Prepago").notNull(),
    orders: integer().default(0).notNull(),
    planId: integer().references(() => plans.id, { onDelete: "set null" }),
});

export const admins = pgTable("admins", {
  id: serial().primaryKey(),
  email: varchar().notNull(),
  password: varchar().notNull()
})

export const users = pgTable("user", {
    id: serial().primaryKey(),
    email: varchar().notNull(),
    name: varchar(),
    password: varchar().notNull(),
    role: varchar({ enum: ["Admin","Recepcionista","Gerente General"] }).notNull(),
    labId: integer().notNull().references(() => labs.id, { onDelete: "cascade" }),
    emailVerified: boolean().default(false).notNull(),
    image: varchar(),
});

// Tabla de pacientes
export const patients = pgTable("patients", {
    rut: varchar().primaryKey().notNull(),
    name: varchar().notNull(),
    paterno: varchar().notNull(),
    materno: varchar().notNull(),
    birthDate: date().notNull(),
    email: varchar().notNull(),
    phone: varchar().notNull(),
    region: varchar().notNull(),
    comuna: varchar().notNull(),
    address: varchar().notNull(),
    labId: integer().notNull().references(() => labs.id, { onDelete: "set null" }),
    countryId: integer().notNull().references(() => countries.idCountry, { onDelete: "cascade" }),
});


// Tabla de exámenes
export const exams = pgTable("exams", {
    code: varchar().primaryKey().notNull(),
    name: varchar().notNull(),
    description: varchar().notNull(),
});

// Tabla de órdenes (relaciona pacientes y laboratorios)
export const orders = pgTable("orders", {
    id: serial().primaryKey(),
    patientRut: varchar().notNull().references(() => patients.rut, { onDelete: "cascade" }),
    date: date().notNull(),
    state: varchar({ enum: ["pending", "processing", "completed"] }).default("pending").notNull(),
    labId: integer().notNull().references(() => labs.id, { onDelete: "set null" }),
});

// Relación entre órdenes y exámenes
export const orderExams = pgTable("order_exams", {
    orderId: serial().notNull().references(() => orders.id, { onDelete: "cascade" }),
    examCode: varchar().notNull().references(() => exams.code, { onDelete: "cascade" }),
}, (table) => ({
    pk: primaryKey({ columns: [table.orderId, table.examCode] }) // Clave primaria compuesta
}));

export const plans = pgTable("plans", {
    id: serial().primaryKey(),
    name: varchar().notNull(),
    price: decimal(), // Precio del plan
    ordersIncluded: varchar().notNull(), // Cantidad de órdenes incluidas (permite "2000+")
    pricePerOrder: decimal(), // Precio por orden (puede ser null para planes negociables)
});

export const labBilling = pgTable("lab_billing", {
  id: serial().primaryKey(),
  labId: integer().notNull().references(() => labs.id, { onDelete: "cascade" }),
  totalAmountDue: decimal().notNull().default("0"), // Monto total adeudado
  lastPaymentDate: date(), // Fecha del último pago
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tabla de pagos
export const payments = pgTable("payments", {
    id: serial().primaryKey().notNull(),
    labId: integer().notNull().references(() => labs.id, { onDelete: "cascade" }), // Laboratorio que realiza el pago
    paymentStatus: varchar({ enum: ["pending", "approved", "rejected"] }).default("pending").notNull(), // Estado del pago
    paymentDate: date().notNull(), // Fecha del pago
    transactionId: varchar().notNull(), // ID de la transacción en Mercado Pago
    amount: decimal().notNull(), // Monto pagado
});

export const accounts = pgTable(
    "account",
    {
      serial: integer()
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccount>().notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: integer("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
    },
    (account) => [
      {
        compoundKey: primaryKey({
          columns: [account.provider, account.providerAccountId],
        }),
      },
    ]
  )
   
  export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  })
   
  export const verificationTokens = pgTable(
    "verificationToken",
    {
      identifier: text("identifier").notNull(),
      token: text("token").notNull(),
      expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => [
      {
        compositePk: primaryKey({
          columns: [verificationToken.identifier, verificationToken.token],
        }),
      },
    ]
  )
   
  export const authenticators = pgTable(
    "authenticator",
    {
      credentialID: text("credentialID").notNull().unique(),
      userId: integer()
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      providerAccountId: text("providerAccountId").notNull(),
      credentialPublicKey: text("credentialPublicKey").notNull(),
      counter: integer("counter").notNull(),
      credentialDeviceType: text("credentialDeviceType").notNull(),
      credentialBackedUp: boolean("credentialBackedUp").notNull(),
      transports: text("transports"),
    },
    (authenticator) => [
      {
        compositePK: primaryKey({
          columns: [authenticator.userId, authenticator.credentialID],
        }),
      },
    ]
  )
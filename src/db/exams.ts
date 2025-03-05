import "dotenv/config"; // Cargar las variables de entorno
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { drizzle } from "drizzle-orm/node-postgres"; // Importa la instancia de Drizzle
import { exams } from "./schema";
import { eq } from "drizzle-orm";

// Ruta del archivo CSV
const filePath = path.join(process.cwd(), "Examenes_Laboratorio_1.csv");

const db = drizzle(process.env.DATABASE_URL as string); // Instancia de Drizzle

// Función para leer el CSV y convertirlo a un array de objetos
async function readCSV(filePath:string) : Promise<{code:string,name:string,description:string}[]> {
    return new Promise((resolve, reject) => {
        const results : {code:string,name:string,description:string}[] = [];

        fs.createReadStream(filePath)
            .pipe(csv({ separator: "," })) // Asegurar el delimitador correcto
            .on("data", (data) => {
                results.push({
                    code: data["Código"],
                    name: data["Nombre del Examen"],
                    description: "" // Se puede completar después si es necesario
                });
            })
            .on("end", () => resolve(results))
            .on("error", (err) => reject(err));
    });
}

// Función para insertar los exámenes en la base de datos
export async function insertExams() {
    try {
        const examList = await readCSV(filePath);
        
        if (examList.length === 0) {
            console.log("No hay exámenes para insertar.");
            return;
        }

        examList.forEach( async (exam) => {
            console.log("Insertando exámenes...");
            const e = await db.select().from(exams).where(eq(exams.code, exam.code));
            console.log(e)

        await db.insert(exams).values(exam);
    })
        console.log("Exámenes insertados correctamente.");
    } catch (error) {
        console.error("Error al insertar exámenes:", error);
    }
}
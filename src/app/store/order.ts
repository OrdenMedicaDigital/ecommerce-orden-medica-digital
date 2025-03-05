"use client"
import {create} from "zustand"

interface Order {
    patient: Patient;
    exams: {
        code: string;
        name: string;
        description: string;
    }[];
    date: Date;
    setData: (data: Partial<Order>) => void;
}

export const useOrderStore = create<Order>((set)=>({
        patient: {
            name: "",
            paterno:"",
            materno: "",
            comuna: {
                id: 0,
                name: "",
            },
            region: {
                id: 0,
                name: "",
            },
            address: "",
            email: "",
            phone: "",
            rut:"",
            birthDate: "",
            countryId: 1,
            labId:0
        },
        exams: [],
        date: new Date(),
        setData: (data: Partial<Order>) => set((state) => ({...state, ...data})),
    })
)
import { create } from "zustand";

interface Plan{
    id?: number;
    name?: string;
    price?: string | null;
    ordersIncluded?: string;
    pricePerOrder?: string | null
}

export const usePlanStore = create<{
    selectedPlan: Plan;
    setSelectedPlan: (plan:Plan) => void;
    labId?: number;
    setLabId: (labId:number) => void;
}>((set)=>({
    selectedPlan: {},
    setSelectedPlan: (plan:Plan) => set({selectedPlan:plan}),
    labId: 0,
    setLabId: (labId:number) => set({labId})
}))
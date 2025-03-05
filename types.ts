interface Plan{
    id:number;
    name:string;
    price:number;
    ordersIncluded:string;
    pricePerOrder:number;
}

interface Patient{
    name: string;
    paterno:string;
    materno:string;
    comuna: {
        id: number;
        name: string;
    };
    region: {
        id: number;
        name: string;
    };
    address: string;
    email: string;
    phone: string;
    rut: string;
    birthDate: string;
    countryId: number;
    labId: number;
}

interface Exam{
    code: string;
    name: string;
    description: string;
}
export function formatCurrency(value: number) {
    return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
    }).format(value);
}

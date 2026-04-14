export const formattaValuta = (valore: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(valore);

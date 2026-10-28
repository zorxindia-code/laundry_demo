/** A "from" price; `amount: null` renders as a placeholder until supplied. */
export type Price = { currency: "₹"; amount: number | null };

export const tbcPrice: Price = { currency: "₹", amount: null };

import { tbcPrice, type Price } from "./price";

export type Service = {
  id: string;
  name: string;
  summary: string;
  price: Price;
};

/** Copy from the creative direction; prices await the client. */
export const services: Service[] = [
  {
    id: "pickup",
    name: "Pickup & Delivery",
    summary: "Collected from your door, returned to it.",
    price: tbcPrice,
  },
  {
    id: "wash-fold",
    name: "Wash & Fold",
    summary: "Sorted by colour and fabric, folded by hand.",
    price: tbcPrice,
  },
  {
    id: "stain",
    name: "Stain Treatment",
    summary: "Every mark pre-treated by hand before washing.",
    price: tbcPrice,
  },
  {
    id: "delicates",
    name: "Delicate Fabric Care",
    summary: "Silks, wools and linens on their own gentle cycle.",
    price: tbcPrice,
  },
  {
    id: "dry-cleaning",
    name: "Dry Cleaning",
    summary: "For the pieces water can't touch.",
    price: tbcPrice,
  },
  {
    id: "pressing",
    name: "Ironing & Pressing",
    summary: "Steam-pressed, collars set, ready on a hanger.",
    price: tbcPrice,
  },
];

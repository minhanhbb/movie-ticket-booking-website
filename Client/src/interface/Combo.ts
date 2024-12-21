import { Pivot } from "./Pivot";

// src/types.ts
export interface Combo {
    id: number;
    combo_name: string;
    descripton: string;
    price: number;
    volume: number; 
    status: number;
    created_at: string;
    updated_at: string;
    pivot: Pivot
}

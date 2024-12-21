import { Roles } from "./Roles";

// src/interfaces/User.ts
export interface User {
    id: number;                      // bigint(20) -> number
    user_name: string;               // varchar(255)
    sex: 'male' | 'female' | 'undisclosed';  // enum
    password: string;                // varchar(255)
    email?: string | null;           // varchar(255), optional
    avatar?: string | null;          // varchar(255), optional
    phone?: string | null;           // varchar(255), optional
    address?: string | null;         // varchar(255), optional
    fullname?: string | null;     
       // varchar(255), optional
    coin?: number | null;            // double, optional
    status: boolean | "Hoạt Động" | "Khóa";       // enum
    cinema_id: number
    role_id : number
                   // bigint(20) -> number
    email_verified_at?: Date | null; // timestamp, optional
    created_at?: Date | null;        // timestamp, optional
    updated_at?: Date | null;        // timestamp, optional
}

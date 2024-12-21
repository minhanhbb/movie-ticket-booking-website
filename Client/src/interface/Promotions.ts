export interface Promotions {
    id: number;
    code: string;
    discount_percentage: number;
    max_discount: number;
    min_purchase: number;
    valid_from: string;
    valid_to: string;
    is_active: number;
    created_at: string;
    updated_at: string;
}
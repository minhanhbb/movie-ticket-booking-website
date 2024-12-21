// Categories.interface.ts
export interface Categories {
    id: number;  // ID chính, kiểu bigint
    category_name: string;  // Tên danh mục tin tức
    descriptions?: string | null;  // Mô tả (có thể là null)
    status: 'Show' | 'Hidden';  // Trạng thái
    created_at?: string | null;  // Ngày tạo (có thể là null)
    updated_at?: string | null;  // Ngày cập nhật (có thể là null)
}

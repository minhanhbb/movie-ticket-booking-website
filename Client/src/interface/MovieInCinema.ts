import { Movie } from "./Movie";

export interface MovieInCinema {
    id?: number; // ID của bản ghi
    movie_id: number; // ID của phim
    cinema_id: number; // ID của rạp
    created_at?: string; // Thời gian tạo
    updated_at?: string; // Thời gian cập nhật
    movie: Movie
}

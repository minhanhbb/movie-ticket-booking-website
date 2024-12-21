import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { notification } from "antd";
import instance from "../../../server";
import { useNavigate } from "react-router-dom";

import { Movie } from "../../../interface/Movie";
import { Room } from "../../../interface/Room";
const today = new Date();
today.setHours(0, 0, 0, 0);
// Schema validation using Zod
const showtimeSchema = z.object({
    movie_id: z.number({ invalid_type_error: "Vui lòng chọn phim." }).min(1, { message: "Vui lòng chọn phim." }),
    room_id: z.number({ invalid_type_error: "Vui lòng chọn phòng." }).min(1, { message: "Vui lòng chọn phòng." }),
    date: z
        .string()
        .nonempty({ message: "Ngày không được để trống." })
        .refine(
            (date) => new Date(date) >= today,
            { message: "Ngày không được bé hơn ngày hiện tại." }
        ),
    opening_time: z.string().nonempty({ message: "Thời gian mở cửa không được để trống." }),
    closing_time: z.string().nonempty({ message: "Thời gian đóng cửa không được để trống." }),
    price: z.number({ invalid_type_error: "Vui lòng nhập giá tiền." }).min(1, { message: "Giá phải lớn hơn 0." }).min(10000, 'Giá tối thiểu là 10,000 VNĐ').max(500000, { message: "Giá tối đa 500,000 VNĐ" }),
});

type FormData = z.infer<typeof showtimeSchema>;

const ShowtimeAuto = () => {
    const nav = useNavigate();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(showtimeSchema),
    });

    useEffect(() => {
        const fetchMoviesAndRooms = async () => {
            try {
                const movieResponse = await instance.get("/manager/movies");
                setMovies(movieResponse.data.data.original);

                const roomResponse = await instance.get("/manager/room");
                setRooms(roomResponse.data.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu phim và phòng:", error);
                notification.error({
                    message: "Lỗi khi tải dữ liệu",
                    description: "Không thể tải phim và phòng, vui lòng thử lại sau.",
                });
            }
        };

        fetchMoviesAndRooms();
    }, []);

    const onSubmit = async (data: FormData) => {
        try {
            const response = await instance.post("/manager/showtimePayload", data);
            console.log("Thêm showtime thành công:", response.data);
            notification.success({
                message: "Thêm ShowTime thành công",
                description: "Showtime đã được thêm thành công.",
            });
            nav("/admin/showtimes");
        } catch (error) {
            console.error("Lỗi khi thêm showtime:", error);
            notification.error({
                message: "Lỗi khi thêm Showtime",
                description: "Suất chiếu bị trùng",
            });
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Thêm Suất Chiếu Tự Động</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="shadow p-4 rounded bg-light">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="movie_id" className="form-label">Phim</label>
                        <select
                            className="form-control"
                            id="movie_id"
                            {...register("movie_id", { valueAsNumber: true })}
                        >
                            <option value="">Chọn Phim</option>
                            {movies.map((movie) => (
                                <option key={movie.id} value={movie.id}>
                                    {movie.movie_name}
                                </option>
                            ))}
                        </select>
                        {errors.movie_id && <span className="text-danger">{errors.movie_id.message}</span>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="room_id" className="form-label">Phòng</label>
                        <select
                            className="form-control"
                            id="room_id"
                            {...register("room_id", { valueAsNumber: true })}
                        >
                            <option value="">Chọn Phòng</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.room_name}
                                </option>
                            ))}
                        </select>
                        {errors.room_id && <span className="text-danger">{errors.room_id.message}</span>}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="date" className="form-label">Ngày</label>
                        <input
                            type="date"
                            className="form-control"
                            id="date"
                            {...register("date")}
                        />
                        {errors.date && <span className="text-danger">{errors.date.message}</span>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="opening_time" className="form-label">Thời Gian Mở Cửa</label>
                        <input
                            type="time"
                            className="form-control"
                            id="opening_time"
                            {...register("opening_time")}
                        />
                        {errors.opening_time && <span className="text-danger">{errors.opening_time.message}</span>}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="closing_time" className="form-label">Thời Gian Đóng Cửa</label>
                        <input
                            type="time"
                            className="form-control"
                            id="closing_time"
                            {...register("closing_time")}
                        />
                        {errors.closing_time && <span className="text-danger">{errors.closing_time.message}</span>}
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="price" className="form-label">Giá</label>
                        <input
                            type="number"
                            className="form-control"
                            id="price"
                            {...register("price", { valueAsNumber: true })}
                        />
                        {errors.price && <span className="text-danger">{errors.price.message}</span>}
                    </div>
                </div>
                <button type="submit" className="btn btn-primary w-100">Thêm Showtime</button>
            </form>
        </div>
    );
};

export default ShowtimeAuto;

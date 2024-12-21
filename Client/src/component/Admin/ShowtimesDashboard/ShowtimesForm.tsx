import React, { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Showtime } from '../../../interface/Showtimes';
import { useShowtimeContext } from '../../../Context/ShowtimesContext';
import instance from '../../../server';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Room } from '../../../interface/Room';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, notification } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Movie } from '../../../interface/Movie';

// Schema validation
const showtimeSchema = z.object({
  movie_id: z.number({ invalid_type_error: "Vui lòng chọn phim" }).min(1, 'Vui lòng chọn phim'),
  room_id: z.number({ invalid_type_error: "Vui lòng chọn phòng" }).min(1, 'Vui lòng chọn phòng'),
  showtime_date: z
    .string()
    .min(1, 'Vui lòng chọn ngày chiếu')
    .refine((value) => {
      const today = new Date();
      const selectedDate = new Date(value);
      today.setHours(0, 0, 0, 0); // Reset giờ phút giây để chỉ so sánh ngày
      return selectedDate >= today;
    }, 'Ngày chiếu không được nhỏ hơn ngày hiện tại'),
  showtime_start: z
    .string()
    .min(1, 'Vui lòng chọn giờ bắt đầu')
    .regex(/^\d{2}:\d{2}$/, 'Giờ bắt đầu phải có định dạng HH:mm'),
  price: z
    .number({ invalid_type_error: "Giá phải là số" })
    .min(0, 'Giá phải lớn hơn hoặc bằng 0')
    .min(10000,'Giá tối thiểu là 10,000 VNĐ')
    .max(500000, 'Giá không được vượt quá 500,000 VNĐ')
    .optional(),
});

const ShowtimesForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Showtime>({
    resolver: zodResolver(showtimeSchema),
  });
  const { addOrUpdateShowtime } = useShowtimeContext();
  const navigate = useNavigate();

  // State variables
  const [moviesList, setMoviesList] = useState<any[]>([]);
  const [roomsList, setRoomsList] = useState<Room[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchMovies = async () => {
      const response = await instance.get('/manager/movies');
      setMoviesList(response.data.data.original);
    };

    const fetchShowtime = async () => {
      if (id) {
        const response = await instance.get(`/manager/showtimes/${id}`);
        const showtimeData = response.data.data;
        
        // Populate form fields for edit mode
        reset({
          movie_id: showtimeData.movie_id,
          showtime_date: showtimeData.showtime_date,
          showtime_start: showtimeData.showtime_start,
          price: showtimeData.price,
          room_id: showtimeData.room_id,
        });
      }
    };
    
    fetchRooms(); // Fetch rooms list
    fetchMovies();
    fetchShowtime();
  }, [id, reset]);

  // Fetch rooms
  const fetchRooms = async () => {
    const response = await instance.get('/manager/room');
    setRoomsList(response.data.data);
  };

  // Form submission handler
  const onSubmit: SubmitHandler<Showtime> = async (data) => {
    const formattedData = {
      ...data,
      showtime_start: `${data.showtime_start}:00`, // Add ':00' to make it HH:mm:ss
    };
  
    if (!id) {
      await addOrUpdateShowtime(formattedData); // Add new showtime
      
    } else {
      await addOrUpdateShowtime(formattedData, id); // Update existing showtime
     
    }
  
    reset();
    navigate('/admin/showtimes');
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">{id ? 'Cập nhật Suất Chiếu' : 'Thêm Suất Chiếu'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="shadow p-4 rounded bg-light">
        <div className="mb-3">
          <Link to="/admin/showtimesauto/add">
            <Button type="primary" icon={<PlusCircleOutlined />}>
              Thêm Suất Chiếu Tự Động
            </Button>
          </Link>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Chọn Phim</label>
            <select {...register('movie_id', { valueAsNumber: true })} className="form-select">
              <option value="">Chọn Phim</option>
              {moviesList.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.movie_name}
                </option>
              ))}
            </select>
            {errors.movie_id && <div className="text-danger">{errors.movie_id.message}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Chọn Phòng</label>
            <select {...register('room_id', { valueAsNumber: true })} className="form-select">
              <option value="">Chọn Phòng</option>
              {roomsList.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.room_name}
                </option>
              ))}
            </select>
            {errors.room_id && <div className="text-danger">{errors.room_id.message}</div>}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Ngày chiếu</label>
            <input type="date" {...register('showtime_date')} className="form-control" />
            {errors.showtime_date && <div className="text-danger">{errors.showtime_date.message}</div>}
          </div>

          <div className="col-md-6 mb-3">
            <label className="form-label">Giờ bắt đầu</label>
            <input type="time" {...register('showtime_start')} className="form-control" />
            {errors.showtime_start && <div className="text-danger">{errors.showtime_start.message}</div>}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Giá</label>
          <input type="number" {...register('price', { valueAsNumber: true })} className="form-control" style={{width:"25%"}} />
          {errors.price && <div className="text-danger">{errors.price.message}</div>}
        </div>

        <div className="mb-3">
          {id ? (
            <button type="submit" className="btn btn-success w-100">
              Cập nhật Showtime
            </button>
          ) : (
            <button type="submit" className="btn btn-primary w-30">
              Thêm Showtime
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ShowtimesForm;

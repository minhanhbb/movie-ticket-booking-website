import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";
import { Cinema } from "../../../interface/Cinema";
import { Location } from "../../../interface/Location";
import { Movie } from "../../../interface/Movie";
import { useCinemaContext } from "../../../Context/CinemasContext";
import { notification } from "antd";  // Import Ant Design's notification

const cinemaSchema = z.object({
  cinema_name: z.string().min(1, "Tên Rạp là bắt buộc."),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 chữ số.")
    .max(10, "Số điện thoại tối đã 10 chữ số.")
    .regex(/^[0-9]+$/, "Số điện thoại phải là số."),
  cinema_address: z.string().min(1, "Địa chỉ rạp là bắt buộc."),
  location_id: z.number({ invalid_type_error: "Vui lòng chọn vị trí." }).min(1,"ID vị trí là bắt buộc."),
});

const CinemaForm = () => {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { addCinema, updateCinema } = useCinemaContext();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Cinema>({
    resolver: zodResolver(cinemaSchema),
  });

  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [cinema, setCinema] = useState<Cinema | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await instance.get(`/location`);
        setLocations(data.data);
      } catch (error) {
        console.error("Lỗi khi tải vị trí:", error);
      }
    };

    const fetchCinema = async () => {
      if (isEditMode) {
        try {
          const { data } = await instance.get(`/cinema/${id}`);
          setCinema(data.data);
          reset(data.data);
          setSelectedMovies(data.data.movies.map((movie: Movie) => movie.id.toString()));
        } catch (error) {
          console.error("Lỗi khi tải thông tin rạp:", error);
        }
      }
    };

  

    fetchLocations();
    fetchCinema();
  }, [id, isEditMode, reset]);

  const handleFormSubmit = async (data: Cinema) => {
    try {
      if (isEditMode) {
        await updateCinema(Number(id), data);
        notification.success({
          message: "Cập nhật rạp thành công!",
          description:"Đã cập nhật rạp mới"
        });
      } else {
        await addCinema(data);
        notification.success({
          message: "Thêm rạp mới thành công!",
          description:"Đã thêm rạp mới vào danh sách"
        });
      }
      nav('/admin/cinemas');
      reset();
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
      notification.error({
        message: "Gửi form thất bại",
      });
    }
  };


  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="shadow-lg p-5 rounded bg-white" style={{ maxWidth: "900px", margin: "0 auto",height: "700px" }}>
        <h2 className="text-center mb-5 ">{isEditMode ? "Chỉnh sửa Rạp" : "Thêm Rạp Mới"}</h2>

        {/* Cinema Name */}
        <div className="mb-4">
          <label htmlFor="cinema_name" className="form-label fw-bold">Tên Rạp</label>
          <input
            type="text"
            className={`form-control ${errors.cinema_name ? "is-invalid" : ""}`}
            {...register("cinema_name")}
            defaultValue={cinema?.cinema_name || ""}
          />
          {errors.cinema_name && <div className="invalid-feedback">{errors.cinema_name.message}</div>}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="phone" className="form-label fw-bold">Số Điện Thoại</label>
          <input
            type="text"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            {...register("phone")}
            defaultValue={cinema?.phone || ""}
          />
          {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
        </div>

        {/* Cinema Address */}
        <div className="mb-4">
          <label htmlFor="cinema_address" className="form-label fw-bold">Địa Chỉ Rạp</label>
          <input
            type="text"
            className={`form-control ${errors.cinema_address ? "is-invalid" : ""}`}
            {...register("cinema_address")}
            defaultValue={cinema?.cinema_address || ""}
          />
          {errors.cinema_address && <div className="invalid-feedback">{errors.cinema_address.message}</div>}
        </div>

        {/* Location */}
        <div className="mb-4">
          <label htmlFor="location_id" className="form-label fw-bold">Vị trí</label>
          <select
            {...register("location_id",{valueAsNumber: true})}
            className={`form-select ${errors.location_id ? "is-invalid" : ""}`}
            defaultValue={cinema?.location_id || ""}
          >
            <option value="">Chọn Vị Trí</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.location_name}
              </option>
            ))}
          </select>
          {errors.location_id && <div className="invalid-feedback">{errors.location_id.message}</div>}
        </div>

        {/* Select Movies */}
        {/* Select Movies */}
{/* {isEditMode && (
  <div className="mb-4">
    <label htmlFor="movies" className="form-label fw-bold">Chọn Phim</label>
    <select
      multiple
      className="form-select"
      value={selectedMovies}
      onChange={(e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedMovies(selected);
      }}
    >
      {movies.map((movie) => (
        <option key={movie.id} value={movie.id.toString()}>
          {movie.movie_name}
        </option>
      ))}
    </select>
  </div>
)} */}


        {/* Submit and Add Movies Button */}
        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary px-4 py-2 w-100">
            {isEditMode ? "Cập Nhật Rạp" : "Thêm Rạp"}
          </button>
          {/* {isEditMode && (
            <button
              type="button"
              className="btn btn-secondary px-4 py-2"
              onClick={handleAddMoviesToCinema}
            >
              Thêm Phim Đã Chọn vào Rạp
            </button>
          )} */}
        </div>
      </form>
    </div>
  );
};

export default CinemaForm;

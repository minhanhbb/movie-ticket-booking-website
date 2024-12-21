import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";
import { notification } from "antd";
import { SeatLayout } from "../../../interface/SeatLayout";
import { z } from "zod"; // Import Zod
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver

// Define Zod schema
const seatLayoutSchema = z.object({
  name: z.string().min(1, "Tên bố cục là bắt buộc"),
  rows: z
    .number()
    .min(1, "Số hàng là bắt buộc")
    .refine((val) => !isNaN(Number(val)), "Số hàng phải là một số hợp lệ"),
  columns: z
    .number()
    .min(1, "Số cột là bắt buộc")
    .refine((val) => !isNaN(Number(val)), "Số cột phải là một số hợp lệ"),
  row_regular_seat: z
    .number()
    .min(1, "Số ghế thường là bắt buộc")
    .refine((val) => !isNaN(Number(val)), "Số ghế thường phải là một số hợp lệ"),
  row_vip_seat: z
    .number()
    .min(1, "Số ghế VIP là bắt buộc")
    .refine((val) => !isNaN(Number(val)), "Số ghế VIP phải là một số hợp lệ"),
  row_couple_seat: z
    .number()
    .min(1, "Số ghế cặp là bắt buộc")
    .refine((val) => !isNaN(Number(val)), "Số ghế cặp phải là một số hợp lệ"),
  status: z.union([z.literal("Bản nháp"), z.literal("Xuất bản")]),
});

type SeatLayoutFormData = z.infer<typeof seatLayoutSchema>;

const SeatLayoutForm = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  // Integrating Zod with react-hook-form using zodResolver
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<SeatLayoutFormData>({
    resolver: zodResolver(seatLayoutSchema), // Use zodResolver here
  });

  useEffect(() => {
    const fetchSeatLayout = async () => {
      if (id) {
        try {
          const { data } = await instance.get(`/matrix/${id}`);

          // Reset form with fetched data
          reset(data.data);
        } catch (error) {
          console.error("Error fetching seat layout data:", error);
        }
      }
    };

    fetchSeatLayout(); // Fetch data if ID exists
  }, [id, reset]);

  const handleFormSubmit = async (data: SeatLayoutFormData) => {
    try {
      // Convert all numeric fields to strings before submitting
      const requestData = {
        ...data,
        rows: String(data.rows),
        columns: String(data.columns),
        row_regular_seat: String(data.row_regular_seat),
        row_vip_seat: String(data.row_vip_seat),
        row_couple_seat: String(data.row_couple_seat),
      };

      if (id) {
        // Update seat layout
        await instance.put(`/matrix/${id}`, requestData);
        notification.success({
          message: "Cập nhật bố cục ghế thành công!",
        });
      } else {
        // Create new seat layout
        await instance.post("/matrix", requestData);
        notification.success({
          message: "Thêm bố cục ghế thành công!",
        });
      }
      nav("/admin/matrix"); // Redirect to the seat layout list page
    } catch (error) {
      console.error("Error submitting seat layout data:", error);
      notification.error({
        message: "Lỗi khi gửi dữ liệu bố cục ghế",
      });
    }
  };

  return (
    <div className="container mt-5">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="shadow p-4 rounded bg-light"
      >
        <h1 className="text-center mb-4">
          {id ? "Cập nhật Bố cục ghế" : "Thêm Bố cục ghế"}
        </h1>

        {/* Name */}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Tên bố cục
          </label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            {...register("name")}
          />
          {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
        </div>

        {/* Rows */}
        <div className="mb-3">
          <label htmlFor="rows" className="form-label">
            Số hàng
          </label>
          <input
            type="number"
            className={`form-control ${errors.rows ? "is-invalid" : ""}`}
            {...register("rows",{valueAsNumber:true})}
          />
          {errors.rows && <div className="invalid-feedback">{errors.rows.message}</div>}
        </div>

        {/* Columns */}
        <div className="mb-3">
          <label htmlFor="columns" className="form-label">
            Số cột
          </label>
          <input
            type="number"
            className={`form-control ${errors.columns ? "is-invalid" : ""}`}
            {...register("columns",{valueAsNumber:true})}
          />
          {errors.columns && <div className="invalid-feedback">{errors.columns.message}</div>}
        </div>

        {/* Regular seats */}
        <div className="mb-3">
          <label htmlFor="row_regular_seat" className="form-label">
            Số ghế thường
          </label>
          <input
            type="number"
            className={`form-control ${errors.row_regular_seat ? "is-invalid" : ""}`}
            {...register("row_regular_seat",{valueAsNumber:true})}
          />
          {errors.row_regular_seat && <div className="invalid-feedback">{errors.row_regular_seat.message}</div>}
        </div>

        {/* VIP seats */}
        <div className="mb-3">
          <label htmlFor="row_vip_seat" className="form-label">
            Số ghế VIP
          </label>
          <input
            type="number"
            className={`form-control ${errors.row_vip_seat ? "is-invalid" : ""}`}
            {...register("row_vip_seat",{valueAsNumber:true})}
          />
          {errors.row_vip_seat && <div className="invalid-feedback">{errors.row_vip_seat.message}</div>}
        </div>

        {/* Couple seats */}
        <div className="mb-3">
          <label htmlFor="row_couple_seat" className="form-label">
            Số ghế cặp
          </label>
          <input
            type="number"
            className={`form-control ${errors.row_couple_seat ? "is-invalid" : ""}`}
            {...register("row_couple_seat",{valueAsNumber:true})}
          />
          {errors.row_couple_seat && <div className="invalid-feedback">{errors.row_couple_seat.message}</div>}
        </div>

        {/* Status */}
        <div className="mb-3">
          <label htmlFor="status" className="form-label">
            Trạng thái
          </label>
          <select
            className={`form-control ${errors.status ? "is-invalid" : ""}`}
            {...register("status")}
          >
            <option value="Bản nháp">Bản nháp</option>
            <option value="Xuất bản">Xuất bản</option>
          </select>
          {errors.status && <div className="invalid-feedback">{errors.status.message}</div>}
        </div>

        <div className="d-flex justify-content-between">
          <button type="submit" className="btn btn-primary">
            {id ? "Cập nhật" : "Thêm"}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => nav("/admin/seat-layouts")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default SeatLayoutForm;
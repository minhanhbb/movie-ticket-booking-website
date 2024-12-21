import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";
import { notification } from 'antd';
import { z } from "zod"; // Import Zod
import { zodResolver } from "@hookform/resolvers/zod"; // Import Zod Resolver

// Định nghĩa schema validation với Zod
const methodSchema = z.object({
  pay_method_name: z.string().min(1, { message: "Tên phương thức là bắt buộc" }),
});

type MethodFormData = z.infer<typeof methodSchema>; // Lấy kiểu dữ liệu từ schema

const MethodForm = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }, // Lấy errors để hiển thị lỗi
  } = useForm<MethodFormData>({
    resolver: zodResolver(methodSchema), // Áp dụng Zod resolver cho form
  });

  useEffect(() => {
    const fetchMethod = async () => {
      if (id) {
        try {
          const { data } = await instance.get(`/admin/method/${id}`);
          if (data) {
            reset(data.data); // Reset form data sau khi lấy thành công
          }
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu phương thức:", error);
        }
      }
    };
  
    fetchMethod(); // Lấy dữ liệu phương thức nếu có ID
  }, [id, reset]);

  const handleFormSubmit = async (data: MethodFormData) => {
    try {
      if (id) {
        await instance.put(`/admin/method/${id}`, data);
        notification.success({
          message: 'Cập nhật phương thức thành công!',
        });
      } else {
        await instance.post('/method', data);
        notification.success({
          message: 'Thêm phương thức thành công!',
        });
      }
      nav('/admin/method');
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu phương thức:", error);
      notification.error({
        message: 'Lỗi khi gửi dữ liệu phương thức',
      });
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="shadow p-4 rounded bg-light" style={{ maxWidth: "700px", margin: "0 auto",height: "300px" }}>
        <h1 className="text-center mb-4">{id ? "Cập nhật Phương Thức" : "Thêm Phương Thức"}</h1>

        {/* Tên Phương Thức */}
        <div className="mb-3">
          <label htmlFor="method_name" className="form-label">Tên Phương Thức</label>
          <input
            type="text"
            className={`form-control ${errors.pay_method_name ? "is-invalid" : ""}`} // Thêm class cho trường có lỗi
            {...register("pay_method_name")}
          />
          {errors.pay_method_name && (
            <div className="invalid-feedback">{errors.pay_method_name.message}</div>
          )}
        </div>

        <div className="mb-3">
          <button className="btn btn-primary w-30">{id ? "Cập nhật Phương Thức" : "Thêm Phương Thức"}</button>
        </div>
      </form>
    </div>
  );
};

export default MethodForm;

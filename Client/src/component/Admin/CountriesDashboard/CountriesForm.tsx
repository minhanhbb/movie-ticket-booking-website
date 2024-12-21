import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useCountryContext } from '../../../Context/CountriesContext';
import { Location } from '../../../interface/Location';
import instance from '../../../server';
import { notification } from 'antd';  // Import Ant Design notification

// Định nghĩa schema sử dụng Zod
const countrySchema = z.object({
  location_name: z.string().min(1, "Tên Quốc Gia là bắt buộc."),
});

const CountriesForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { addCountry, updateCountry } = useCountryContext();
  const nav = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<Location>({
    resolver: zodResolver(countrySchema),
  });

  useEffect(() => {
    const fetchCountry = async () => {
      if (isEditMode) {
        try {
          const response = await instance.get(`/location/${id}`);
          reset(response.data); // Reset form với dữ liệu lấy từ API
        } catch (error) {
          console.error("Không thể lấy thông tin khu vực:", error);
        }
      }
    };
    fetchCountry();
  }, [id, isEditMode, reset]);

  const handleFormSubmit = async (data: Location) => {
    try {
      if (isEditMode) {
        await updateCountry(Number(id), data);
        notification.success({
          message: 'Cập nhật Khu Vực',
          description: 'Khu vực đã được cập nhật thành công!',
          placement: 'topRight',
        });
      } else {
        await addCountry(data);
        notification.success({
          message: 'Thêm Khu Vực',
          description: 'Khu vực đã được thêm thành công!',
          placement: 'topRight',
        });
      }
      reset(); // Reset form sau khi gửi
      nav('/admin/countries'); // Điều hướng về trang danh sách quốc gia hoặc trang mong muốn
    } catch (error) {
      console.error("Không thể gửi thông tin form:", error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể gửi thông tin form.',
        placement: 'topRight',
      });
    }
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="shadow p-4 rounded bg-light">
        <h1 className="text-center mb-4">{isEditMode ? "Chỉnh sửa Quốc Gia" : "Thêm Quốc Gia"}</h1>
        
        {/* Trường tên quốc gia */}
        <div className="mb-3">
          <label htmlFor="location_name" className="form-label">Tên Quốc Gia</label>
          <input
            type="text"
            className={`form-control ${errors.location_name ? "is-invalid" : ""}`}
            {...register("location_name")}
          />
          {errors.location_name && <span className="text-danger">{errors.location_name.message}</span>}
        </div>

        {/* Nút gửi */}
        <button type="submit" className="btn btn-primary w-100">
          {isEditMode ? "Cập nhật Quốc Gia" : "Thêm Quốc Gia"}
        </button>
      </form>
    </div>
  );
};

export default CountriesForm;

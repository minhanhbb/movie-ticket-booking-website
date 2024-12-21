import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { useCategoryContext } from '../../../Context/CategoriesContext';
import { MovieCategory } from '../../../interface/MovieCategory';
import instance from '../../../server';
import { notification } from 'antd'; // Import notification from Ant Design

// Define schema to validate the form using Zod
const categorySchema = z.object({
  category_name: z.string().min(1, 'Tên thể loại là bắt buộc.').max(30,'Tên thể loại tối đa 30 ký tự').regex(/^[^\d]*$/, "Tên diễn viên không được chứa số."),
});

const CategoriesForm = () => {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { addCategory, updateCategory } = useCategoryContext();

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<MovieCategory>({
    resolver: zodResolver(categorySchema),
  });

  const [category, setCategory] = useState<MovieCategory | null>(null);

  useEffect(() => {
    const fetchCategory = async () => {
      if (isEditMode) {
        try {
          const response = await instance.get(`/manager/movie-category/${id}`);
          const fetchedCategory = response.data.data;
          setCategory(fetchedCategory);
          reset(fetchedCategory);
        } catch (error) {
          console.error('Lấy thông tin thể loại thất bại:', error);
        }
      }
    };

    fetchCategory();
  }, [id, isEditMode, reset]);

  const handleFormSubmit = async (data: MovieCategory) => {
    try {
      if (isEditMode) {
        await updateCategory(Number(id), data);
        notification.success({
          message: 'Cập nhật thể loại thành công!',
          description:"Đã cập nhật thể loại mới vào danh sách"
        });
      } else {
        await addCategory(data);
        notification.success({
          message: 'Thêm thể loại thành công!',
          description:"Đã thêm thể loại mới vào danh sách"
        });
      }
      nav('/admin/categories');
      reset();
    } catch (error) {
      console.error('Gửi form thất bại:', error);
      notification.error({
        message: 'Gửi form thất bại',
        description: 'Có lỗi xảy ra khi gửi form. Vui lòng thử lại.',
      });
    }
  };

  if (isEditMode && !category) return <div>Đang tải...</div>;

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="shadow-lg p-4 rounded bg-white" style={{ maxWidth: "900px", margin: "0 auto",height: "290px" }}>
        <h2 className="text-center mb-4 ">{isEditMode ? 'Chỉnh Sửa Thể Loại' : 'Thêm Mới Thể Loại'}</h2>

        <div className="form-group mb-3">
          <label htmlFor="category_name" className="form-label fw-bold">Tên Thể Loại</label>
          <input
            type="text"
            className={`form-control ${errors.category_name ? 'is-invalid' : ''}`}
            {...register('category_name')}
            defaultValue={category?.category_name || ''}
          />
          {errors.category_name && (
            <div className="invalid-feedback">{errors.category_name.message}</div>
          )}
        </div>

        <div className="d-flex justify-content-center mt-4">
          <button type="submit" className="btn btn-primary px-4 py-2">
            {isEditMode ? 'Cập Nhật Thể Loại' : 'Thêm Thể Loại'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoriesForm;

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../../../server";
import { notification } from "antd"; // Import Ant Design's notification component
import { Actor } from "../../../interface/Actor";
import { useDropzone } from "react-dropzone";
import './ActorDashboard.css'

// Định nghĩa schema cho việc xác thực form sử dụng Zod

const actorSchema = z.object({
  actor_name: z
    .string()
    .min(1, "Tên diễn viên là bắt buộc.").regex(/^[^\d]*$/, "Tên diễn viên không được chứa số."),
  country: z.string().min(1, "Quốc gia là bắt buộc."),
  photo: z.any().optional(),
  link_wiki: z.string().url("Link Wiki phải là URL hợp lệ."),
  descripcion: z
    .string()
    .min(1, "Mô tả là bắt buộc.")
    .max(500, "Mô tả không được vượt quá 500 ký tự."),
});


const ActorForm = () => {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null); // State để lưu ảnh cũ
  const [countries, setCountries] = useState<string[]>([]); // State to store countries data
  const [loadingCountries, setLoadingCountries] = useState<boolean>(true); // Loading state for countries
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<Actor>({
    resolver: zodResolver(actorSchema),
  });

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name");
        const data = await response.json();
        setCountries(data.map((country: { name: { common: string } }) => country.name.common));
      } catch (error) {
        console.error("Error fetching countries:", error);
        notification.error({
          message: "Lỗi khi tải danh sách quốc gia",
          description: "Không thể tải danh sách quốc gia từ API.",
        });
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);
  useEffect(() => {
    const fetchActor = async () => {
      if (id) {
        try {
          const { data } = await instance.get(`/manager/actor/${id}`);
          reset(data.data); // Reset form với dữ liệu đã lấy
          setExistingPhoto(data.data.photo); // Lưu URL ảnh cũ
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu diễn viên:", error);
        }
      }
    };

    
    fetchActor(); // Lấy dữ liệu diễn viên nếu có ID
  }, [id, reset]);

  const handleFormSubmit = async (data: Actor) => {
    if (!selectedFile && !existingPhoto) {
      notification.error({
        message: 'Lỗi xác thực',
        description: 'Ảnh đại diện là bắt buộc!',
        placement: 'topRight',
      });
      return;
    }
  
    const formData = new FormData();
    formData.append("actor_name", data.actor_name);
    formData.append("country", data.country);
    formData.append("link_wiki", data.link_wiki);
    formData.append("descripcion", data.descripcion || "");
    if (selectedFile) {
      formData.append("photo", selectedFile); // Thêm file vào FormData
    }

    // Thêm _method để mô phỏng PUT request
    if (id) {
      formData.append("_method", "PUT");
    }

    try {
      if (id) {
        await instance.post(`/manager/actor/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }); // Cập nhật diễn viên
        notification.success({
          message: "Cập nhật diễn viên thành công!",
        });
      } else {
        await instance.post("/manager/actor", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }); // Thêm diễn viên mới
        notification.success({
          message: "Thêm diễn viên thành công!",
        });
      }
      nav("/admin/actor"); // Chuyển hướng tới trang danh sách diễn viên hoặc trang cần thiết
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu diễn viên:", error);
      notification.error({
        message: "Lỗi khi gửi dữ liệu diễn viên",
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Tạo URL ảnh xem trước
    }
  };
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file)); // Tạo URL ảnh xem trước
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });
  const handleClearImage = () => {
    setSelectedFile(null); // Xóa file đã chọn
    setExistingPhoto(null); // Xóa ảnh cũ nếu có
  };
  

  return (
    <div className="container mt-5">
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="shadow p-4 rounded bg-light"
        style={{ maxWidth: "900px", margin: "0 auto",height: "900px" }}
        encType="multipart/form-data"
      >
        <h1 className="text-center mb-4">
          {id ? "Cập nhật Diễn viên" : "Thêm Diễn viên"}
        </h1>

        {/* Tên diễn viên */}
        <div className="mb-3">
          <label htmlFor="actor_name" className="form-label">
            Tên Diễn viên
          </label>
          <input
            type="text"
            className={`form-control ${errors.actor_name ? "is-invalid" : ""}`}
            {...register("actor_name")}
          />
          {errors.actor_name && (
            <span className="text-danger">{errors.actor_name.message}</span>
          )}
        </div>

        {/* Quốc gia */}
        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            Quốc gia
          </label>
          <select
            className={`form-control ${errors.country ? "is-invalid" : ""}`}
            {...register("country")}
          >
            <option value="">Chọn Quốc gia</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>
                {country}
              </option>
            ))}
          </select>
          {errors.country && (
            <span className="text-danger">{errors.country.message}</span>
          )}
        </div>


{/* Ảnh cũ và chọn ảnh mới */}
<div className="mb-3">
  <label htmlFor="photo" className="form-label">
    Ảnh
  </label>
  <div
    {...getRootProps()}
    className="upload-area-modern p-4 rounded text-center"
    style={{
      border: "2px dashed #007bff",
      position: "relative",
      height: "200px",
      overflow: "hidden",
    }}
  >
    <input {...getInputProps()} />
    {previewImage ? (
      <>
        <img
          src={previewImage}
          alt="Ảnh xem trước"
          className="img-fluid"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <button
          type="button"
          className="btn btn-danger btn-sm"
          onClick={handleClearImage}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            zIndex: 10,
          }}
        >
          Xóa ảnh
        </button>
      </>
    ) : (
      <div className="upload-content d-flex flex-column align-items-center justify-content-center h-100">
        <p className="fw-bold mb-2">
          Kéo thả ảnh vào đây hoặc <span className="text-primary">bấm để chọn</span>
        </p>
        <small className="text-muted">Định dạng ảnh: JPG, PNG. Kích thước tối đa 5MB</small>
      </div>
    )}
  </div>
</div>




        {/* Link Wiki */}
        <div className="mb-3">
          <label htmlFor="link_wiki" className="form-label">
            Link Wiki (URL)
          </label>
          <input
            type="text"
            className={`form-control ${errors.link_wiki ? "is-invalid" : ""}`}
            {...register("link_wiki")}
          />
          {errors.link_wiki && (
            <span className="text-danger">{errors.link_wiki.message}</span>
          )}
        </div>

        {/* Mô tả */}
        <div className="mb-3">
          <label htmlFor="descripcion" className="form-label">
            Mô tả
          </label>
          <textarea
            className={`form-control ${errors.descripcion ? "is-invalid" : ""}`}
            {...register("descripcion")}
          ></textarea>
          {errors.descripcion && (
            <span className="text-danger">{errors.descripcion.message}</span>
          )}
        </div>

        <div className="mb-3">
          <button className="btn btn-primary w-30">
            {id ? "Cập nhật Diễn viên" : "Thêm Diễn viên"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ActorForm;

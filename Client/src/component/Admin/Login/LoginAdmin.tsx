import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import instance from "../../../server";
import { loginSchema, LoginSchema } from "../../../utils/validationSchema";
import { notification } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import './LoginAdmin.css'

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  const openNotificationWithIcon = (type: "success" | "error", message: string, description: string) => {
    notification[type]({
      message: message ?? "Thông báo",
      description,
    });
  };
  const [userRole, setUserRole] = useState<string>("");
  useEffect(() => {
    // Lấy thông tin từ localStorage
    const userData = JSON.parse(localStorage.getItem("user_profile") || "{}");
    const roles = userData.roles || [];
    // console.log("data role:", roles);
    // Lấy vai trò đầu tiên (nếu có)
    if (roles.length > 0) {
      setUserRole(roles[0].name); // Gán vai trò (ví dụ: "staff", "admin")
    }
  }, []);

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      const response = await instance.post("/login", data);
      if (response.status === 200 && response.data.data.token) {
        const { token, profile } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", profile.id);
        localStorage.setItem("user_profile", JSON.stringify(profile));

        // Thiết lập token cho các yêu cầu API tiếp theo
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        openNotificationWithIcon("success", "Đăng nhập thành công", "Bạn đã đăng nhập thành công.");
        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "manager") {
          navigate("/admin/dashboard");
        } else if (userRole === "staff") {
          navigate("/admin/orders");
        }

      } else {
        openNotificationWithIcon("error", "Lỗi", "Đăng nhập không thành công.");
      }
    } catch (error: any) {
      if (error.response) {
        if (error.response.status === 401) {
          openNotificationWithIcon("error", "Lỗi đăng nhập", "Mật khẩu không chính xác.");
        } else if (error.response.status === 403) {
          openNotificationWithIcon("error", "Lỗi đăng nhập", "Tài khoản chưa được kích hoạt, vui lòng kiểm tra email.");
        } else if (error.response.status === 404) {
          openNotificationWithIcon("error", "Lỗi đăng nhập", "Tài khoản không tồn tại.");
        } else {
          openNotificationWithIcon("error", "Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại sau.");
        }
      } else {
        openNotificationWithIcon("error", "Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await instance.post("/get-google-sign-in-url");
      if (response.status === 200 && response.data.url) {
        window.location.href = response.data.url;
      } else {
        openNotificationWithIcon("error", "Lỗi", "Không lấy được đường dẫn đăng nhập bằng Google.");
      }
    } catch (error: any) {
      openNotificationWithIcon("error", "Lỗi", "Đã xảy ra lỗi khi yêu cầu đăng nhập bằng Google.");
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const profile = urlParams.get("profile");

    if (token && profile) {
      localStorage.setItem("token", token);
      localStorage.setItem("user_profile", profile);
      instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      openNotificationWithIcon("success", "Đăng nhập thành công", "Bạn đã đăng nhập thành công bằng Google.");
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (errors.email) {
      openNotificationWithIcon("error", "Lỗi xác thực", errors.email.message ?? "Có lỗi xảy ra.");
    }
    if (errors.password) {
      openNotificationWithIcon("error", "Lỗi xác thực", errors.password.message ?? "Có lỗi xảy ra.");
    }
  }, [errors]);
  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="input-group">
            <label>Email</label>
            <input type="email" {...register("email")} />
          </div>
          <div className="input-group">
            <label>Mật khẩu</label>
            <input type="password" {...register("password")} />
          </div>
          <button type="submit" className="login-button">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
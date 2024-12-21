import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import instance from "../../server";
import { loginSchema, LoginSchema } from "../../utils/validationSchema";

import "./Login.css";
import { notification } from "antd";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
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

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      const response = await instance.post("/login", data);
      
      if (response.status === 200) {
        const { token, profile } = response.data.data;
        localStorage.setItem("token", token);
        localStorage.setItem("user_id", profile.id);
        localStorage.setItem("user_profile", JSON.stringify(profile));
  
        instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
        openNotificationWithIcon("success", "Đăng nhập thành công", "Bạn đã đăng nhập thành công.");
        navigate("/");
      } else {
        openNotificationWithIcon("error", "Lỗi", response.data.message || "Đăng nhập không thành công.");
      }
    } catch (error: any) {
      if (error.response) {
        const errorMessage = error.response.data.message || "Đã xảy ra lỗi. Vui lòng thử lại sau.";
  
        if (error.response.status === 401) {
          openNotificationWithIcon("error", "Lỗi đăng nhập", errorMessage || "Mật khẩu không chính xác.");
        } else if (error.response.status === 403) {
          openNotificationWithIcon("error", "Lỗi đăng nhập", errorMessage || "Tài khoản chưa được kích hoạt, vui lòng kiểm tra email.");
        } else if (error.response.status === 404) {
          openNotificationWithIcon("error", "Lỗi đăng nhập", errorMessage || "Tài khoản không tồn tại.");
        } else {
          openNotificationWithIcon("error", "Lỗi", errorMessage);
        }
      } else {
        openNotificationWithIcon("error", "Lỗi", "Đã xảy ra lỗi. Vui lòng thử lại sau.");
      }
    }
  };
  

  return (
    
    <div className="login-container">
      <div className="login-form">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Input */}
          <div className="form-group">
            <label>Email</label>
            <input type="text" {...register("email")} />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" {...register("password")} />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>

        {/* <button
          className="google-login-button login-button"
          onClick={() => {}}
        >
          <FaGoogle style={{ marginRight: "10px" }}/>Đăng nhập bằng Google
        </button> */}

        <div className="form-footer">
          <Link className="forgot-password" to="/forgetpass">
            Quên mật khẩu?
          </Link>
          <p className="register-link">
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay!</Link>
          </p>
        </div>
      </div>
      <div className="login-image">
        <img
          src="https://cdn.moveek.com/bundles/ornweb/img/mascot.png"
          alt="Mascot"
        />
      </div>
    </div>
  );
};

export default Login;
import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";

interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
}

interface UserProfile {
  roles: Role[];
}

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, allowedRoles }) => {
  const userProfile: UserProfile | null = JSON.parse(localStorage.getItem("user_profile") || "null");
  const userRoles = userProfile?.roles || []; // Lấy danh sách vai trò nếu có

 
  if (!userProfile) {
    // Nếu không có người dùng, điều hướng đến trang đăng nhập
    return <Navigate to="/login" />;
  }

  // Kiểm tra xem người dùng có vai trò phù hợp không
  if (allowedRoles && !allowedRoles.some(role => 
    userRoles.some((userRole: Role) => userRole.name === role)
  )) {
    // Nếu vai trò không được phép, điều hướng đến trang chính hoặc thông báo
    return <Navigate to="/" />;
  }

  return <>{children}</>; // Nếu tất cả điều kiện thỏa mãn, trả về children
};

export default PrivateRoute;

import React, { useEffect, useRef, useState } from 'react';
import { Roles } from '../../../interface/Roles';
import { User } from '../../../interface/User';
import { Permission } from '../../../interface/Permissions';
import instance from '../../../server';
import { Modal, notification, Pagination } from 'antd';

const RoleAndUserManagement = () => {
  const [roles, setRoles] = useState<Roles[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<{ [key: string]: string[] }>({});
  const [userRole, setUserRole] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredUsers = users.filter((user) =>
    user.user_name.toLowerCase().includes(searchTerm.toLowerCase())

  );
  const rolesRef = useRef<Roles[]>([])
 
  // Fetch user role from localStorage
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user_profile") || "{}");
    const roles = userData.roles || [];
    
    if (roles.length > 0) {
      setUserRole(roles[0].name);
    } else {
      setUserRole("unknown"); // Gán giá trị mặc định khi không có vai trò
    }
  }, []);
  const fetchRolesAndUsers = async () => {
    try {
      let response;
      if (userRole === "admin") {
        response = await instance.get('/admin/roles');
      } else if (userRole === "manager") {
        response = await instance.get('/manager/roles');
      } else {
        response = await instance.get('/roles');
      }
      if (response.data.message === "Success") {
        setRoles(response.data.data.roles);
        setUsers(response.data.data.users);
        setPermissions(response.data.data.permissions);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };
  useEffect(() => {
    if (
      !rolesRef.current.length || // Chỉ gọi API lần đầu
      JSON.stringify(rolesRef.current) !== JSON.stringify(roles) // Gọi API nếu roles thay đổi
    ) {
      fetchRolesAndUsers();
      rolesRef.current = roles; // Cập nhật ref sau khi gọi API
    }
  }, [userRole, roles]);
  

  const handleCreateRole = async () => {
    if (!newRoleName) {
      notification.error({
        message: 'Tên vai trò không thể trống!',
      });
      return;
    }
    try {
      let response;
      if (userRole === "admin") {
        response = await  instance.post('/admin/roles', { name: newRoleName });
      } else if (userRole === "manager") {
        response = await  instance.post('/manager/roles', { name: newRoleName });
      }else {
        response = await instance.post('/roles', { name: newRoleName });
      }
      if (response.data.status) {
setRoles((prevRoles) => [...prevRoles, response.data.data.roles]);
        setNewRoleName('');
        notification.success({
          message: 'Tạo vai trò thành công!',
        });
      } else {
        notification.error({
          message: 'Tạo vai trò thất bại',
          description: response.data.message,
        });
      }
    } catch (error: unknown) {
      console.error('Error assigning roles:', error);
    if (error instanceof Error) {
      notification.error({
        message: 'Lỗi khi cấp quyền',
        description: error.message,
      });
    } else {
      notification.error({
        message: 'Lỗi không xác định',
      });
    }
  }
  };

  const handleDeleteRole = async (roleId: string) => {
    try {
      let response;
      if (userRole === "admin") {
        response = await  instance.delete(`/admin/roles/${roleId}`);
      } else if (userRole === "manager") {
        response = await  instance.delete(`/manager/roles/${roleId}`);
      }else {
        response = await instance.delete(`/roles/${roleId}`);
      }
      if (response.data.status) {
        Modal.confirm({
          title: 'Xác nhận xóa',
          content: 'Bạn có chắc chắn muốn xóa vai trò này không?',
          okText: 'Xóa',
          cancelText: 'Hủy',
          onOk: () => {
            // Thực hiện xóa vai trò
            response.data.status && notification.success({
              message: 'Xóa Vai Trò Thành Công!',
            });
            setRoles((prevRoles) => prevRoles.filter((role) => role.id !== roleId));
          },
        });
      
        
      } else {
        console.error('Failed to delete role:', response.data.message);
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };
  const handleAssignRoles = async (userId: number, selectedRoles: string[]) => {
    const selectedRoleNames = selectedRoles.map(role => role.toLowerCase());
    const isManagerOrStaff = selectedRoleNames.includes('manager') || selectedRoleNames.includes('staff') ;
  
    // Nếu người dùng chọn "manager" hoặc "staff", yêu cầu nhập cinema_id
    let cinemaId: string | null = null;
    if (isManagerOrStaff) {
      cinemaId = prompt("Vui lòng nhập Cinema ID:");
      if (!cinemaId) {
        Modal.warning({
          title: 'Thông báo',
          content: 'Cinema ID là bắt buộc đối với vai trò Quản lý hoặc Nhân viên!',
          okText: 'Đã hiểu',
        });
        return; // Dừng lại nếu không có cinema_id
      }
    }
  
    try {
      // Tạo payload yêu cầu
      const requestPayload: { roles: string[], cinema_id?: string } = {
        roles: selectedRoles,
      };
  
      // Nếu có cinemaId, thêm vào payload
      if (cinemaId) {
        requestPayload.cinema_id = cinemaId;
      }
  
      // Gửi yêu cầu API để đồng bộ vai trò
      let response;
      if (userRole === "admin") {
        response = await  instance.post(`/admin/roles/${userId}/users`, requestPayload);
      } else if (userRole === "manager") {
        response = await  instance.post(`/manager/roles/${userId}/users`, requestPayload);
      }else {
        response = await instance.post(`/roles/${userId}/users`, requestPayload);
      }
      if (response.data.message) {
        notification.success({
          message: 'Cập nhật quyền thành công!',
        });
        // Cập nhật vai trò của người dùng trong giao diện
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
user.id === userId ? { ...user, roles: selectedRoles } : user
          )
        );
      } else {
        notification.error({
          message: 'Cập nhật quyền thất bại',
          description: response.data.message,
        });
      }
    } catch (error) {
      console.error('Error assigning roles:', error);
    if (error instanceof Error) {
      notification.error({
        message: 'Lỗi khi cấp quyền',
        description: error.message,
      });
    } else {
      notification.error({
        message: 'Lỗi không xác định',
      });
    }
    }
  };
  
  
  const handleUpdatePermissions = async (roleId: string) => {
    const permissionsToUpdate = selectedPermissions[roleId]?.map((permissionName) => {
      const permission = permissions.find((p) => p.name === permissionName);
      return { id: permission?.id, name: permissionName };
    });
  
   
  
    try {
      let response;
      if (userRole === "admin") {
        response = await instance.post(`/admin/roles/${roleId}/permissions`, {
          permissions: permissionsToUpdate,
        });;
      } else if (userRole === "manager") {
        response = await instance.post(`/manager/roles/${roleId}/permissions`, {
          permissions: permissionsToUpdate,
        });;
      }else {
        response = await instance.post(`/roles/${roleId}/permissions`, {
          permissions: permissionsToUpdate,
        });;
      }
      
      if (response.data) {
        notification.success({
          message: 'Cập nhật quyền thành công!',
        });
      } else {
        console.error('Failed to update permissions:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };
  

  const handlePermissionChange = (roleId: string, selectedOptions: string[]) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [roleId]: selectedOptions,
    }));
  };

  return (
    <div style={{ backgroundColor: '#ffffff', color: '#000000', padding: '20px', width: '100%', margin: 'auto' }}>
      <h2>Quản lý vai trò và quyền</h2>
      <div style={{ marginBottom: '30px' }}>
        <h3>Tạo vai trò mới</h3>
        <input
          type="text"
          placeholder="Tên vai trò"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            color: '#000',
          }}
        />
        <button
          onClick={handleCreateRole}
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Tạo vai trò
        </button>

        <h3 style={{ marginTop: '20px' }}>Vai trò hiện có</h3>
<table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tên vai trò</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Quyền</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => (
              <tr key={role?.id}>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>{role?.name}</td>
                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <select
                    multiple
                    value={selectedPermissions[role?.id] || []}
                    onChange={(e) =>
                      handlePermissionChange(
                        role?.id,
                        Array.from(e.target.selectedOptions, (option) => option.value)
                      )
                    }
                    style={{
                      width: '100%',
                      backgroundColor: '#f9f9f9',
                      color: '#000',
                      border: '1px solid #ccc',
                      borderRadius: '5px',
                      padding: '5px',
                    }}
                  >
                    {permissions.map((permission) => (
                      <option key={permission?.id} value={permission?.name}>
                        {permission?.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                  <button
                    onClick={() => handleUpdatePermissions(role.id)}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      marginRight: '10px',
                    }}
                  >
                    Cập nhật quyền
                  </button>
                  <button
                    onClick={() => handleDeleteRole(role.id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Xóa vai trò
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>Quản lý người dùng</h2>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
placeholder="Tìm kiếm theo tên người dùng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            marginBottom: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#f9f9f9',
            color: '#000',
          }}
        />
      </div>
      <div>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Tên người dùng</th>
              <th style={{ padding: '10px', border: '1px solid #ddd' }}>Vai trò</th>
            </tr>
          </thead>
          <tbody>
          {filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize).map((user) => (
    <tr key={user.id}>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.user_name}</td>
      <td style={{ padding: '10px', border: '1px solid #ddd' }}>
        <select
          multiple
          value={user?.role_id}  // Giữ trạng thái của các vai trò hiện tại của người dùng
          onChange={(e) => {
            const selectedRoles = Array.from(e.target.selectedOptions, option => option.value);
            handleAssignRoles(user.id, selectedRoles); // Cấp quyền khi chọn vai trò
          }}
          style={{
            width: '100%',
            backgroundColor: '#f9f9f9',
            color: '#000',
            border: '1px solid #ccc',
            borderRadius: '5px',
            padding: '5px',
          }}
        >
          {roles.map((role) => (
            <option key={role?.id} value={role?.name}>{role?.name}</option>
          ))}
        </select>
      </td>
    
    </tr>
  ))}
</tbody>

        </table>
        <div className="d-flex justify-content-center mt-4">
    <Pagination
      current={currentPage}
      pageSize={pageSize}
      total={users.length}
      onChange={(page, pageSize) => {
        setCurrentPage(page);
        setPageSize(pageSize);
      }}
    />
  </div>
      </div>
    </div>
  );
};

export default RoleAndUserManagement;
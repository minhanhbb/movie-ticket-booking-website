import React, { useState, useEffect } from 'react';
import instance from '../../../server';
import { notification } from 'antd'; // Import notification

interface WebsiteSetting {
    id: number;
    site_name: string;
    tagline: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    working_hours: string | null;
    business_license: string | null;
    facebook_link: string;
    youtube_link: string | null;
    instagram_link: string | null;
    copyright: string | null;
    privacy_policy: string | null;
    logo: File | null;
    privacy_image: File | null;
    terms_image: File | null;
    about_image: File | null;
    created_at: string | null;
    updated_at: string | null;
    [key: string]: any;  
}

const WebsiteSettings: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSetting | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await instance.post('/admin/website-settings');
        setSettings(response.data.data[0]);
      } catch (err: any) {
        setError(err.message || 'Lỗi khi tải cấu hình.');
        notification.error({
          message: 'Lỗi',
          description: err.message || 'Lỗi khi tải cấu hình.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
  
    try {
      setLoading(true);
      const formData = new FormData();
  
      for (const key in settings) {
        if (
          settings[key] !== null &&
          key !== "logo" &&
          key !== "privacy_image" &&
          key !== "terms_image" &&
          key !== "about_image"
        ) {
          formData.append(key, settings[key] as string);
        }
      }
  
      if (settings.logo instanceof File) formData.append("logo", settings.logo);
      if (settings.privacy_image instanceof File)
        formData.append("privacy_image", settings.privacy_image);
      if (settings.terms_image instanceof File)
        formData.append("terms_image", settings.terms_image);
      if (settings.about_image instanceof File)
        formData.append("about_image", settings.about_image);
  
      const response = await instance.post(
        `/admin/website-settings/update/${settings.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
  
      notification.success({
        message: 'Cập nhật thành công',
        description: response.data.message || "Cập nhật thành công!",
      });
    } catch (err: any) {
      setError(err.message || "Lỗi khi cập nhật.");
      notification.error({
        message: 'Lỗi',
        description: err.message || 'Lỗi khi cập nhật.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      const fileInput = e.target as HTMLInputElement;
      const files = fileInput.files;
      if (files && files[0].type.match(/image\/(jpeg|png|jpg|gif)/)) {
        setSettings((prev) => (prev ? { ...prev, [name]: files[0] } : null));
      } else {
        notification.error({
          message: 'Lỗi',
          description: 'Vui lòng chọn tệp hình ảnh hợp lệ!',
        });
      }
    } else {
      setSettings((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };

  const resetSettings = async () => {
    try {
      setLoading(true);
      const response = await instance.post('/admin/website-settings/reset');
      
      // Kiểm tra xem API trả về có chứa trường data hay không
      if (response.data && response.data.data) {
        // Kiểm tra xem dữ liệu có phải là một đối tượng hợp lệ không
        if (response.data.data.id) {
          setSettings(response.data.data); // Cập nhật lại state settings
          notification.success({
            message: 'Đặt lại thành công',
            description: response.data.message || 'Đặt lại cấu hình thành công!',
          });
        } else {
          throw new Error('Dữ liệu không hợp lệ.');
        }
      } else {
        throw new Error('API không trả về dữ liệu đúng.');
      }
    } catch (err: any) {
      console.error(err); // In ra lỗi nếu có
      setError(err.message || 'Lỗi khi đặt lại cấu hình.');
      notification.error({
        message: 'Lỗi',
        description: err.message || 'Lỗi khi đặt lại cấu hình.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Cấu Hình Website</h1>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded border" style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Group: Thông tin chung */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Tên trang web</label>
            <input
              type="text"
              name="site_name"
              value={settings?.site_name || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Khẩu hiệu</label>
            <input
              type="text"
              name="tagline"
              value={settings?.tagline || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Group: Liên hệ */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={settings?.email || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Số điện thoại</label>
            <input
              type="text"
              name="phone"
              value={settings?.phone || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Địa chỉ</label>
            <input
              type="text"
              name="address"
              value={settings?.address || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Group: Mạng xã hội */}
        <div className="row">
          <div className="col-md-4 mb-3">
            <label className="form-label">Facebook Link</label>
            <input
              type="text"
              name="facebook_link"
              value={settings?.facebook_link || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">YouTube Link</label>
            <input
              type="text"
              name="youtube_link"
              value={settings?.youtube_link || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col-md-4 mb-3">
            <label className="form-label">Instagram Link</label>
            <input
              type="text"
              name="instagram_link"
              value={settings?.instagram_link || ''}
              onChange={handleChange}
              className="form-control"
            />
          </div>
        </div>

        {/* Group: Hình ảnh */}
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Logo</label>
            <input
              type="file"
              name="logo"
              onChange={handleChange}
              className="form-control"
              accept="image/jpeg, image/png, image/jpg"
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Ảnh Chính Sách Quyền Riêng Tư</label>
            <input
              type="file"
              name="privacy_image"
              onChange={handleChange}
              className="form-control"
              accept="image/jpeg, image/png, image/jpg"
            />
          </div>
        </div>

        <div className="d-flex justify-content-end">
        <button
    type="button"
    className="btn btn-secondary me-2"
    disabled={loading}
    onClick={resetSettings}
  >
    {loading ? 'Đang Đặt Lại...' : 'Đặt Lại'}
  </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Đang Cập Nhật...' : 'Cập Nhật'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WebsiteSettings;

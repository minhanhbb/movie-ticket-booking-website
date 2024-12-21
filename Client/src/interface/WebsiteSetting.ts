export interface WebsiteSetting {
    id: number; // ID tự tăng
    site_name: string; // Tên trang web
    tagline: string | null; // Khẩu hiệu
    email: string | null; // Email liên hệ
    phone: string | null; // Số điện thoại
    address: string | null; // Địa chỉ
    working_hours: string | null; // Giờ làm việc
    business_license: string | null; // Giấy phép kinh doanh
    facebook_link: string; // Liên kết Facebook
    youtube_link: string | null; // Liên kết YouTube
    instagram_link: string | null; // Liên kết Instagram
    copyright: string | null; // Bản quyền
    privacy_policy: string | null; // Chính sách bảo mật
    logo: string | null; // Đường dẫn ảnh logo
    privacy_image: string | null; // Ảnh minh họa chính sách bảo mật
    terms_image: string | null; // Ảnh minh họa điều khoản
    about_image: string | null; // Ảnh minh họa giới thiệu
    created_at: string | null; // Thời gian tạo
    updated_at: string | null; // Thời gian cập nhật
  }
  
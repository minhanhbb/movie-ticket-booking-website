<?php

namespace App\Http\Controllers\Api\WebsiteSetting;

use App\Http\Controllers\Controller;
use App\Models\WebsiteSetting;
use Illuminate\Http\Request;

class WebsiteSettingController extends Controller
{
    public function index(){
        $settings = WebsiteSetting::all();
        return $this->success($settings, 'Cấu hình Website');
    }
    public function update(Request $request,$id)
    {
        $data = $request->validate([
            'site_name' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'working_hours' => 'nullable|string|max:50',
            'business_license' => 'nullable|string|max:255',
            'facebook_link' => 'nullable|max:255',
            'youtube_link' => 'nullable|max:255',
            'instagram_link' => 'nullable|max:255',
            'copyright' => 'nullable|string|max:255',
            'privacy_policy' => 'nullable|string',
            'logo' => 'nullable|mimes:jpeg,png,jpg,gif',
            'privacy_image' => 'nullable|mimes:jpeg,png,jpg,gif',
            'terms_image' => 'nullable|mimes:jpeg,png,jpg,gif',
            'about_image' => 'nullable|mimes:jpeg,png,jpg,gif',
        ]);

        $settings = WebsiteSetting::query()->findOrFail($id);

        // Upload hình ảnh nếu có
        $data['logo'] = $request->hasFile('logo') ? $this->uploadImage($request->file('logo')) : $settings->logo;
        $data['privacy_image'] = $request->hasFile('privacy_image') ? $this->uploadImage($request->file('privacy_image')) : $settings->privacy_image;
        $data['terms_image'] = $request->hasFile('terms_image') ? $this->uploadImage($request->file('terms_image')) : $settings->terms_image;
        $data['about_image'] = $request->hasFile('about_image') ? $this->uploadImage($request->file('about_image')) : $settings->about_image;

        $settings->update($data);

        return $this->success($settings, 'Cập nhập thành công', 200);
    }

    // Đặt lại cấu hình về mặc định
    public function reset()
    {
        $settings = WebsiteSetting::first();

        //Dữ liệu mặc định
        $settings->update([
            'site_name' => 'Flickhive  Cinemas',
            'tagline' => 'Hãy đặt vé Xem phim ngay!',
            'email' => 'Flickhivecinema@poly.com',
            'phone' => '0123456789',
            'address' => 'Tòa nhà FPT Polytechnic, Hà Nội',
            'working_hours' => '7:00 - 22:00',
            'business_license' => 'Đây là giấy phép kinh doanh',
            'facebook_link' => 'https://facebook.com/',
            'youtube_link' => 'https://youtube.com/',
            'instagram_link' => 'https://instagram.com/',
            'copyright' => 'Bản quyền © 2024 Poly Cinemas',
            'privacy_policy' => '<p>Chính sách bảo mật mặc định</p>',
            'logo' => 'default/logo.png',
            'privacy_image' => 'default/privacy.png',
            'terms_image' => 'default/terms.png',
            'about_image' => 'default/about.png',
        ]);

        return $this->success($settings, 'Đặt về mặc định thành công!', 200);
    }
}

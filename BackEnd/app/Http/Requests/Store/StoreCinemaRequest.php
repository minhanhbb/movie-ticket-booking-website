<?php

namespace App\Http\Requests\Store;

use Illuminate\Foundation\Http\FormRequest;

class StoreCinemaRequest extends FormRequest
{
    /**
     * Xác định xem người dùng có được phép thực hiện yêu cầu này không.
     */
    public function authorize(): bool
    {
        return true; // Trả về true nếu yêu cầu có quyền truy cập
    }

    /**
     * Nhận các quy tắc xác thực áp dụng cho yêu cầu.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'cinema_name' => 'required|string|max:255',
            'slug' => 'nullable|unique:cinema,slug|max:255',
            'phone' => 'nullable|numeric|digits_between:10,15',
            'city' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'description' => 'nullable|string|max:1000',
            'location_id' => 'nullable|integer|exists:location,id',
            'cinema_address' => 'nullable|string|max:255',

        ];
    }

    /**
     * Nhận tên hiển thị cho các trường trong thông báo lỗi.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'cinema_name.required' => 'Tên rạp không được để trống.',
            'cinema_name.string' => 'Tên rạp phải là một chuỗi.',
            'cinema_name.max' => 'Tên rạp không được vượt quá 255 ký tự.',
            'slug.unique' => 'Slug này đã được sử dụng, vui lòng chọn một slug khác.',
            'slug.string' => 'Slug phải là một chuỗi hợp lệ.',
            'slug.max' => 'Slug không được vượt quá 255 ký tự.',
            'phone.regex' => 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam hợp lệ (ví dụ: 090xxxxxxx hoặc +8490xxxxxxx).',
            'city.string' => 'Thành phố phải là một chuỗi hợp lệ.',
            'city.max' => 'Tên thành phố không được vượt quá 255 ký tự.',
            'image.image' => 'Ảnh phải là một tệp hình ảnh hợp lệ.',
            'image.mimes' => 'Ảnh phải có định dạng: jpeg, png, jpg, gif, svg.',
            'image.max' => 'Dung lượng ảnh không được vượt quá 2MB.',
            'description.string' => 'Mô tả phải là một chuỗi hợp lệ.',
            'description.max' => 'Mô tả không được vượt quá 1000 ký tự.',
            'location_id.integer' => 'Vị trí phải là một số nguyên hợp lệ.',
            'location_id.exists' => 'Vị trí không tồn tại trong hệ thống.',
            'cinema_address.string' => 'Địa chỉ phải là một chuỗi hợp lệ.',
            'cinema_address.max' => 'Địa chỉ không được vượt quá 255 ký tự.',
        ];
    }

    /**
     * Nếu bạn muốn sử dụng tên hiển thị khác cho các trường trong thông báo lỗi.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'cinema_name' => 'Tên rạp',
            'slug' => 'Slug',
            'phone' => 'Số điện thoại',
            'city' => 'Thành phố',
            'image' => 'Ảnh',
            'description' => 'Mô tả',
            'location_id' => 'Vị trí',
            'cinema_address' => 'Địa chỉ rạp',
            'status' => 'Trạng thái',
        ];
    }
}

<?php

namespace App\Http\Requests\Update;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "user_name" => "string",
            "sex" => "string",
            "email" => "email",
            "password" => "string",
            "avatar" => "nullable|mimes:jpeg,png,jpg,gif",
            'cover' => 'nullable|image|mimes:jpeg,png,jpg,gif',
            "phone" => "nullable|string",
            "description" => "nullable|string",
            "address" => "nullable|string",
            "fullname" => "nullable|string",
            "coin" => "nullable|integer",
            "status" => "nullable|string",
            "role_id" => "nullable|integer",
            "email_verified_at" => "nullable|date",
        ];
    }
}

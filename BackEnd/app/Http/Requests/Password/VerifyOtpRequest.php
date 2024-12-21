<?php

namespace App\Http\Requests\Password;

use Illuminate\Foundation\Http\FormRequest;

class VerifyOtpRequest extends FormRequest
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
            'otp' => 'required|size:6',
        ];
    }

    public function messages(): array
    {
        return [
            'otp.required' => 'The OTP field is required.',
            'otp.size' => 'The OTP must be 6 characters.',
        ];
    }
}

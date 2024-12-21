<?php

namespace App\Http\Requests\NewCategory;

use Illuminate\Foundation\Http\FormRequest;

class UpdateNewsCategoryRequest extends FormRequest
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
            'news_category_name' => 'required|string|max:255',
            'descriptions' => 'string|max:255',
        ];
    }
    public function messages(): array
    {
        return [
            'news_category_name.required' => 'The news category name field is required.',
            'news_category_name.string' => 'The news category name must be a string.',
            'news_category_name.max' => 'The news category name may not be greater than 255 characters.',
            'descriptions.string' => 'The descriptions must be a string.',
            'descriptions.max' => 'The descriptions may not be greater than 255 characters.',
        ];
    }
}

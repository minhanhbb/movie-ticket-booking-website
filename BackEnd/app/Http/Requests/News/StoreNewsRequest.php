<?php

namespace App\Http\Requests\News;

use Illuminate\Foundation\Http\FormRequest;

class StoreNewsRequest extends FormRequest
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
            'title' => 'required|string|max:255',
            'news_category_id' => 'required',
            'slug' => 'string',
            'thumnail' => 'required|mimes:jpeg,png,jpg,gif',
            'banner' => 'required|mimes:jpeg,png,jpg,gif',
            'content' => 'required|string',
            'user_id' => 'required',
        ];
    }
    public function messages(): array
    {
        return [
            'title.required' => 'the title field is required.',
            'title.string' => 'the title must be a string.',
            'title.max' => 'the title may not be greater than 255 characters.',
            'news_category_id.required' => 'the news category field is required.',
            'thumnail.required' => 'the thumnail field is required.',
            'thumnail.mimes' => 'the thumnail must be a file of type: jpeg, png, jpg, gif.',
            'thumnail.max' => 'the thumnail may not be greater than 2048 kb.',
            'banner.required' => 'the banner field is required.',
            'banner.mimes' => 'the banner must be a file of type: jpeg, png, jpg, gif.',
            'banner.max' => 'the banner may not be greater than 2048 kb.',
            'content.required' => 'the content field is required.',
            'content.string' => 'the content must be a string.',
            'user_id.required' => 'the user id field is required.',
        ];
    }
}

<?php

namespace App\Http\Requests\Movie\Store;


use Illuminate\Foundation\Http\FormRequest;

class StoreActorRequest extends FormRequest
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
            'actor_name' => 'required|string|max:255|unique:actor',
            'descripcion' => 'max:255',
            'photo' => 'mimes:jpeg,png,jpg,gif|max:2048',
            'country' => 'max:255',
            'slug' => 'max:255',
            'link_wiki' => 'max:255',
        ];
    }
}

<?php

namespace App\Http\Requests\Update;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMatrixRequest extends FormRequest
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
            "name" => "string",
            "rows" => "required|integer",
            "columns" => "integer",
            "row_regular_seat" => "integer",
            "row_vip_seat" => "integer",
            "row_couple_seat" => "integer",
            "status" => "string",
        ];
    }
}

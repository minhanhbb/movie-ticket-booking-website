<?php

namespace App\Http\Requests\Update;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSeatMapRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'matrix_row' => 'sometimes|integer|min:1',
            'matrix_column' => 'sometimes|integer|min:1',
            'row_regular_seat' => 'required|integer|min:2',
            'row_vip_seat' => 'required|integer|min:2',
            'row_couple_seat' => 'required|integer|min:2',
            'seat_structure' => 'nullable|array',
            'seat_structure.*.label' => 'required|string',
            'seat_structure.*.linkedSeat' => 'nullable|string',
            'seat_structure.*.row' => 'required|string|max:1',
            'seat_structure.*.column' => 'required|integer',
            'seat_structure.*.type' => 'required|string|in:Regular,VIP,Couple',
            'seat_structure.*.status' => 'required|boolean',
            'seat_structure.*.is_double' => 'required|boolean',
        ];
    }
}

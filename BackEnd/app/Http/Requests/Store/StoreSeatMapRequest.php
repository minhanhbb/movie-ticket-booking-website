<?php

namespace App\Http\Requests\Store;

use Illuminate\Foundation\Http\FormRequest;

class StoreSeatMapRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'matrix_row' => 'required|integer|min:1',
            'matrix_column' => 'required|integer|min:1',
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

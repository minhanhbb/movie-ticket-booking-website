<?php

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;

class TicketBookingRequest extends FormRequest
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
            'showtime_id' => 'required|integer|exists:showtimes,id',
            'amount' => 'required',
            'pay_method_id' => 'required|integer',
        ];
    }

    public function messages(): array
    {
        return [
            'showtime_id.required' => 'Showtime ID is required',
            'amount.required' => 'Amount is required',
            'pay_method_id.required' => 'Payment method is required',
        ];
    }
}

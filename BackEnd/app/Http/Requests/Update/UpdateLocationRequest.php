<?php

namespace App\Http\Requests\Update;

use Illuminate\Foundation\Http\FormRequest;

class UpdateLocationRequest extends FormRequest
{
    public function authorize()
    {
        return true; // You can add authorization logic here if needed
    }

    public function rules()
    {
        return [
            'location_name' => 'sometimes|string|max:255',

        ];
    }
}

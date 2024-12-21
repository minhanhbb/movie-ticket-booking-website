<?php

namespace App\Http\Requests\Store;

use Illuminate\Foundation\Http\FormRequest;

class StoreLocationRequest extends FormRequest
{
    public function authorize()
    {
        return true; // You can add authorization logic here if needed
    }

    public function rules()
    {
        return [
            'location_name' => 'required|string|max:255',
        ];
    }
}

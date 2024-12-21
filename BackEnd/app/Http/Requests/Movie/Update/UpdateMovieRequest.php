<?php

namespace App\Http\Requests\Movie\Update;

use Illuminate\Foundation\Http\FormRequest;

class UpdateMovieRequest extends FormRequest
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
            'movie_name' => 'required|string|max:255',
            'slug' => 'max:255',
            'poster' => 'mimes:jpeg,png,jpg,gif',
            'thumbnail' => 'mimes:jpeg,png,jpg,gif',
            'trailer' => 'string|max:255',
            'duration' => 'string|max:225',
            'age_limit' => 'required|integer',
            'country' => 'string|max:255',
            'description' => 'string',
            'release_date' => 'date',
            'rating' => 'numeric|between:1,10',
            'views' => 'nullable|integer',
            'actor_id' => 'array',
            'actor_id.*' => 'integer|exists:actor,id',
            'director_id' => 'array',
            'director_id.*' => 'integer|exists:director,id',
            'movie_category_id' => 'array',
            'movie_category_id.*' => 'integer|exists:movie_category,id',
        ];
    }

    // public function messages(): array
    // {
    //     return [
    //         'movie_category_id.required' => 'The movie category field is required.',
    //         'movie_category_id.integer' => 'The movie category must be an integer.',
    //         'actor_id.required' => 'The actor field is required.',
    //         'actor_id.integer' => 'The actor must be an integer.',
    //         'director_id.required' => 'The director field is required.',
    //         'director_id.integer' => 'The director must be an integer.',
    //         'movie_name.required' => 'The movie name field is required.',
    //         'movie_name.string' => 'The movie name must be a string.',
    //         'movie_name.max' => 'The movie name may not be greater than 255 characters.',
    //         'movie_name.unique' => 'The movie name has already been taken.',
    //         'release_date.required' => 'The release date field is required.',
    //         'release_date.date' => 'The release date must be a date.',
    //         'age_limit.required' => 'The age limit field is required.',
    //         'age_limit.integer' => 'The age limit must be an integer.',
    //         'descriptions.string' => 'The descriptions must be a string.',
    //         'descriptions.max' => 'The descriptions may not be greater than 255 characters.',
    //         'trailer.string' => 'The trailer must be a string.',
    //         'trailer.max' => 'The trailer may not be greater than 255 characters.',
    //     ];
    // }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WebsiteSetting extends Model
{
    use HasFactory;
    protected $fillable = [
        'site_name',
        'tagline',
        'email',
        'phone',
        'address',
        'working_hours',
        'business_license',
        'facebook_link',
        'youtube_link',
        'instagram_link',
        'copyright',
        'privacy_policy',
        'logo',
        'privacy_image',
        'terms_image',
        'about_image',
    ];
}

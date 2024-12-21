<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;
    protected $table = 'location';
    protected $primaryKey = 'id';
    protected $fillable = [
        'location_name',
    ];
    public function cinema(){
        return $this->hasMany(Cinema::class);
    }
}

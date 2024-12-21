<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayMethod extends Model
{
    use HasFactory;
    protected $table = 'pay_method';
    protected $primaryKey = 'id';
    protected $fillable = [
        'pay_method_name',
        'status',
    ];
}

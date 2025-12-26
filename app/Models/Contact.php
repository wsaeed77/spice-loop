<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'phone',
        'name',
        'email',
        'address',
        'postcode',
        'is_existing_customer',
        'allow_promotions',
    ];

    protected $casts = [
        'is_existing_customer' => 'boolean',
        'allow_promotions' => 'boolean',
    ];
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CateringRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'event_type',
        'event_date',
        'number_of_guests',
        'location',
        'special_requirements',
        'status',
    ];

    protected $casts = [
        'event_date' => 'date',
        'number_of_guests' => 'integer',
    ];
}

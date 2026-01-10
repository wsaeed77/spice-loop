<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'city_id',
        'total_amount',
        'delivery_charge',
        'status',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'customer_postcode',
        'allergies',
        'notes',
        'delivery_date',
        'delivery_time',
        'delivery_distance',
    ];

    protected $casts = [
        'total_amount' => 'decimal:2',
        'delivery_charge' => 'decimal:2',
        'delivery_date' => 'date',
        'delivery_distance' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function city()
    {
        return $this->belongsTo(City::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}

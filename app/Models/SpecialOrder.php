<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SpecialOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_item_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'customer_address',
        'special_instructions',
        'quantity',
        'status',
        'admin_notes',
    ];

    protected $casts = [
        'quantity' => 'integer',
    ];

    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }
}


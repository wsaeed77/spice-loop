<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItemCalculator extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_item_id',
        'ingredients',
        'packaging_cost',
        'delivery_cost',
        'others_cost',
        'total_cost',
    ];

    protected $casts = [
        'ingredients' => 'array',
        'packaging_cost' => 'decimal:2',
        'delivery_cost' => 'decimal:2',
        'others_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }
}


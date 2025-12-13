<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MenuItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'image',
        'category',
        'is_available',
        'is_available_today',
        'is_subscription_item',
        'is_featured',
        'is_weekend_special',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_available' => 'boolean',
        'is_available_today' => 'boolean',
        'is_subscription_item' => 'boolean',
        'is_featured' => 'boolean',
        'is_weekend_special' => 'boolean',
    ];

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function weeklyMenuOptions()
    {
        return $this->hasMany(WeeklyMenuOption::class);
    }

    public function dailySelections()
    {
        return $this->hasMany(DailySelection::class);
    }
}

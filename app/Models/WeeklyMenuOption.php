<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WeeklyMenuOption extends Model
{
    use HasFactory;

    protected $fillable = [
        'menu_item_id',
        'day_of_week',
        'is_available',
    ];

    protected $casts = [
        'is_available' => 'boolean',
    ];

    public function menuItem()
    {
        return $this->belongsTo(MenuItem::class);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CostCalculatorController extends Controller
{
    public function index()
    {
        $deliveryCost = (float) Setting::get('delivery_cost', '0.00');
        
        return Inertia::render('Admin/CostCalculator/Index', [
            'deliveryCost' => $deliveryCost,
        ]);
    }
}


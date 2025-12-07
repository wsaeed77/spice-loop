<?php

namespace App\Http\Controllers;

use App\Models\CateringRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CateringController extends Controller
{
    public function index()
    {
        return Inertia::render('Catering');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'event_type' => 'required|string|max:255',
            'event_date' => 'required|date|after:today',
            'number_of_guests' => 'required|integer|min:1',
            'location' => 'required|string',
            'special_requirements' => 'nullable|string',
        ]);

        CateringRequest::create([
            ...$validated,
            'status' => 'pending',
        ]);

        return redirect()->route('catering')->with('message', 'Catering request submitted successfully! We will contact you soon.');
    }
}

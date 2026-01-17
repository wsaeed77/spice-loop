<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('ContactSubscription');
    }

    public function store(Request $request)
    {

        $validated = $request->validate([
            'phone' => 'required|string|max:255',
            'name' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'postcode' => 'nullable|string|max:255',
            'allow_promotions' => 'boolean',
        ]);

        // Use updateOrCreate to handle existing phone numbers
        Contact::updateOrCreate(
            ['phone' => $validated['phone']],
            [
                'name' => $validated['name'] ?? null,
                'address' => $validated['address'] ?? null,
                'postcode' => $validated['postcode'] ?? null,
                'allow_promotions' => $validated['allow_promotions'] ?? false,
            ]
        );

        return redirect()->route('contact-subscription')->with('message', 'Thank you! Your information has been saved. You will receive updates based on your preferences.');
    }
}


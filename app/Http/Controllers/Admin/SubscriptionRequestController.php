<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SubscriptionRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubscriptionRequestController extends Controller
{
    public function index()
    {
        $subscriptionRequests = SubscriptionRequest::latest()->paginate(20);

        return Inertia::render('Admin/SubscriptionRequests/Index', [
            'subscriptionRequests' => $subscriptionRequests,
        ]);
    }

    public function show($id)
    {
        $subscriptionRequest = SubscriptionRequest::findOrFail($id);

        return Inertia::render('Admin/SubscriptionRequests/Show', [
            'subscriptionRequest' => [
                'id' => $subscriptionRequest->id,
                'name' => $subscriptionRequest->name,
                'email' => $subscriptionRequest->email,
                'phone' => $subscriptionRequest->phone,
                'address' => $subscriptionRequest->address,
                'city' => $subscriptionRequest->city,
                'status' => $subscriptionRequest->status,
                'notes' => $subscriptionRequest->notes,
                'created_at' => $subscriptionRequest->created_at,
                'updated_at' => $subscriptionRequest->updated_at,
            ],
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $subscriptionRequest = SubscriptionRequest::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected',
            'notes' => 'nullable|string',
        ]);

        $subscriptionRequest->update($validated);

        return redirect()->back()->with('message', 'Subscription request status updated successfully!');
    }
}


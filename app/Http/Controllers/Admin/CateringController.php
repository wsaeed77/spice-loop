<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CateringRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CateringController extends Controller
{
    public function index()
    {
        $cateringRequests = CateringRequest::latest()->paginate(20);

        return Inertia::render('Admin/Catering/Index', [
            'cateringRequests' => $cateringRequests,
        ]);
    }

    public function show($id)
    {
        $cateringRequest = CateringRequest::findOrFail($id);

        return Inertia::render('Admin/Catering/Show', [
            'cateringRequest' => [
                'id' => $cateringRequest->id,
                'name' => $cateringRequest->name,
                'email' => $cateringRequest->email,
                'phone' => $cateringRequest->phone,
                'event_type' => $cateringRequest->event_type,
                'event_date' => $cateringRequest->event_date,
                'number_of_guests' => $cateringRequest->number_of_guests,
                'location' => $cateringRequest->location,
                'special_requirements' => $cateringRequest->special_requirements,
                'status' => $cateringRequest->status,
                'created_at' => $cateringRequest->created_at,
                'updated_at' => $cateringRequest->updated_at,
            ],
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $cateringRequest = CateringRequest::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:pending,contacted,confirmed,completed,cancelled',
        ]);

        $cateringRequest->update($validated);

        return redirect()->back()->with('message', 'Catering request status updated successfully!');
    }
}

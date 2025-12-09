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

    public function show(CateringRequest $cateringRequest)
    {
        return Inertia::render('Admin/Catering/Show', [
            'cateringRequest' => $cateringRequest,
        ]);
    }

    public function updateStatus(Request $request, CateringRequest $cateringRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,contacted,confirmed,completed,cancelled',
        ]);

        $cateringRequest->update($validated);

        return redirect()->back()->with('message', 'Catering request status updated successfully!');
    }
}

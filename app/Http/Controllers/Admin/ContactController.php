<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        $contacts = Contact::latest()->paginate(20);

        return Inertia::render('Admin/Contacts/Index', [
            'contacts' => $contacts,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Contacts/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'phone' => 'required|string|max:255|unique:contacts,phone',
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'postcode' => 'nullable|string|max:255',
            'is_existing_customer' => 'boolean',
            'allow_sms_promotions' => 'boolean',
            'allow_whatsapp_promotions' => 'boolean',
        ]);

        Contact::create($validated);

        return redirect()->route('admin.contacts.index')->with('message', 'Contact created successfully!');
    }

    public function edit(Contact $contact)
    {
        return Inertia::render('Admin/Contacts/Edit', [
            'contact' => $contact,
        ]);
    }

    public function update(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'phone' => 'required|string|max:255|unique:contacts,phone,' . $contact->id,
            'name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'postcode' => 'nullable|string|max:255',
            'is_existing_customer' => 'boolean',
            'allow_sms_promotions' => 'boolean',
            'allow_whatsapp_promotions' => 'boolean',
        ]);

        $contact->update($validated);

        return redirect()->route('admin.contacts.index')->with('message', 'Contact updated successfully!');
    }

    public function destroy(Contact $contact)
    {
        $contact->delete();

        return redirect()->route('admin.contacts.index')->with('message', 'Contact deleted successfully!');
    }
}


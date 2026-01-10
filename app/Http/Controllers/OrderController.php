<?php

namespace App\Http\Controllers;

use App\Mail\NewOrderNotification;
use App\Services\SmsService;
use App\Models\City;
use App\Models\Contact;
use App\Models\MenuItem;
use App\Models\MenuItemOption;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'city_id' => 'required|exists:cities,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string|max:255',
            'customer_postcode' => 'required|string|max:20',
            'allergies' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.menu_item_option_id' => 'nullable|exists:menu_item_options,id',
            'notes' => 'nullable|string',
        ]);

        $city = City::findOrFail($validated['city_id']);
        if (!$city->is_active) {
            throw ValidationException::withMessages([
                'city_id' => 'Orders are not available for this city.',
            ]);
        }

        DB::beginTransaction();
        try {
            $subtotal = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $menuItem = MenuItem::findOrFail($item['menu_item_id']);
                if (!$menuItem->is_available) {
                    throw ValidationException::withMessages([
                        'items' => "Item {$menuItem->name} is not available.",
                    ]);
                }

                // Get price from variant if option is selected, otherwise use menu item price
                $itemPrice = $menuItem->price;
                $menuItemOptionId = null;
                
                if (!empty($item['menu_item_option_id'])) {
                    $menuItemOption = MenuItemOption::where('id', $item['menu_item_option_id'])
                        ->where('menu_item_id', $menuItem->id)
                        ->first();
                    
                    if ($menuItemOption) {
                        $itemPrice = $menuItemOption->price;
                        $menuItemOptionId = $menuItemOption->id;
                    }
                }

                $itemTotal = $itemPrice * $item['quantity'];
                $subtotal += $itemTotal;

                $orderItems[] = [
                    'menu_item_id' => $menuItem->id,
                    'menu_item_option_id' => $menuItemOptionId,
                    'quantity' => $item['quantity'],
                    'price' => $itemPrice,
                ];
            }

            // Calculate delivery charge (if subtotal < £10)
            $deliveryCost = (float) Setting::get('delivery_cost', '0.00');
            $deliveryCharge = $subtotal > 0 && $subtotal < 10 ? $deliveryCost : 0;
            $totalAmount = $subtotal + $deliveryCharge;

            $order = Order::create([
                'user_id' => auth()->id(),
                'city_id' => $validated['city_id'],
                'total_amount' => $totalAmount,
                'delivery_charge' => $deliveryCharge,
                'customer_name' => $validated['customer_name'],
                'customer_email' => (!empty($validated['customer_email']) && trim($validated['customer_email']) !== '') ? trim($validated['customer_email']) : null,
                'customer_phone' => $validated['customer_phone'],
                'customer_address' => $validated['customer_address'],
                'customer_postcode' => $validated['customer_postcode'],
                'allergies' => $validated['allergies'],
                'notes' => $validated['notes'] ?? null,
                'status' => 'pending',
            ]);

            foreach ($orderItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'menu_item_option_id' => $item['menu_item_option_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                ]);
            }

            DB::commit();

            // Create or update contact with existing customer flag
            try {
                Contact::updateOrCreate(
                    ['phone' => $validated['customer_phone']],
                    [
                        'name' => $validated['customer_name'],
                        'email' => $validated['customer_email'] ?? null,
                        'address' => $validated['customer_address'],
                        'postcode' => $validated['customer_postcode'],
                        'is_existing_customer' => true,
                    ]
                );
            } catch (\Exception $e) {
                // Log the error but don't fail the order creation
                \Log::error('Failed to create/update contact for order #' . $order->id . ': ' . $e->getMessage());
            }

            // Refresh order and load relationships for email
            $order->refresh();
            $order->load(['orderItems.menuItem', 'orderItems.menuItemOption', 'city', 'user']);

            // Send email notification to info@spiceloop.com and spiceloop2@gmail.com
            try {
                $mailDriver = config('mail.default');
                if ($mailDriver === 'log') {
                    \Log::warning('Email not sent: Mail driver is set to "log". Configure MAIL_MAILER in .env file to actually send emails (e.g., smtp, mailgun, etc.)');
                } else {
                    Mail::to(['info@spiceloop.com', 'spiceloop2@gmail.com'])->send(new NewOrderNotification($order));
                    \Log::info('Order notification email sent successfully for order #' . $order->id);
                }
            } catch (\Exception $e) {
                // Log the error but don't fail the order creation
                \Log::error('Failed to send order notification email for order #' . $order->id . ': ' . $e->getMessage(), [
                    'exception' => $e,
                    'trace' => $e->getTraceAsString()
                ]);
            }

            // Send SMS notification
            try {
                $smsService = new SmsService();
                $smsService->sendOrderNotification($order);
            } catch (\Exception $e) {
                // Log the error but don't fail the order creation
                \Log::error('Failed to send order notification SMS: ' . $e->getMessage());
            }

            return redirect()->route('menu')->with('message', 'Order placed successfully! We will contact you soon.');
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}

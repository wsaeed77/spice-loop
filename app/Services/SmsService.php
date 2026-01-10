<?php

namespace App\Services;

use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected $client;
    protected $fromNumber;
    protected $toNumber;

    public function __construct()
    {
        // Check if cURL extension is available (required for Twilio)
        if (!extension_loaded('curl')) {
            Log::warning('SMS not available: cURL extension is not loaded. Please enable cURL extension in PHP.');
            $this->client = null;
            return;
        }

        $accountSid = config('services.twilio.account_sid');
        $authToken = config('services.twilio.auth_token');
        $this->fromNumber = config('services.twilio.from_number');
        $this->toNumber = config('services.twilio.to_number');

        if ($accountSid && $authToken) {
            try {
                $this->client = new Client($accountSid, $authToken);
            } catch (\Throwable $e) {
                Log::error('Failed to initialize Twilio client: ' . $e->getMessage(), [
                    'exception' => $e,
                    'exception_class' => get_class($e)
                ]);
                $this->client = null;
            }
        }
    }

    /**
     * Send SMS message
     *
     * @param string $message
     * @return bool
     */
    public function send(string $message): bool
    {
        $accountSid = config('services.twilio.account_sid');
        $authToken = config('services.twilio.auth_token');
        $fromNumber = config('services.twilio.from_number');
        $toNumber = config('services.twilio.to_number');

        $missing = [];
        if (!$accountSid) $missing[] = 'TWILIO_ACCOUNT_SID';
        if (!$authToken) $missing[] = 'TWILIO_AUTH_TOKEN';
        if (!$fromNumber) $missing[] = 'TWILIO_FROM_NUMBER';
        if (!$toNumber) $missing[] = 'TWILIO_TO_NUMBER';

        if (!empty($missing)) {
            Log::warning('SMS not sent: Missing Twilio configuration. Please set the following in your .env file: ' . implode(', ', $missing));
            return false;
        }

        if (!$this->client || !$this->fromNumber || !$this->toNumber) {
            Log::warning('SMS not sent: Twilio client initialization failed');
            return false;
        }

        try {
            $this->client->messages->create(
                $this->toNumber,
                [
                    'from' => $this->fromNumber,
                    'body' => $message,
                ]
            );

            Log::info('SMS sent successfully to ' . $this->toNumber);
            return true;
        } catch (\Throwable $e) {
            Log::error('Failed to send SMS: ' . $e->getMessage(), [
                'exception' => $e,
                'exception_class' => get_class($e),
                'from' => $this->fromNumber,
                'to' => $this->toNumber,
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Send order notification SMS
     *
     * @param \App\Models\Order $order
     * @return bool
     */
    public function sendOrderNotification(\App\Models\Order $order): bool
    {
        $message = "New Order #{$order->id} received!\n";
        $message .= "Customer: {$order->customer_name}\n";
        $message .= "Phone: {$order->customer_phone}\n";
        $message .= "Total: £" . number_format($order->total_amount, 2) . "\n";
        $message .= "Items: " . $order->orderItems->count() . " item(s)";

        return $this->send($message);
    }

    /**
     * Send SMS to a specific phone number
     *
     * @param string $toPhoneNumber
     * @param string $message
     * @return bool
     */
    public function sendToPhone(string $toPhoneNumber, string $message): bool
    {
        // Check if cURL extension is available
        if (!extension_loaded('curl')) {
            Log::warning('SMS not sent: cURL extension is not loaded. Please enable cURL extension in PHP.');
            return false;
        }

        $accountSid = config('services.twilio.account_sid');
        $authToken = config('services.twilio.auth_token');
        $fromNumber = config('services.twilio.from_number');

        $missing = [];
        if (!$accountSid) $missing[] = 'TWILIO_ACCOUNT_SID';
        if (!$authToken) $missing[] = 'TWILIO_AUTH_TOKEN';
        if (!$fromNumber) $missing[] = 'TWILIO_FROM_NUMBER';

        if (!empty($missing)) {
            Log::warning('SMS not sent: Missing Twilio configuration. Please set the following in your .env file: ' . implode(', ', $missing));
            return false;
        }

        if (!$this->client || !$fromNumber) {
            Log::warning('SMS not sent: Twilio client initialization failed');
            return false;
        }

        try {
            $this->client->messages->create(
                $toPhoneNumber,
                [
                    'from' => $fromNumber,
                    'body' => $message,
                ]
            );

            Log::info('SMS sent successfully to ' . $toPhoneNumber);
            return true;
        } catch (\Throwable $e) {
            Log::error('Failed to send SMS: ' . $e->getMessage(), [
                'exception' => $e,
                'exception_class' => get_class($e),
                'from' => $fromNumber,
                'to' => $toPhoneNumber,
                'trace' => $e->getTraceAsString()
            ]);
            return false;
        }
    }

    /**
     * Send order assignment SMS to rider
     *
     * @param \App\Models\Order $order
     * @param \App\Models\DeliveryRider $rider
     * @return bool
     */
    public function sendOrderAssignmentToRider(\App\Models\Order $order, \App\Models\DeliveryRider $rider): bool
    {
        // Calculate daily order number
        $orderDate = \Carbon\Carbon::parse($order->created_at)->startOfDay();
        $dailyOrderNumber = \App\Models\Order::whereDate('created_at', $orderDate->format('Y-m-d'))
            ->where(function($query) use ($order) {
                $query->where('created_at', '<', $order->created_at)
                    ->orWhere(function($q) use ($order) {
                        $q->where('created_at', $order->created_at)
                          ->where('id', '<=', $order->id);
                    });
            })
            ->count();
        
        $deliveryDate = $order->delivery_date ? \Carbon\Carbon::parse($order->delivery_date)->format('d M Y') : 'N/A';
        $deliveryTime = $order->delivery_time ? (is_string($order->delivery_time) ? substr($order->delivery_time, 0, 5) : $order->delivery_time->format('H:i')) : 'N/A';
        
        // Load relationships if not already loaded
        if (!$order->relationLoaded('city')) {
            $order->load('city');
        }
        if (!$order->relationLoaded('orderItems')) {
            $order->load('orderItems.menuItem');
        }
        
        $message = "NEW DELIVERY ASSIGNED\n\n";
        $message .= "Order #{$dailyOrderNumber}\n";
        $message .= "Customer: {$order->customer_name}\n";
        $message .= "Phone: {$order->customer_phone}\n";
        $message .= "Address: {$order->customer_address}";
        if ($order->customer_postcode) {
            $message .= ", {$order->customer_postcode}";
        }
        $message .= "\n";
        if ($order->city) {
            $message .= "City: {$order->city->name}\n";
        }
        $message .= "Delivery: {$deliveryDate} at {$deliveryTime}\n";
        if ($order->delivery_distance) {
            $message .= "Drive time: {$order->delivery_distance} minutes\n";
        }
        $message .= "Total: £" . number_format($order->total_amount, 2) . "\n\n";
        
        $message .= "Items:\n";
        foreach ($order->orderItems as $item) {
            $itemName = $item->custom_item_name ? $item->custom_item_name : ($item->menuItem->name ?? 'Unknown Item');
            $message .= "- {$itemName} x{$item->quantity} (£" . number_format($item->price * $item->quantity, 2) . ")\n";
        }
        
        if ($order->notes) {
            $message .= "\nNotes: {$order->notes}";
        }

        return $this->sendToPhone($rider->phone, $message);
    }
}


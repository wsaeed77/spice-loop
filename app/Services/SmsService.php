<?php

namespace App\Services;

use Twilio\Rest\Client;
use Illuminate\Support\Facades\Log;

class SmsService
{
    protected $client;

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
        
        // Debug: Log the actual value being used
        Log::info('SMS Service - TWILIO_TO_NUMBER value', [
            'to_number' => $toNumber,
            'from_env' => env('TWILIO_TO_NUMBER'),
            'from_config' => config('services.twilio.to_number')
        ]);

        $missing = [];
        if (!$accountSid) $missing[] = 'TWILIO_ACCOUNT_SID';
        if (!$authToken) $missing[] = 'TWILIO_AUTH_TOKEN';
        if (!$fromNumber) $missing[] = 'TWILIO_FROM_NUMBER';
        if (!$toNumber) $missing[] = 'TWILIO_TO_NUMBER';

        if (!empty($missing)) {
            Log::warning('SMS not sent: Missing Twilio configuration. Please set the following in your .env file: ' . implode(', ', $missing));
            return false;
        }

        if (!$this->client) {
            Log::warning('SMS not sent: Twilio client initialization failed');
            return false;
        }

        try {
            $this->client->messages->create(
                $toNumber,
                [
                    'from' => $fromNumber,
                    'body' => $message,
                ]
            );

            Log::info('SMS sent successfully to ' . $toNumber);
            return true;
        } catch (\Throwable $e) {
            Log::error('Failed to send SMS: ' . $e->getMessage(), [
                'exception' => $e,
                'exception_class' => get_class($e),
                'from' => $fromNumber,
                'to' => $toNumber,
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

        if (!$this->client) {
            Log::warning('SMS not sent: Twilio client initialization failed');
            return false;
        }
        
        if (!$fromNumber) {
            Log::warning('SMS not sent: TWILIO_FROM_NUMBER is not configured');
            return false;
        }

        // Normalize phone numbers to E.164 format
        $normalizedTo = $this->normalizePhoneNumber($toPhoneNumber);
        $normalizedFrom = $this->normalizePhoneNumber($fromNumber);

        try {
            $this->client->messages->create(
                $normalizedTo,
                [
                    'from' => $normalizedFrom,
                    'body' => $message,
                ]
            );

            Log::info('SMS sent successfully', [
                'to' => $normalizedTo,
                'from' => $normalizedFrom
            ]);
            return true;
        } catch (\Twilio\Exceptions\TwilioException $e) {
            // Twilio-specific exceptions
            $errorMessage = $e->getMessage();
            $errorCode = $e->getCode();
            
            // Check for common Twilio errors
            $userFriendlyMessage = $errorMessage;
            if (str_contains($errorMessage, 'Unable to create record')) {
                if (str_contains($errorMessage, 'From')) {
                    $userFriendlyMessage = "Invalid 'From' phone number ({$normalizedFrom}). Please verify this number is active in your Twilio account and has SMS capabilities enabled.";
                } elseif (str_contains($errorMessage, 'To')) {
                    $userFriendlyMessage = "Invalid 'To' phone number ({$normalizedTo}). For trial accounts, you can only send to verified numbers. Verify the number in Twilio Console or upgrade your account.";
                } else {
                    $userFriendlyMessage = "Cannot send SMS with these phone numbers. Check that both numbers are valid and your Twilio account has proper permissions.";
                }
            } elseif (str_contains($errorMessage, 'not a valid')) {
                $userFriendlyMessage = "Phone number format is invalid. Ensure numbers are in E.164 format (e.g., +447857110325).";
            } elseif (str_contains($errorMessage, 'trial')) {
                $userFriendlyMessage = "Trial account restriction: You can only send SMS to verified phone numbers. Add this number in Twilio Console or upgrade your account.";
            }

            Log::error('Failed to send SMS (Twilio Error): ' . $userFriendlyMessage, [
                'original_error' => $errorMessage,
                'error_code' => $errorCode,
                'from' => $normalizedFrom,
                'to' => $normalizedTo,
                'exception_class' => get_class($e)
            ]);
            return false;
        } catch (\Throwable $e) {
            Log::error('Failed to send SMS: ' . $e->getMessage(), [
                'exception' => $e,
                'exception_class' => get_class($e),
                'from' => $normalizedFrom,
                'to' => $normalizedTo,
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
        $deliveryDate = $order->delivery_date ? \Carbon\Carbon::parse($order->delivery_date)->format('d M Y') : 'N/A';
        $deliveryTime = $order->delivery_time ? (is_string($order->delivery_time) ? substr($order->delivery_time, 0, 5) : $order->delivery_time->format('H:i')) : 'N/A';
        
        // Load relationships if not already loaded
        if (!$order->relationLoaded('orderItems')) {
            $order->load('orderItems.menuItem');
        }
        
        // Format address with postcode
        $address = $order->customer_address;
        if ($order->customer_postcode) {
            $address .= ', ' . $order->customer_postcode;
        }
        
        // Build message with exact format and spacing as shown in image
        $message = "Phone: {$order->customer_phone}\n";
        $message .= "Address: {$address}\n";
        $message .= "Delivery: {$deliveryDate} at {$deliveryTime}\n";
        $message .= "\n";
        $message .= "Total: £" . number_format($order->total_amount, 2) . "\n";
        $message .= "\n";
        $message .= "Items:\n";
        foreach ($order->orderItems as $item) {
            $itemName = $item->custom_item_name ? $item->custom_item_name : ($item->menuItem->name ?? 'Unknown Item');
            $itemTotal = $item->price * $item->quantity;
            $message .= "{$itemName} x{$item->quantity} (£" . number_format($itemTotal, 2) . ")\n";
        }

        // Normalize phone number format (ensure E.164 format)
        $phoneNumber = $this->normalizePhoneNumber($rider->phone);
        
        return $this->sendToPhone($phoneNumber, $message);
    }

    /**
     * Normalize phone number to E.164 format (required by Twilio)
     * 
     * @param string $phone
     * @return string
     */
    private function normalizePhoneNumber(string $phone): string
    {
        // Remove all non-digit characters except +
        $phone = preg_replace('/[^\d+]/', '', $phone);
        
        // If phone doesn't start with +, assume UK number and add +44
        if (substr($phone, 0, 1) !== '+') {
            // Remove leading 0 if present
            if (substr($phone, 0, 1) === '0') {
                $phone = substr($phone, 1);
            }
            $phone = '+44' . $phone;
        }
        
        // Ensure +44 format (UK) is correct - remove duplicate +44 if present
        if (substr($phone, 0, 3) === '+44') {
            // Remove any duplicate +44 prefix
            $phone = '+44' . preg_replace('/^\+44/', '', $phone);
        }
        
        return $phone;
    }
}


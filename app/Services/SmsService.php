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
        $accountSid = config('services.twilio.account_sid');
        $authToken = config('services.twilio.auth_token');
        $this->fromNumber = config('services.twilio.from_number');
        $this->toNumber = config('services.twilio.to_number');

        if ($accountSid && $authToken) {
            $this->client = new Client($accountSid, $authToken);
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
        if (!$this->client || !$this->fromNumber || !$this->toNumber) {
            Log::warning('SMS not sent: Twilio credentials or phone numbers not configured');
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

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send SMS: ' . $e->getMessage());
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
}


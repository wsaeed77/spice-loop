<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order Notification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .order-info {
            background-color: #fff;
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .order-info h2 {
            margin-top: 0;
            color: #d32f2f;
        }
        .info-row {
            margin-bottom: 10px;
        }
        .info-label {
            font-weight: bold;
            display: inline-block;
            width: 150px;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .items-table th,
        .items-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        .items-table th {
            background-color: #f8f9fa;
            font-weight: bold;
        }
        .total-row {
            font-weight: bold;
            font-size: 1.1em;
        }
        .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            font-size: 0.9em;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>New Order Received</h1>
        <p>A new order has been placed and requires your attention.</p>
    </div>

    <div class="order-info">
        <h2>Order #{{ $order->id }}</h2>
        
        <div class="info-row">
            <span class="info-label">Customer Name:</span>
            <span>{{ $order->customer_name }}</span>
        </div>
        
        <div class="info-row">
            <span class="info-label">Email:</span>
            <span>{{ $order->customer_email ?? 'N/A' }}</span>
        </div>
        
        <div class="info-row">
            <span class="info-label">Phone:</span>
            <span>{{ $order->customer_phone }}</span>
        </div>
        
        <div class="info-row">
            <span class="info-label">Address:</span>
            <span>{{ $order->customer_address }}</span>
        </div>
        
        <div class="info-row">
            <span class="info-label">Postcode:</span>
            <span>{{ $order->customer_postcode }}</span>
        </div>
        
        <div class="info-row">
            <span class="info-label">City:</span>
            <span>{{ $order->city->name ?? 'N/A' }}</span>
        </div>
        
        @if($order->allergies)
        <div class="info-row">
            <span class="info-label">Allergies:</span>
            <span>{{ $order->allergies }}</span>
        </div>
        @endif
        
        @if($order->notes)
        <div class="info-row">
            <span class="info-label">Notes:</span>
            <span>{{ $order->notes }}</span>
        </div>
        @endif
        
        <div class="info-row">
            <span class="info-label">Status:</span>
            <span style="text-transform: capitalize;">{{ $order->status }}</span>
        </div>
        
        <div class="info-row">
            <span class="info-label">Order Date:</span>
            <span>{{ $order->created_at->format('F j, Y g:i A') }}</span>
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Option</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                @foreach($order->orderItems as $item)
                <tr>
                    <td>{{ $item->menuItem->name }}</td>
                    <td>{{ $item->menuItemOption ? $item->menuItemOption->name : 'Standard' }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>£{{ number_format($item->price, 2) }}</td>
                    <td>£{{ number_format($item->price * $item->quantity, 2) }}</td>
                </tr>
                @endforeach
            </tbody>
            <tfoot>
                @if($order->delivery_charge > 0)
                <tr>
                    <td colspan="4" style="text-align: right;">Delivery Charge:</td>
                    <td>£{{ number_format($order->delivery_charge, 2) }}</td>
                </tr>
                @endif
                <tr class="total-row">
                    <td colspan="4" style="text-align: right;">Total Amount:</td>
                    <td>£{{ number_format($order->total_amount, 2) }}</td>
                </tr>
            </tfoot>
        </table>
    </div>

    <div class="footer">
        <p>This is an automated notification from Spice Loop.</p>
        <p>Please log in to your admin panel to process this order.</p>
    </div>
</body>
</html>


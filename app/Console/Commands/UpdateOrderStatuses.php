<?php

namespace App\Console\Commands;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateOrderStatuses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'orders:update-statuses';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Automatically update order statuses based on delivery time';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $now = Carbon::now();
        
        // Get orders that have delivery date and time set and are still pending
        $orders = Order::where('status', 'pending')
            ->whereNotNull('delivery_date')
            ->whereNotNull('delivery_time')
            ->get();

        $updatedCount = 0;

        foreach ($orders as $order) {
            $deliveryDateTime = Carbon::parse($order->delivery_date . ' ' . $order->delivery_time);
            $hoursRemaining = $now->diffInHours($deliveryDateTime, false);

            // Automatically change to "In Queue" if 3 hours or less remaining
            if ($hoursRemaining <= 3 && $hoursRemaining >= 0) {
                $order->update(['status' => 'In Queue']);
                $updatedCount++;
                $this->info("Order #{$order->id} status updated to 'In Queue' ({$hoursRemaining} hours remaining)");
            }
        }

        if ($updatedCount > 0) {
            $this->info("Updated {$updatedCount} order(s) to 'In Queue' status.");
        } else {
            $this->info('No orders needed status updates.');
        }

        return Command::SUCCESS;
    }
}


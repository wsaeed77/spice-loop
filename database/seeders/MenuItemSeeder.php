<?php

namespace Database\Seeders;

use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menuItems = [
            // Curries
            [
                'name' => 'Butter Chicken',
                'description' => 'Creamy tomato-based curry with tender chicken pieces, cooked in butter and aromatic spices.',
                'price' => 16.99,
                'category' => 'Curries',
                'is_available' => true,
                'is_subscription_item' => true,
            ],
            [
                'name' => 'Chicken Tikka Masala',
                'description' => 'Grilled chicken chunks in a rich, creamy tomato and yogurt sauce with aromatic spices.',
                'price' => 17.99,
                'category' => 'Curries',
                'is_available' => true,
                'is_subscription_item' => true,
            ],
            [
                'name' => 'Lamb Vindaloo',
                'description' => 'Spicy and tangy curry with tender lamb, potatoes, and a blend of hot spices.',
                'price' => 19.99,
                'category' => 'Curries',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Palak Paneer',
                'description' => 'Fresh spinach curry with cubes of soft paneer cheese, seasoned with garlic and spices.',
                'price' => 14.99,
                'category' => 'Vegetarian',
                'is_available' => true,
                'is_subscription_item' => true,
            ],
            [
                'name' => 'Chana Masala',
                'description' => 'Chickpeas cooked in a flavorful tomato and onion gravy with traditional spices.',
                'price' => 13.99,
                'category' => 'Vegetarian',
                'is_available' => true,
                'is_subscription_item' => true,
            ],
            [
                'name' => 'Dal Makhani',
                'description' => 'Creamy black lentils and kidney beans slow-cooked with butter and spices.',
                'price' => 12.99,
                'category' => 'Vegetarian',
                'is_available' => true,
                'is_subscription_item' => true,
            ],

            // Biryanis
            [
                'name' => 'Chicken Biryani',
                'description' => 'Fragrant basmati rice layered with spiced chicken, caramelized onions, and saffron.',
                'price' => 18.99,
                'category' => 'Biryani',
                'is_available' => true,
                'is_subscription_item' => true,
            ],
            [
                'name' => 'Lamb Biryani',
                'description' => 'Aromatic basmati rice with tender lamb pieces, spices, and herbs.',
                'price' => 21.99,
                'category' => 'Biryani',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Vegetable Biryani',
                'description' => 'Fragrant rice cooked with mixed vegetables, spices, and saffron.',
                'price' => 15.99,
                'category' => 'Biryani',
                'is_available' => true,
                'is_subscription_item' => true,
            ],

            // Breads
            [
                'name' => 'Garlic Naan',
                'description' => 'Fresh baked flatbread brushed with garlic butter and herbs.',
                'price' => 4.99,
                'category' => 'Breads',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Butter Naan',
                'description' => 'Soft, fluffy bread brushed with butter, perfect for dipping.',
                'price' => 3.99,
                'category' => 'Breads',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Roti',
                'description' => 'Whole wheat flatbread, traditional and healthy.',
                'price' => 2.99,
                'category' => 'Breads',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Paratha',
                'description' => 'Flaky, layered flatbread, pan-fried to perfection.',
                'price' => 4.49,
                'category' => 'Breads',
                'is_available' => true,
                'is_subscription_item' => false,
            ],

            // Appetizers
            [
                'name' => 'Samosas (2 pieces)',
                'description' => 'Crispy pastry filled with spiced potatoes and peas, served with chutney.',
                'price' => 5.99,
                'category' => 'Appetizers',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Chicken Pakora',
                'description' => 'Chicken pieces marinated in spices, coated in chickpea flour and deep-fried.',
                'price' => 7.99,
                'category' => 'Appetizers',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Paneer Tikka',
                'description' => 'Grilled paneer cubes marinated in yogurt and spices, served with mint chutney.',
                'price' => 8.99,
                'category' => 'Appetizers',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Onion Bhaji',
                'description' => 'Crispy fritters made with sliced onions and chickpea flour.',
                'price' => 5.49,
                'category' => 'Appetizers',
                'is_available' => true,
                'is_subscription_item' => false,
            ],

            // Rice & Sides
            [
                'name' => 'Basmati Rice',
                'description' => 'Fragrant long-grain basmati rice, perfectly steamed.',
                'price' => 3.99,
                'category' => 'Sides',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Jeera Rice',
                'description' => 'Basmati rice cooked with cumin seeds and aromatic spices.',
                'price' => 4.99,
                'category' => 'Sides',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Raita',
                'description' => 'Cool yogurt with cucumber, mint, and spices.',
                'price' => 3.49,
                'category' => 'Sides',
                'is_available' => true,
                'is_subscription_item' => false,
            ],

            // Desserts
            [
                'name' => 'Gulab Jamun',
                'description' => 'Soft, sweet milk dumplings soaked in rose-flavored syrup.',
                'price' => 5.99,
                'category' => 'Desserts',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Kheer',
                'description' => 'Creamy rice pudding with cardamom, nuts, and saffron.',
                'price' => 5.49,
                'category' => 'Desserts',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Mango Lassi',
                'description' => 'Refreshing yogurt drink with fresh mango and a hint of cardamom.',
                'price' => 4.99,
                'category' => 'Beverages',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Sweet Lassi',
                'description' => 'Traditional yogurt drink, sweetened and flavored with rose water.',
                'price' => 3.99,
                'category' => 'Beverages',
                'is_available' => true,
                'is_subscription_item' => false,
            ],

            // More Curries
            [
                'name' => 'Rogan Josh',
                'description' => 'Aromatic lamb curry with yogurt, spices, and a rich, deep red color.',
                'price' => 20.99,
                'category' => 'Curries',
                'is_available' => true,
                'is_subscription_item' => false,
            ],
            [
                'name' => 'Saag Paneer',
                'description' => 'Creamy spinach curry with cubes of paneer cheese.',
                'price' => 15.99,
                'category' => 'Vegetarian',
                'is_available' => true,
                'is_subscription_item' => true,
            ],
            [
                'name' => 'Aloo Gobi',
                'description' => 'Potatoes and cauliflower cooked with onions, tomatoes, and spices.',
                'price' => 13.99,
                'category' => 'Vegetarian',
                'is_available' => true,
                'is_subscription_item' => true,
            ],
        ];

        foreach ($menuItems as $item) {
            MenuItem::create($item);
        }
    }
}

